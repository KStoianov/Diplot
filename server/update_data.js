const mongoose = require('mongoose');
const User = require('./models/User'); 

mongoose.connect('mongodb://localhost:27017/diplot_travel_agency_db')
    .then(() => console.log('✅ Свързан за финално обновяване...'))
    .catch(err => console.error(err));

const runUpdate = async () => {
    try {
        await User.findOneAndUpdate(
            { email: "ivan@test.com" },
            {
                $set: {
                    pastTrips: [
                        {
                            hotelName: "Атина Ризорт",
                            destination: "Атина, Гърция",
                            price: 1450, // Число
                            startDate: "10.06.2025", // Ключ
                            endDate: "17.06.2025",
                            duration: 7,
                            intensity: "Спокойна",
                            peopleCount: 2,
                            type: "Семейна"
                        },
                        {
                            hotelName: "Римска Ваканция",
                            destination: "Рим, Италия",
                            price: 1800,
                            startDate: "20.09.2025",
                            endDate: "27.09.2025",
                            duration: 7,
                            intensity: "Спокойна",
                            peopleCount: 2,
                            type: "Културна"
                        }
                    ]
                }
            }
        );
        console.log('🚀 Базата е обновена успешно!');
        process.exit();
    } catch (err) { console.error(err); process.exit(1); }
};
runUpdate();