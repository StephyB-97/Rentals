const mongoose = require('mongoose');
mongoose.set('strictQuery', false);              //required for the upgrade of mongooose 7.0
const {places, descriptors} = require('./seedHelpers');    //required to use the places and descriptors lists
const cities = require('./cities');              //export to use the cities list
const Location = require('../models/location');  //export for location model


// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost/Hotels', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
    });

//pick random element from an array. The array of places
const sample = array => array[Math.floor(Math.random()* array.length)];




const seedDB = async ()=>{
    await Location.deleteMany({});   //use to delete anything that might be in the database
    for(let i =0; i < 8; i++){
        const random1000 = Math.floor(Math.random()* 1000);
        const price = Math.floor(Math.random()* 20)+ 10;
        const loc = new Location({
            author: '64020e0bb82db8e8d7e36e1b',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'A description of the image should go here!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dbaf6sthf/image/upload/v1679090752/Rentals/x7mnzzm52wmjm3chxqxr.png',
                    filename: 'Rentals/x7mnzzm52wmjm3chxqxr'

                }
            ]
        })
        await loc.save();
    }
}

/*Execute the process to send information to the databse*/
/*seedDB();*/

/*Close the process of inputting info into the database*/
seedDB().then(()=>{
    mongoose.connection.close();
})
