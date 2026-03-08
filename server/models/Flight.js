const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    airline: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    price: { type: Number, required: true },
    isRoundTrip: { type: Boolean, default: true }
});

module.exports = mongoose.model('Flight', flightSchema);