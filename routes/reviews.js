/*Reviews routes file*/
const express = require('express');
const catchAsync = require("../utils/catchAsync");
const Location = require("../models/location");
const Review = require("../models/review");
const Reviews = require('../controllers/reviews');
const ExpressError = require("../utils/ExpressError");
const router = express.Router({mergeParams: true}); //required to accept the :id param
const {validateReview, isLoggedIn,isReviewAuthor} = require('../middleware');




//Route to add reviews for the selected rental
router.post('/',isLoggedIn, validateReview, catchAsync(Reviews.createReview))

/*Route to delete a review from specific rentals*/
router.delete('/:reviewId', isLoggedIn, isReviewAuthor,catchAsync(Reviews.deleteReview))

module.exports = router;