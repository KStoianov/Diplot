const express = require('express');
const mongoose = require('mongoose');
const { Ollama } = require('ollama');
const ollama = new Ollama({ host: 'http://localhost:11434' });
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');

require('dotenv').config();

// --- МОДЕЛИ ---
const User = require('./models/User');
const Hotel = require('./models/Hotel');

const app = express();
app.use(cors());
app.use(express.json());

// =========================================================================
// 📸 СТАТИЧНИ ФАЙЛОВЕ (ЗА СНИМКИТЕ)
// =========================================================================
const uploadsPath = path.join(__dirname, 'public', 'uploads');
app.use('/uploads', express.static(uploadsPath));
console.log("📂 Снимките се зареждат от:", uploadsPath);

// --- СВЪРЗВАНЕ С БАЗАТА ---
mongoose.connect('mongodb://localhost:27017/diplot_travel_agency_db')
    .then(() => console.log('✅ Успешно свързване с diplot_travel_agency_db'))
    .catch(err => console.error('❌ MongoDB грешка:', err));

// =========================================================================
// 👑 АДМИН МАРШРУТИ (ЗА СТАТИСТИКАТА И ДАННИТЕ)
// =========================================================================
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

// =========================================================================
// 🔐 АВТЕНТИКАЦИЯ (LOGIN & REGISTER)
// =========================================================================
app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            res.json({
                user: {
                    _id: user._id,
                    name: user.name,
                    role: user.role,
                    email: user.email,
                    favorites: user.favorites,
                    pastTrips: user.pastTrips
                }
            });
        } else {
            res.status(401).json({ message: 'Грешен имейл или парола!' });
        }
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/users/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (await User.findOne({ email })) return res.status(400).json({ message: 'Имейлът вече съществува!' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name, email, password: hashedPassword, role: 'user',
            favorites: [], pastTrips: []
        });
        await newUser.save();
        res.status(201).json({ message: 'Добре дошли!', user: newUser });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// =========================================================================
