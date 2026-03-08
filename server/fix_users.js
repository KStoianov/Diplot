const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/diplot_travel_agency_db')
    .then(async () => {
        const password = await bcrypt.hash('123456', 10);

        // 1. Оправяме Иван
        await User.findOneAndUpdate({ email: "ivan@test.com" }, {
            $set: {
                password: password,
                pastTrips: [{ hotelName: "Атина Ризорт", destination: "Гърция", price: 1450, startDate: "10.06.2025", endDate: "17.06.2025", intensity: "Спокойна" }]
            }
        });

        // 2. Оправяме Христо (image_d20505.png)
        await User.findOneAndUpdate({ email: "hristo@example.com" }, {
            $set: {
                password: password,
                pastTrips: [{ hotelName: "Рим Палас", destination: "Италия", price: 1800, startDate: "05.05.2025", endDate: "12.05.2025", intensity: "Екстремна" }]
            }
        });

        console.log("✅ Иван и Христо са готови с парола: 123456");
        process.exit();
    });