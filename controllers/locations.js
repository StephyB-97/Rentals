/*Controllers. All the functions from the routes are saved in this file to get exported
* to and only be called in the app.js file*/
const Location = require("../models/location");
const catchAsync = require("../utils/catchAsync");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const{cloudinary}=require('../cloudinary');


/*Route that shows all the Locations of the hotels and rentals as hyperlinks*/
module.exports.index = async (req,res)=>{
    const rentals = await Location.find({});  //save the rentals in a variable
    res.render('rentals/index', {rentals})
}

/*Route that shows the user the screen to add properties or rentals to the webpage*/
module.exports.renderNewForm = (req,res)=>{
    res.render('rentals/new');
}

/*Route which is the endpoint where the information added is going to be submitted to*/
module.exports.createNewRental = async(req,res, next)=>{
    const geoData= await geocoder.forwardGeocode({
        query: req.body.rental.location,
        limit: 1
    }).send()
    const rental = new Location(req.body.rental);    //new rental created
    rental.geometry = geoData.body.features[0].geometry;  //storage of the coordinates of
    rental.images =  req.files.map(f=>({url: f.path, filename: f.filename}));
    rental.author = req.user._id;     //associates the rental with the author(username)
    await rental.save();
    console.log(rental);
    req.flash('success', 'Successfully made a new rental!');
    res.redirect(`/locations/${rental._id}`)

}

/*Route that shows each individual rental once it is clicked. Info of it is shown*/
module.exports.showRental = async(req, res)=>{
    //Required to get the owner username of each rental and the username in each comment
    const rental = await Location.findById(req.params.id).populate({path:'reviews', populate: {path: 'author'}}).populate('author');   //.populate will show the reviews inserted by the users
    //If no rental is found using the URL then show this error to the user in the front end
    if(!rental){
        req.flash('error', 'Cannot find rental!');
        return res.redirect('/locations');
    }
    res.render('rentals/show', {rental});
}

/*Route that serves the form to edit it*/
module.exports.renderEditForm = async (req,res)=>{
    const {id} = req.params;
    const rental = await Location.findById(id)
    //If no rental is found to edit using the URL then show this error to the user in the front end
    if(!rental){
        req.flash('error', 'Cannot find rental!');
        return res.redirect('/locations');
    }
    res.render('rentals/edit', {rental});
}

/*Route that updates the information once it is edited*/
module.exports.updateRental = async(req,res)=>{
    //required to allow only authorized users to delete information from their rentals
    const {id} = req.params;
    console.log(req.body);
    const rental = await Location.findByIdAndUpdate(id, {...req.body.rental});
    const imgs = req.files.map(f=>({url: f.path, filename: f.filename}));
    rental.images.push(...imgs);
    await rental.save();
    //deletes the image from the website
    if(req.body.deleteImages){
        //deletes the image from cloudinary
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
       await rental.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}} });
       console.log(rental);
    }
    req.flash('success', 'Successfully updated Rental');
    res.redirect(`/locations/${rental._id}`)
}

/*Route to delete elements from the Available rentals list shown to the user*/
module.exports.deleteRental = async(req,res)=>{
    const {id}= req.params;
    await Location.findByIdAndDelete(id);
    req.flash('success', 'Succesfully deleted Rental');
    res.redirect('/locations');
}