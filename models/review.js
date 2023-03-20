/*Reviews of the website*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//define review schema
const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

//exportation
module.exports = mongoose.model("Review", reviewSchema);
