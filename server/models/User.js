const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    hotelName: String,
    location: String,
    totalPrice: Number,
    duration: Number,
    bookingDate: String,
    // ✈️ Променяме от String на Mixed или Object
    flight: {
        number: String,
        seat: String,
        gate: String,
        from: String,
        to: String
    },
    // 🚗 Променяме от String на Object
    transport: {
        pickup: String,
        time: String,
        service: String
    }
}, { _id: false });

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    pastTrips: [tripSchema],
    preferences: {
        category: { type: String, default: 'Морска почивка' },
        budget: { type: String, default: 'Среден' }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);