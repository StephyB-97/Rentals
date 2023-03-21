/*Main file of the application*/

/*Required to access the information in the .ENV file*/
if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}



const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);  //required for the upgrade of mongooose 7.0
const ejsMate= require('ejs-mate');   //required to use ejs-mate library for boilerplates
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user'); //required from the user.js models folder
const usersRoutes = require('./routes/users');
/*Require for the use of routes from the routes folder locations.js file*/
const locationsRoutes = require('./routes/locations');
const reviewsRoutes = require('./routes/reviews');
const mongoSanitize = require('express-mongo-sanitize');  //required for security reasons
const helmet = require('helmet');
const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL
const CloudinaryUsername = process.env.CLOUDINARY_USERNAME
/*const dbUrl = 'mongodb://localhost/Hotels';  //temporary url*/



/*Use the  variable dbUrl when deploying, to work locally keep it like that*/
// Connect to MongoDB using Mongoose
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
    });


const app = express();

app.engine('ejs', ejsMate);   //added to be able to use pre-defined templates
//configuration for app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(mongoSanitize({replaceWith: '_'}))

/*Tell Express to parse the body. The information sent when submitting a new property. MIDDLEWARE*/
app.use(express.urlencoded({extended:true}))
app.use (methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const secret = process.env.CLOUDINARY_SECRET

/*For memory session storage in Mongo*/
const store= MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60 // time period in second
});

store.on("error", function(e){
    console.log("Session store error",e )
})


//configuration of how long is a session for the website in general
const sessionConfig ={
    store,
    name: 'session',
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    expires: {
        httpOnly: true,
        expires: Date.now()+ 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());  //required to use flash
app.use(
    helmet({
       /* contentSecurityPolicy: false,*/
    })
);


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",

];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/",
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://res.cloudinary.com/dbaf6sthf"

];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    "http://res.cloudinary.com/dbaf6sthf"
];
const fontSrcUrls = ["https://res.cloudinary.com/dbaf6sthf" ];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                `https://res.cloudinary.com/${CloudinaryUsername}/`, //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
            mediaSrc   : [ `https://res.cloudinary.com/${CloudinaryUsername}/` ],
            childSrc   : [ "blob:" ]
        },
    }),
    helmet.crossOriginEmbedderPolicy({
        policy: "credentialless"
    })
);


app.use(passport.initialize());  //initialization of passport
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//Required to tell passport how to serialize a user in a session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


/*require for the use of locations.js middleware*/
app.use('/', usersRoutes)
app.use('/locations', locationsRoutes)
app.use('/locations/:id/reviews', reviewsRoutes)

app.get('/', (req,res)=>{
    res.render('home')
})


/*Route to catch invalid information format and return an error*/
app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not found', 404))
})

/*Error handler where any caught error will be redirected*/
app.use((err, req, res,next) =>{
   const {statusCode = 500} = err;
   if(!err.message) err.message = 'Oh No, Something went wrong!'
    res.status(statusCode).render('error', {err})

})

const port = process.env.PORT;
/*Connection*/
app.listen(port, () =>{
    console.log(`Serving on port ${port}`)
})