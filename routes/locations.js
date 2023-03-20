/*Window where the routes for locations are found*/
const express = require('express');
const catchAsync = require("../utils/catchAsync");
const Location = require("../models/location");
const router = express.Router();
const {isLoggedIn, isAuthor, validateLocation}= require('../middleware');
const locations = require('../controllers/locations');
const multer  = require('multer');
const {storage}= require('../cloudinary/index.js');
const upload = multer({ storage});

/*ROUTES WITH SIMILAR PATHS*/
router.route('/')
    /*Route that shows all the Locations of the hotels and rentals as hyperlinks*/
    .get(catchAsync(locations.index))
    /*Route which is the endpoint where the information added is going to be submitted to*/
    .post(isLoggedIn, upload.array('image'),validateLocation,catchAsync(locations.createNewRental))


/*Route that shows the user the screen to add properties or rentals to the webpage*/
router.get('/new', isLoggedIn, locations.renderNewForm)


/*ROUTES WITH SIMILAR PATHS*/
router.route('/:id')
/*Route that shows each individual rental once it is clicked. Info of it is shown*/
    .get(catchAsync(locations.showRental))
/*Route that updates the information once it is edited*/
    .put(isLoggedIn,isAuthor, upload.array('image'),validateLocation, catchAsync(locations.updateRental))
    /*Route to delete elements from the Available rentals list shown to the user*/
    .delete( isLoggedIn,isAuthor, catchAsync(locations.deleteRental))


/*Route that serves the form to edit it*/
router.get('/:id/edit', isLoggedIn, isAuthor,catchAsync(locations.renderEditForm));


module.exports = router;