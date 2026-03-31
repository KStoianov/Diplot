const mongoose = require('mongoose');

// Дефинираме схемата за атракциите отделно, за да е по-чисто
const attractionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String }, // напр. "diving", "landmark", "museum"
    description: { type: String },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
});

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String },
    country: { type: String },
    pricePerNight: { type: Number, required: true },
    rating: { type: Number, default: 5 }, // За златните звезди в дизайна
    category: { type: String }, // напр. "Морска почивка", "Градски туризъм"
    description: { type: String },
    roomsAvailable: { type: Number, default: 10 },

    // 📸 ГАЛЕРИЯ С AI СНИМКИ
    images: {
        exterior: { type: String, required: true },
        room: { type: String, required: true },
        amenity: { type: String, required: true }
    },

    // ГЕОЛОКАЦИЯ ЗА КАРТАТА
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },

    // ЛОГИСТИКА ЗА ПОЛЕТИТЕ
    nearestAirport: {
        name: { type: String },
        code: { type: String }
    },

    // 🎡 АТРАКЦИИ (Масив от обекти - критично за RoutingMachine)
    attractions: [attractionSchema]
});

// Експортираме модела, като проверяваме дали вече не е дефиниран
module.exports = mongoose.models.Hotel || mongoose.model('Hotel', hotelSchema);