/*Middleware to check whether the user is logged in or not*/
const {locationSchema, reviewSchema} = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const Location = require("./models/location");
const Review = require('./models/review');



module.exports.isLoggedIn = (req, res, next)=>{
/*Store the url the user is requesting when not logged in to show it after login in*/
    //will only allow registered users to register rental places
    if(!req.isAuthenticated()){
        req.session.returnTo =  req.originalUrl
        req.flash('error',' You must be signed in first');
        return res.redirect('/login');
    }
    next();
}

/*Validation of the locations*/
module.exports.validateLocation= (req,res,next) =>{
    const {error} = locationSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}


/*Validation of Authors for authorizations*/
module.exports.isAuthor = async(req,res,next) =>{
    const {id} = req.params;
    const rental = await Location.findById(id);
    if(!rental.author.equals(req.user._id)){
        req.flash('error', 'Action valid for owner only');
        return res.redirect(`/locations/${id}`);
    }
    next();
}

/*Validation of author of each review*/
module.exports.isReviewAuthor = async(req,res,next) =>{
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'Action valid for owner only');
        return res.redirect(`/locations/${id}`);
    }
    next();
}


/*Validation of reviews*/
module.exports.validateReview= (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}