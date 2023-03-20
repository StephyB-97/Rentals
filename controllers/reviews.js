/*File where all the functions and routes for reviews are found*/
const Location = require("../models/location");
const Review = require("../models/review");


//Route to add reviews for the selected rental
module.exports.createReview = async(req, res)=>{
    const rental = await Location.findById(req.params.id);
    const review= new Review(req.body.review);
    review.author = req.user._id;
    rental.reviews.push(review);
    await review.save();
    await rental.save();
    req.flash('success', 'New review added');
    res.redirect(`/locations/${rental._id}`);
}

module.exports.deleteReview = async(req,res)=>{
    const {id, reviewId} = req.params;
    await  Location.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Succesfully deleted review');
    res.redirect(`/locations/${id}`);
}