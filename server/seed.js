const { MongoClient } = require('mongodb');

async function runFullSeed() {
    const client = new MongoClient('mongodb://localhost:27017');
    try {
        await client.connect();
        const db = client.db('diplot_travel_agency_db');
        const collection = db.collection('hotels');
        
        await collection.deleteMany({}); // Изтриваме старите 4 хотела

        const all30Hotels = [
            // --- БЪЛГАРИЯ ---
            { name: "Банско Сноу & Спа", location: "България, Банско", pricePerNight: 95, roomsAvailable: 10, nearestAirport: { name: "Sofia", code: "SOF" }, category: "Ski", rating: 4, image: "https://images.unsplash.com/photo-1551882547-ff40c0d12256?w=800", lat: 41.8383, lng: 23.4885 },
            { name: "Варна Сий Вю", location: "България, Варна", pricePerNight: 120, roomsAvailable: 5, nearestAirport: { name: "Varna", code: "VAR" }, category: "Beach", rating: 5, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800", lat: 43.2046, lng: 27.9105 },
            { name: "Търново Хистори", location: "България, В. Търново", pricePerNight: 75, roomsAvailable: 15, nearestAirport: { name: "Sofia", code: "SOF" }, category: "Culture", rating: 4, image: "https://images.unsplash.com/photo-1542314831-c6a4d27ce66b?w=800", lat: 43.0812, lng: 25.6411 },

            // --- ГЪРЦИЯ ---
            { name: "Атина Ризорт", location: "Гърция, Атина", pricePerNight: 160, roomsAvailable: 8, nearestAirport: { name: "Athens Intl", code: "ATH" }, category: "Beach", rating: 5, image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800", lat: 37.9838, lng: 23.7275 },
            { name: "Санторини Блу", location: "Гърция, Санторини", pricePerNight: 350, roomsAvailable: 3, nearestAirport: { name: "Santorini", code: "JTR" }, category: "Beach", rating: 5, image: "https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?w=800", lat: 36.4618, lng: 25.3753 },
            { name: "Олимп Лодж", location: "Гърция, Литохоро", pricePerNight: 85, roomsAvailable: 12, nearestAirport: { name: "Thessaloniki", code: "SKG" }, category: "Mountain", rating: 3, image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800", lat: 40.1042, lng: 22.5023 },

            // --- ИТАЛИЯ ---
            { name: "Рома Антикуа", location: "Италия, Рим", pricePerNight: 180, roomsAvailable: 10, nearestAirport: { name: "Rome Fiumicino", code: "FCO" }, category: "City", rating: 5, image: "https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=800", lat: 41.9028, lng: 12.4964 },
            { name: "Доломити Алпин", location: "Италия, Кортина", pricePerNight: 240, roomsAvailable: 6, nearestAirport: { name: "Venice Marco Polo", code: "VCE" }, category: "Ski", rating: 4, image: "https://images.unsplash.com/photo-1520689453620-336e7fb63eb8?w=800", lat: 46.5405, lng: 12.1357 },
            { name: "Амалфи Коуст", location: "Италия, Амалфи", pricePerNight: 290, roomsAvailable: 4, nearestAirport: { name: "Naples", code: "NAP" }, category: "Beach", rating: 5, image: "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?w=800", lat: 40.6340, lng: 14.6027 },

            // --- ФРАНЦИЯ ---
            { name: "Париж Лукс", location: "Франция, Париж", pricePerNight: 220, roomsAvailable: 7, nearestAirport: { name: "Charles de Gaulle", code: "CDG" }, category: "City", rating: 5, image: "https://images.unsplash.com/photo-1502602898657-3e907a5ea58e?w=800", lat: 48.8566, lng: 2.3522 },
            { name: "Шамони Монблан", location: "Франция, Шамони", pricePerNight: 210, roomsAvailable: 5, nearestAirport: { name: "Geneva", code: "GVA" }, category: "Ski", rating: 4, image: "https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=800", lat: 45.9237, lng: 6.8694 },
            { name: "Ница Ривиера", location: "Франция, Ница", pricePerNight: 190, roomsAvailable: 9, nearestAirport: { name: "Nice Cote d'Azur", code: "NCE" }, category: "Beach", rating: 4, image: "https://images.unsplash.com/photo-1533475141695-8e31b674bce4?w=800", lat: 43.7102, lng: 7.2620 },

            // --- ИСПАНИЯ ---
            { name: "Барселона Готик", location: "Испания, Барселона", pricePerNight: 145, roomsAvailable: 11, nearestAirport: { name: "Barcelona El Prat", code: "BCN" }, category: "Culture", rating: 4, image: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=800", lat: 41.3851, lng: 2.1734 },
            { name: "Мадрид Палас", location: "Испания, Мадрид", pricePerNight: 165, roomsAvailable: 8, nearestAirport: { name: "Adolfo Suarez", code: "MAD" }, category: "City", rating: 5, image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800", lat: 40.4168, lng: -3.7038 },
            { name: "Ибиса Бийч", location: "Испания, Ибиса", pricePerNight: 280, roomsAvailable: 2, nearestAirport: { name: "Ibiza Airport", code: "IBZ" }, category: "Beach", rating: 4, image: "https://images.unsplash.com/photo-1573843225204-be251626bb9e?w=800", lat: 38.9067, lng: 1.4206 },

            // --- ХЪРВАТИЯ ---
            { name: "Адриатик Дубровник", location: "Хърватия, Дубровник", pricePerNight: 210, roomsAvailable: 6, nearestAirport: { name: "Dubrovnik", code: "DBV" }, category: "Beach", rating: 5, image: "https://images.unsplash.com/photo-1555990538-9e972956a23e?w=800", lat: 42.6507, lng: 18.0944 },
            { name: "Сплит Харбър", location: "Хърватия, Сплит", pricePerNight: 130, roomsAvailable: 10, nearestAirport: { name: "Split Airport", code: "SPU" }, category: "Culture", rating: 4, image: "https://images.unsplash.com/photo-1589197331516-4d846c33bf18?w=800", lat: 43.5081, lng: 16.4402 },
            { name: "Хвар Сън", location: "Хърватия, Хвар", pricePerNight: 195, roomsAvailable: 4, nearestAirport: { name: "Split Airport", code: "SPU" }, category: "Beach", rating: 5, image: "https://images.unsplash.com/photo-1534008757030-2670ca43530c?w=800", lat: 43.1736, lng: 16.4419 },

            // --- ШВЕЙЦАРИЯ ---
            { name: "Цермат Матерхорн", location: "Швейцария, Цермат", pricePerNight: 420, roomsAvailable: 3, nearestAirport: { name: "Zurich", code: "ZRH" }, category: "Ski", rating: 5, image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=800", lat: 46.0207, lng: 7.7491 },
            { name: "Интерлакен Лейк", location: "Швейцария, Интерлакен", pricePerNight: 310, roomsAvailable: 5, nearestAirport: { name: "Bern", code: "BRN" }, category: "Mountain", rating: 4, image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=800", lat: 46.6863, lng: 7.8632 },
            { name: "Ст. Мориц Ски", location: "Швейцария, Ст. Мориц", pricePerNight: 550, roomsAvailable: 2, nearestAirport: { name: "Engadin", code: "SMV" }, category: "Ski", rating: 5, image: "https://images.unsplash.com/photo-1544133782-999332560383?w=800", lat: 46.4908, lng: 9.8355 },

            // --- АВСТРИЯ ---
            { name: "Виена Гранд", location: "Австрия, Виена", pricePerNight: 205, roomsAvailable: 12, nearestAirport: { name: "Vienna Intl", code: "VIE" }, category: "City", rating: 5, image: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800", lat: 48.2082, lng: 16.3738 },
            { name: "Инсбрук Алпин", location: "Австрия, Инсбрук", pricePerNight: 140, roomsAvailable: 9, nearestAirport: { name: "Innsbruck", code: "INN" }, category: "Ski", rating: 4, image: "https://images.unsplash.com/photo-1520114056694-98d939a9978a?w=800", lat: 47.2692, lng: 11.4041 },
            { name: "Залцбург Моцарт", location: "Австрия, Залцбург", pricePerNight: 160, roomsAvailable: 7, nearestAirport: { name: "Salzburg", code: "SZG" }, category: "Culture", rating: 4, image: "https://images.unsplash.com/photo-1599940824399-b87987cb9723?w=800", lat: 47.8095, lng: 13.0550 },

            // --- ПОРТУГАЛИЯ ---
            { name: "Лисабон Сърф", location: "Португалия, Лисабон", pricePerNight: 110, roomsAvailable: 15, nearestAirport: { name: "Lisbon Portela", code: "LIS" }, category: "Beach", rating: 4, image: "https://images.unsplash.com/photo-1585208798174-6cedd863bc99?w=800", lat: 38.7223, lng: -9.1393 },
            { name: "Алгарве Ризорт", location: "Португалия, Албуфейра", pricePerNight: 240, roomsAvailable: 8, nearestAirport: { name: "Faro", code: "FAO" }, category: "Beach", rating: 5, image: "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800", lat: 37.0891, lng: -8.2479 },
            { name: "Порто Ривър", location: "Португалия, Порто", pricePerNight: 135, roomsAvailable: 10, nearestAirport: { name: "Francisco Sa Carneiro", code: "OPO" }, category: "Culture", rating: 4, image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800", lat: 41.1579, lng: -8.6291 },

            // --- ГЕРМАНИЯ ---
            { name: "Берлин Сити", location: "Германия, Берлин", pricePerNight: 155, roomsAvailable: 20, nearestAirport: { name: "Berlin Brandenburg", code: "BER" }, category: "City", rating: 4, image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800", lat: 52.5200, lng: 13.4050 },
            { name: "Мюнхен Биер", location: "Германия, Мюнхен", pricePerNight: 180, roomsAvailable: 14, nearestAirport: { name: "Munich Intl", code: "MUC" }, category: "Culture", rating: 5, image: "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=800", lat: 48.1351, lng: 11.5820 },
            { name: "Гармиш Ски", location: "Германия, Гармиш", pricePerNight: 170, roomsAvailable: 6, nearestAirport: { name: "Munich Intl", code: "MUC" }, category: "Ski", rating: 4, image: "https://images.unsplash.com/photo-1482867996988-29ec3aee816d?w=800", lat: 47.4917, lng: 11.0955 }
        ];

        await collection.insertMany(all30Hotels);
        console.log('🎉 УСПЕХ! Вече имаш точно 30 хотела с летища и капацитет!');
    } finally {
        await client.close();
    }
}
runFullSeed();