const express = require('express');
const mongoose = require('mongoose');
const { Ollama } = require('ollama');
const ollama = new Ollama({ host: 'http://localhost:11434' });
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// --- СВЪРЗВАНЕ С БАЗАТА ---
mongoose.connect('mongodb://localhost:27017/diplot_travel_agency_db')
    .then(() => console.log('✅ Свързан с diplot_travel_agency_db'))
    .catch(err => console.error('❌ MongoDB грешка:', err));

// --- СХЕМА НА ХОТЕЛА ---
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
    roomsAvailable: { type: Number, default: 10 },
    nearestAirport: { name: String, code: String },
    attractions: Array
});

const Hotel = mongoose.models.Hotel || mongoose.model('Hotel', hotelSchema);

// --- 👑 АДМИН МАРШРУТИ ЗА СТАТИСТИКАТА ---
app.get('/api/users', async (req, res) => {
    try { res.json(await User.find().select('-password')); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/flights', async (req, res) => {
    try {
        const users = await User.find();
        const allFlights = users.flatMap(u => (u.pastTrips || []).filter(t => t.flight).map(t => t.flight));
        res.json(allFlights);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/transport', async (req, res) => {
    try {
        const users = await User.find();
        const allTransports = users.flatMap(u => (u.pastTrips || []).filter(t => t.transport).map(t => t.transport));
        res.json(allTransports);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/hotels', async (req, res) => {
    try { res.json(await Hotel.find().lean()); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

// --- АВТЕНТИКАЦИЯ ---
app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            res.json({ user: { _id: user._id, name: user.name, role: user.role, email: user.email } });
        } else {
            res.status(401).json({ message: 'Грешен имейл или парола!' });
        }
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/users/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (await User.findOne({ email })) return res.status(400).json({ message: 'Този имейл вече е регистриран!' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role: 'user' });
        await newUser.save();

        res.status(201).json({ message: 'Успешна регистрация!', user: { _id: newUser._id, name: newUser.name, email: newUser.email } });
    } catch (error) { res.status(500).json({ message: 'Вътрешна сървърна грешка.' }); }
});

// --- РЕЗЕРВАЦИЯ ---
app.post('/api/users/:id/book', async (req, res) => {
    try {
        const { hotel, duration } = req.body;
        const user = await User.findById(req.params.id);
        const dbHotel = await Hotel.findOne({ name: hotel.name });

        if (!dbHotel || dbHotel.roomsAvailable <= 0) return res.status(400).json({ message: "Няма свободни стаи!" });

        const flight = { number: "FB" + Math.floor(100 + Math.random() * 900), seat: Math.floor(1 + Math.random() * 30) + "A", gate: "A1", from: "Sofia (SOF)", to: `${dbHotel.nearestAirport?.name || 'Dest'}`, user: user.name };
        const transport = { pickup: user.address || "Вашият адрес", time: "05:00 AM", service: "DIPLOT VIP Shuttle", user: user.name };

        const newTrip = {
            hotelName: hotel.name,
            location: hotel.location,
            totalPrice: hotel.pricePerNight * duration,
            duration: duration,
            type: dbHotel.category || "Стандартна", // ЗАПИСВАМЕ КАТЕГОРИЯТА
            bookingDate: new Date().toLocaleDateString('bg-BG'),
            flight, transport
        };

        dbHotel.roomsAvailable -= 1;
        await dbHotel.save();
        user.pastTrips.push(newTrip);
        await user.save();

        res.json({ message: "Успешно!", trip: newTrip });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// --- 🤖 AI ЧАТ ЗА ПОТРЕБИТЕЛИТЕ (ТЪРСАЧКА) ---
app.post('/api/chat', async (req, res) => {
    req.setTimeout(120000);
    try {
        const { message } = req.body;
        const hotels = await Hotel.find({ roomsAvailable: { $gt: 0 } }).select('name pricePerNight location category').lean();
        const hotelList = hotels.map(h => `- ${h.name} | ${h.pricePerNight}лв/нощ | ${h.location} | Тип: ${h.category}`).join("\n");

        const prompt = `Ти си СТРИКТЕН туристически агент на DIPLOT.
        ПОТРЕБИТЕЛ: "${message}"
        СПИСЪК ХОТЕЛИ: \n${hotelList}\n
        ЗАДАЧА:
        1. Намери Продължителност (ако няма, сложи 7) и Бюджет.
        2. Изчисли Обща Цена = (Цена на нощ * Продължителност).
        3. Избери до 3 хотела, чиято Обща Цена е <= Бюджета и отговарят на локацията.
        4. Върни САМО JSON (без друг текст):
        {
          "status": "offer",
          "duration": число,
          "recommendations": [
            { "hotelName": "Име", "reason": "Обяснение" }
          ]
        }`;

        const response = await ollama.chat({ model: 'gemma2:9b', messages: [{ role: 'user', content: prompt }], format: 'json', options: { temperature: 0.1, num_ctx: 4096 } });

        let content = response.message.content.trim();
        const s = content.indexOf('{'), e = content.lastIndexOf('}');
        if (s !== -1 && e !== -1) content = content.substring(s, e + 1);

        res.json(JSON.parse(content));
    } catch (error) { res.status(500).json({ error: "Сървърът е зает" }); }
});

// --- 🤖 НОВ AI МАРШРУТ ЗА АДМИН ПАНЕЛА (CRM ПЕРСОНАЛИЗАЦИЯ) ---
app.post('/api/admin/ai-offer', async (req, res) => {
    req.setTimeout(120000);
    try {
        const { userName, history } = req.body;
        const hotels = await Hotel.find({ roomsAvailable: { $gt: 0 } }).select('name category location').lean();
        const hotelList = hotels.map(h => `- ${h.name} (${h.location}, Тип: ${h.category})`).join("\n");

        const prompt = `Ти си VIP агент. Клиентът ${userName} досега е почивал в: ${history}.
        Ето наличните хотели: \n${hotelList}\n
        На базата на неговата история, избери 1 НОВ хотел от списъка, който ще му хареса.
        Върни САМО JSON:
        {
          "recommendation": "Точно име на хотела",
          "reason": "Защо му го предлагаш спрямо историята му"
        }`;

        const response = await ollama.chat({ model: 'gemma2:9b', messages: [{ role: 'user', content: prompt }], format: 'json', options: { temperature: 0.4 } });

        let content = response.message.content.trim();
        const s = content.indexOf('{'), e = content.lastIndexOf('}');
        if (s !== -1 && e !== -1) content = content.substring(s, e + 1);

        res.json(JSON.parse(content));
    } catch (error) { res.status(500).json({ error: "Грешка при AI генерацията" }); }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Сървърът работи на порт ${PORT}`));