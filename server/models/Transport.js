const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
    city: { type: String, required: true },
    type: {
        type: String,
        // ТУК Е ПРОМЯНАТА - добавихме 'Метро карта'
        enum: ['Споделен автобус', 'Частно такси', 'ВИП Лимузина', 'Рент-а-кар', 'Метро карта']
    },
    price: { type: Number, required: true }
});

module.exports = mongoose.model('Transport', transportSchema);