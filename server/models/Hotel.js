const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: String,
    location: String,
    city: String,
    country: String,
    pricePerNight: Number,
    description: String,
    category: String,
    lat: Number,
    lng: Number,
    // ТУК Е РАЗЛИКАТА: Указваме на базата, че attractions е масив от ОБЕКТИ, а не от стрингове
    attractions: [
        {
            name: String,
            type: String,
            icon: String,
            description: String,
            lat: Number,
            lng: Number
        }
    ]
});

module.exports = mongoose.model('Hotel', hotelSchema);