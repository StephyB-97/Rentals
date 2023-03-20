/*File where all the Users middleware are found*/
const User = require('../models/user');

/*Route to send the user to the register screen*/
module.exports.renderRegister = (req,res)=>{
    res.render('users/register');
}


module.exports.register = async(req,res)=>{
    try {
        //If the creation of the user is succesfull
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        //necessary to not ask to login after registration
        req.login(registeredUser, err =>{
            if(err) return next(err);
            req.flash('success','Welcome to Rentals');
            res.redirect('/locations');
        })

    }catch(e){
        //if the creation is not succesfull
        req.flash('error', e.message);
        res.redirect('register');
    }
}

/*Login route to get the information */
module.exports.renderLogin = (req, res)=>{
    res.render('users/login');
}

/*Login route to send information to the server, passport is the one doing the login*/
module.exports.login = (req,res)=>{
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/locations'
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

/*Route for the user to logout*/
module.exports.logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/locations');
    });
}