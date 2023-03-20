/*Schema for the rentals information*/
const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


/*Image Schema*/
const ImageSchema = new Schema({
    url: String,
    filename: String
});

/*code to add the image size to the URL*/
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = {toJSON: {virtuals: true}};

/*Creation of the Schema */
const LocationSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: { //reference
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    //array with information from the review schema
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, opts);

/*code to add the image size to the URL*/
LocationSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/locations/${this._id}">${this.title}</a></strong>
<p>${this.description.substring(0,20)}...</p>`
});

LocationSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Location', LocationSchema);

