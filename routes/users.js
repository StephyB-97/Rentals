/*Route to redirect the user to register*/
const express=require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const flash = require('connect-flash');
const users = require('../controllers/users')


router.route('/register')
    /*Route to send the user to the register screen*/
    .get(users.renderRegister)
    /*Route to submit the collected information or registration of the user*/
    .post(catchAsync(users.register));

 router.route('/login')
/*Login route to get the information */
    .get(users.renderLogin)
     /*Login route to send information to the server, passport is the one doing the login*/
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', failureMessage: true, keepSessionInfo: true}), users.login)

/*Route for the user to logout*/
router.get('/logout', users.logout);


module.exports = router;