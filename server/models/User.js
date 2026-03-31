const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    hotel: {
        name: String,
        location: String,
        lat: Number,
        lng: Number,
        country: String,
        attractions: Array,
        // 📸 ЕТО ТУК Е МАГИЯТА: Казваме на базата да запазва и снимките!
        image: String,
        images: {
            exterior: String,
            room: String,
            amenity: String
        }
    },
    totalPrice: Number,
    duration: Number,
    type: String,
    bookingDate: String,
    status: { type: String, default: 'pending_logistics' }, // 👈 ТОВА ЛИПСВАШЕ! Пази статуса на логистиката
    flight: {
        number: String,
        seat: String,
        gate: String,
        from: String,
        to: String,
        departureTime: String,
        arrivalTime: String
    },
    transport: {
        pickupLocation: String,
        pickupTime: String,
        toAirportTime: String,
        arrivalTransferTime: String,
        service: String
    }
}, { _id: false });

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },

    pastTrips: [tripSchema],

    // ❤️ НОВО: Поле за харесани хотели (запазваме връзка към конкретния хотел)
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }],

    preferences: {
        category: { type: String, default: 'Морска почивка' },
        budget: { type: String, default: 'Среден' }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);