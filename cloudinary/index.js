/*File that contains all the code for the cloudinary image storage*/
const cloudinary = require('cloudinary').v2;
const{CloudinaryStorage}= require('multer-storage-cloudinary');

/*configuration of important information.*/
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

/*Instance of cloudinary storage*/
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Rentals',
        allowedFormat: ['jpeg', 'png', 'jpg', 'webp']
    }
});

module.exports ={
    cloudinary,
    storage
}