// ❤️ ЛЮБИМИ ХОТЕЛИ
// =========================================================================
app.post('/api/users/:id/favorite', async (req, res) => {
    try {
        const { hotelId } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Потребителят не е намерен!" });

        const isFavorite = user.favorites.includes(hotelId);
        user.favorites = isFavorite
            ? user.favorites.filter(id => id.toString() !== hotelId)
            : [...user.favorites, hotelId];

        await user.save();
        res.json({ message: "Успешно!", favorites: user.favorites, user: user });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// =========================================================================
// 🏨 ЗАПАЗВАНЕ НА ХОТЕЛ (БЕЗ ЛОГИСТИКА)
// =========================================================================
app.post('/api/users/:id/book', async (req, res) => {
    try {
        const { hotel, duration, startDate } = req.body;
        const user = await User.findById(req.params.id);
        const dbHotel = await Hotel.findOne({ name: hotel.name });

        if (!dbHotel) return res.status(404).json({ message: "Хотелът не е намерен!" });

        const bookingDateObj = startDate ? new Date(startDate) : new Date();
        bookingDateObj.setHours(0, 0, 0, 0);

        const dd = String(bookingDateObj.getDate()).padStart(2, '0');
        const mm = String(bookingDateObj.getMonth() + 1).padStart(2, '0');
        const yyyy = bookingDateObj.getFullYear();
        const formattedBookingDate = `${dd}.${mm}.${yyyy}`;

        // --- 🛡️ КАЛЕНДАРНА ЗАЩИТА ---
        const allUsers = await User.find();
        let isBookedOut = false;

        for (let i = 0; i < duration; i++) {
            const checkDate = new Date(bookingDateObj);
            checkDate.setDate(bookingDateObj.getDate() + i);
            const checkTime = checkDate.getTime();

            let takenOnThisDay = 0;

            allUsers.forEach(u => {
                u.pastTrips?.forEach(trip => {
                    const name = trip.hotel?.name || trip.hotelName;
                    if (name === dbHotel.name && trip.bookingDate) {
                        const parts = trip.bookingDate.split('.');
                        if (parts.length === 3) {
                            const start = new Date(parts[2], parts[1] - 1, parts[0]);
                            const end = new Date(start);
                            end.setDate(start.getDate() + (trip.duration || 7));

                            if (checkTime >= start.getTime() && checkTime < end.getTime()) {
                                takenOnThisDay += 1;
                            }
                        }
                    }
                });
            });

            const totalCapacity = dbHotel.roomsAvailable + takenOnThisDay;
            if (takenOnThisDay >= totalCapacity || dbHotel.roomsAvailable <= 0) {
                isBookedOut = true;
                break;
            }
        }

        if (isBookedOut) {
            return res.status(400).json({ message: "Хотелът няма достатъчно свободни стаи за тези дати! 📅 Моля, изберете друга дата." });
        }
        // --- 🛡️ КРАЙ НА ЗАЩИТАТА ---

        const newTrip = {
            hotel: {
                name: dbHotel.name,
                location: dbHotel.location,
                lat: dbHotel.lat,
                lng: dbHotel.lng,
                country: dbHotel.country,
                attractions: dbHotel.attractions,
                image: hotel.image || dbHotel.image,
                images: hotel.images || dbHotel.images
            },
            totalPrice: dbHotel.pricePerNight * duration,
            duration: duration,
            type: dbHotel.category || "Стандартна",
            bookingDate: formattedBookingDate,
            status: 'pending_logistics'
        };

        dbHotel.roomsAvailable -= 1;
        await dbHotel.save();

        user.pastTrips.push(newTrip);
        await user.save();

        res.json({ message: "Успешно!", user: user, trip: newTrip });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// =========================================================================
// ✈️ ДОБАВЯНЕ НА ЛОГИСТИКА КЪМ СЪЩЕСТВУВАЩА РЕЗЕРВАЦИЯ
// =========================================================================
app.post('/api/users/:id/trip/:tripIndex/logistics', async (req, res) => {
    try {
        // 🚨 ТУК Е ПРОМЯНАТА: Приемаме skipLogistics
        const { pickupCity, skipLogistics } = req.body;
        const user = await User.findById(req.params.id);
        const tripIndex = parseInt(req.params.tripIndex);

        if (!user || tripIndex < 0 || tripIndex >= user.pastTrips.length) {
            return res.status(404).json({ message: "Резервацията не е намерена!" });
        }

        const trip = user.pastTrips[tripIndex];

        // 🚗 АКО КЛИЕНТЪТ ИСКА САМО ХОТЕЛ (БЕЗ ПОЛЕТ)
        if (skipLogistics) {
            trip.status = 'hotel_only';
            trip.flight = null;
            trip.transport = null;
            user.markModified('pastTrips');
            await user.save();
            return res.json({ message: "Резервацията е запазена без транспорт!", user });
        }

        // ✈️ АКО ИСКА ПЪЛНА ЛОГИСТИКА (ПОЛЕТ И ТРАНСФЕР)
        const dbHotel = await Hotel.findOne({ name: trip.hotel?.name || trip.hotelName });

        const startCity = pickupCity || 'София';
        const departHour = Math.floor(Math.random() * 8) + 6;
        const departMin = Math.random() < 0.5 ? '00' : '30';
        const departureTime = `${departHour < 10 ? '0' + departHour : departHour}:${departMin}`;

        const arrivalHour = departHour + Math.floor(Math.random() * 3) + 1;
        const arrivalTime = `${arrivalHour < 10 ? '0' + arrivalHour : arrivalHour}:${departMin}`;

        const pickupHour = departHour - 3;
        const pickupTimeStr = `${pickupHour < 10 ? '0' + pickupHour : pickupHour}:${departMin}`;

        const seatMap = ["A", "B", "C", "D", "E", "F"];
        const flightSeat = `${Math.floor(Math.random() * 30) + 1}${seatMap[Math.floor(Math.random() * seatMap.length)]}`;

        trip.flight = {
            number: "FB" + Math.floor(100 + Math.random() * 900),
            seat: flightSeat,
            gate: ["A1", "B4", "C2", "A12"][Math.floor(Math.random() * 4)],
            from: `Летище ${startCity}`,
            to: `Летище ${dbHotel?.nearestAirport?.name || trip.hotel?.location} (${dbHotel?.nearestAirport?.code || 'DEST'})`,
            departureTime: departureTime,
            arrivalTime: arrivalTime
        };

        trip.transport = {
            pickupLocation: startCity,
            pickupTime: pickupTimeStr,
            toAirportTime: `${Math.floor(Math.random() * 40) + 20} мин.`,
            arrivalTransferTime: `${Math.floor(Math.random() * 30) + 15} мин.`,
            service: "VIP DIPLOT Transfer"
        };

        trip.status = 'confirmed'; // Пълна резервация

        user.markModified('pastTrips');
        await user.save();

        res.json({ message: "Логистиката е добавена успешно!", user });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// =========================================================================
// 🗑️ ИЗТРИВАНЕ НА РЕЗЕРВАЦИЯ (ОТ АДМИН ПАНЕЛА)
// =========================================================================
app.delete('/api/users/:id/trip/:tripIndex', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Потребителят не е намерен!" });

        const tripIndex = parseInt(req.params.tripIndex);
        if (tripIndex >= 0 && tripIndex < user.pastTrips.length) {

            const trip = user.pastTrips[tripIndex];
            const hotelName = trip.hotel?.name || trip.hotelName;
            let hotelRestored = false;

            if (hotelName) {
                try {
                    const dbHotel = await Hotel.findOne({ name: hotelName });
                    if (dbHotel) {
                        dbHotel.roomsAvailable += 1;
                        await dbHotel.save();
                        hotelRestored = true;
                    }
                } catch (e) {
                    console.log("⚠️ Не можах да върна стаята на хотела, но продължавам с изтриването.");
                }
            }

            user.pastTrips.splice(tripIndex, 1);
            user.markModified('pastTrips');
            await user.save();

            res.json({ message: "Успешно изтрито!", hotelRestored });
        } else {
            res.status(400).json({ message: "Невалиден индекс на резервация!" });
        }
    } catch (error) {
        console.error("❌ Грешка при изтриване:", error);
        res.status(500).json({ error: error.message });
    }
});

// =========================================================================
// 🚀 ХИБРИДЕН AI МОДЕЛ (THE BRAIN)
// =========================================================================
app.post('/api/chat', async (req, res) => {
    req.setTimeout(120000);
    try {
        const { message } = req.body;
        console.log("--------------------------------------------------");
        console.log(`📩 НОВО СЪОБЩЕНИЕ: "${message}"`);

        const extractPrompt = `Анализирай: "${message}".
        Мапни към една от: ["Градски туризъм", "Градски лукс", "Еко туризъм", "Еко лукс", "Планинска почивка", "Морска почивка", "Екзотична почивка"].
        Ако е "артистично", "индустриално", "минималистично", "дизайн" -> "Градски туризъм".
        Върни САМО JSON: {"budget": 1600, "duration": 4, "location": "Scandinavia", "category": "Градски туризъм"}`;

        const extractRes = await ollama.chat({
            model: 'gemma2:9b',
            messages: [{ role: 'user', content: extractPrompt }],
            format: 'json',
            options: { temperature: 0.1 }
        });

        let params = {};
        try {
            params = JSON.parse(extractRes.message.content.replace(/```json/gi, '').replace(/```/g, '').trim());
        } catch (e) {
            console.log("⚠️ Грешка при парсване на първия JSON, продължавам с празен.");
        }

        const duration = Number(params.duration) || 7;
        const maxBudget = Number(params.budget) || 100000;
        const maxPricePerNight = maxBudget / duration;

        console.log(`🧠 AI ИЗВЛЕЧЕ:`, params);

        let dbQuery = { roomsAvailable: { $gt: 0 }, pricePerNight: { $lte: maxPricePerNight } };

        const europe = ["Germany", "Hungary", "Denmark", "Poland", "Austria", "Netherlands", "Greece", "Bulgaria", "Italy", "France", "Spain"];
        const asia = ["Indonesia", "Vietnam", "Thailand", "Japan", "Maldives"];
        const scandinavia = ["Denmark", "Norway", "Sweden", "Finland"];

        if (params.location?.toLowerCase() === 'europe') dbQuery.country = { $in: europe };
        else if (params.location?.toLowerCase() === 'asia') dbQuery.country = { $in: asia };
        else if (params.location?.toLowerCase() === 'scandinavia') dbQuery.country = { $in: scandinavia };
        else if (params.location && params.location !== "null") {
            dbQuery.$or = [
                { city: { $regex: params.location, $options: 'i' } },
                { country: { $regex: params.location, $options: 'i' } },
                { description: { $regex: params.location, $options: 'i' } }
            ];
        }

        if (params.category && params.category !== "null") {
            dbQuery.category = { $regex: params.category.split(' ')[0], $options: 'i' };
        }

        let filteredHotels = await Hotel.find(dbQuery).sort({ rating: -1 }).limit(3).lean();

        if (filteredHotels.length < 3) {
            const fallbackQuery = { ...dbQuery };
            delete fallbackQuery.category;
            const excludeIds = filteredHotels.map(h => h._id);
            fallbackQuery._id = { $nin: excludeIds };

            const extraHotels = await Hotel.find(fallbackQuery).limit(3 - filteredHotels.length).lean();
            filteredHotels = [...filteredHotels, ...extraHotels];
        }

        if (filteredHotels.length < 3) {
            const excludeIds = filteredHotels.map(h => h._id);
            const extraHotels = await Hotel.find({ pricePerNight: { $lte: maxPricePerNight }, _id: { $nin: excludeIds } })
                .sort({ rating: -1 }).limit(3 - filteredHotels.length).lean();
            filteredHotels = [...filteredHotels, ...extraHotels];
        }

        if (filteredHotels.length < 3) {
            const excludeIds = filteredHotels.map(h => h._id);
            const extraHotels = await Hotel.find({ _id: { $nin: excludeIds } })
                .sort({ pricePerNight: 1 }).limit(3 - filteredHotels.length).lean();
            filteredHotels = [...filteredHotels, ...extraHotels];
        }

        const hotelList = filteredHotels.map(h => `- ${h.name}`).join("\n");
        console.log("📝 ХОТЕЛИ КЪМ AI:\n", hotelList);

        const finalPrompt = `Ти си VIP агент. Клиент: "${message}".
        Предложи ТОЧНО тези хотели:
        ${hotelList}
        
        Върни САМО JSON:
        {"status": "offer", "duration": ${duration}, "rawText": "Твоят текст тук...", "recommendations": [{"hotelName": "ИМЕ НА ХОТЕЛ", "reason": "защо"}]}`;

        const finalRes = await ollama.chat({
            model: 'gemma2:9b',
            messages: [{ role: 'user', content: finalPrompt }],
            format: 'json'
        });

        let finalData;
        try {
            let cleanStr = finalRes.message.content.replace(/```json/gi, '').replace(/```/g, '').trim();
            finalData = JSON.parse(cleanStr);
        } catch (err) {
            console.log("🚨 AI върна невалиден формат. Активирам АВТОМАТИЧЕН ОТГОВОР!");
            finalData = {
                status: "offer",
                duration: duration,
                rawText: "Ето най-добрите предложения, които успях да намеря за вашия бюджет:",
                recommendations: []
            };
        }

        finalData.recommendations = filteredHotels.map((dbHotel, index) => {
            const aiRec = (finalData.recommendations && finalData.recommendations[index]) ? finalData.recommendations[index] : {};
            return {
                hotelName: dbHotel.name,
                reason: aiRec.reason || "Отличен избор, съобразен с вашия бюджет и предпочитания."
            };
        });

        console.log("✅ ИЗПРАЩАМ КЪМ FRONTEND:", JSON.stringify(finalData));
        res.json(finalData);

    } catch (error) {
        console.error("❌ СЪРВЪРНА ГРЕШКА:", error);
        res.status(500).json({ error: "Сървърна грешка" });
    }
});

// =========================================================================
// 🤖 АДМИН AI ПЕРСОНАЛИЗАЦИЯ
// =========================================================================
app.post('/api/admin/ai-offer', async (req, res) => {
    req.setTimeout(120000);
    try {
        const { userName, history } = req.body;
        const hotels = await Hotel.find({ roomsAvailable: { $gt: 0 } }).select('name category location').lean();
        const hotelList = hotels.map(h => `- ${h.name} (${h.location})`).join("\n");

        const prompt = `Клиентът ${userName} е бил в: ${history}. Налични хотели:\n${hotelList}\nИзбери 1 и върни JSON: {"recommendation": "име", "reason": "защо"}`;

        const response = await ollama.chat({ model: 'gemma2:9b', messages: [{ role: 'user', content: prompt }], format: 'json' });
        res.json(JSON.parse(response.message.content));
    } catch (error) { res.status(500).json({ error: "AI Error" }); }
});
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// --- СТАРТ ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 SERVER ENGINE СТАРТИРА НА ПОРТ ${PORT}`));