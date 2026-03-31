const mongoose = require('mongoose');
const Hotel = require('./models/Hotel');

mongoose.connect('mongodb://localhost:27017/diplot_travel_agency_db')
    .then(() => console.log('✅ Свързан за зареждане на данни...'))
    .catch(err => console.error('❌ Грешка:', err));

const seedDatabase = async () => {
    try {
        await Hotel.deleteMany({});
        console.log('🧹 Базата е изчистена!');

        const hotels = [
            {
                name: "The Azure Sanctuary",
                location: "North Malé Atoll, Maldives",
                city: "Malé",
                country: "Maldives",
                pricePerNight: 1250,
                rating: 5,
                category: "Морска почивка",
                description: "Изживейте върховното уединение в нашите вили над водата, където минимализмът среща безкрайния хоризонт на Индийския океан.",
                images: {
                    exterior: "http://localhost:5000/uploads/hotels/azure_ext.jpg",
                    room: "http://localhost:5000/uploads/hotels/azure_room.jpg",
                    amenity: "http://localhost:5000/uploads/hotels/azure_pool.jpg"
                },
                lat: 4.1755,
                lng: 73.5093,
                roomsAvailable: 10,
                nearestAirport: { name: "Velana International", code: "MLE" },
                attractions: [
                    {
                        name: "Banana Reef",
                        type: "diving",
                        description: "Едно от най-известните места за гмуркане в света.",
                        lat: 4.2166,
                        lng: 73.5333
                    }
                ]
            },
            {
                "name": "The Velvet Peak",
                "location": "Courchevel 1850, French Alps",
                "city": "Courchevel",
                "country": "France",
                "pricePerNight": 2100,
                "rating": 5,
                "category": "Планинска почивка",
                "description": "Потопете се в тишината на Алпите. The Velvet Peak предлага безкомпромисен лукс сред снеговете – от частни ски писти до отопляеми басейни под открито небе.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/velvet_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/velvet_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/velvet_pool.jpg"
                },
                "lat": 45.4147,
                "lng": 6.6335,
                "roomsAvailable": 5,
                "nearestAirport": { "name": "Geneva Airport", "code": "GVA" },
                "attractions": [
                    {
                        "name": "La Croisette",
                        "type": "skiing",
                        "description": "Епицентърът на ски зоната в Куршевел.",
                        "lat": 45.4150,
                        "lng": 6.6340
                    }
                ]
            },
            {
                "name": "Zenith Neon Tower",
                "location": "Shinjuku, Tokyo",
                "city": "Tokyo",
                "country": "Japan",
                "pricePerNight": 950,
                "rating": 5,
                "category": "Градски туризъм",
                "description": "Лукс в сърцето на бъдещето. Zenith Neon Tower предлага неонови гледки и технологичен комфорт от ново поколение в най-динамичния квартал на Токио.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/zenith_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/zenith_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/zenith_bar.jpg"
                },
                "lat": 35.6895,
                "lng": 139.6917,
                "roomsAvailable": 12,
                "nearestAirport": { "name": "Narita International", "code": "NRT" },
                "attractions": [
                    {
                        "name": "Shinjuku Gyoen",
                        "type": "park",
                        "description": "Оазис от тишина сред градската джунгла.",
                        "lat": 35.6852,
                        "lng": 139.7100
                    }
                ]
            },
            {
                "name": "Oia Serenity Suites",
                "location": "Oia, Santorini",
                "city": "Oia",
                "country": "Greece",
                "pricePerNight": 1450,
                "rating": 5,
                "category": "Морска почивка",
                "description": "Бели стени, синьо небе и безкрайно спокойствие. Най-ексклузивните сюити в Оя ви очакват за едно незабравимо бягство с гледка към калдерата.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/oia_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/oia_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/oia_spa.jpg"
                },
                "lat": 36.4618,
                "lng": 25.3753,
                "roomsAvailable": 3,
                "nearestAirport": { "name": "Santorini Airport", "code": "JTR" },
                "attractions": [
                    {
                        "name": "Amoudi Bay",
                        "type": "beach",
                        "description": "Живописно заливче с кристална вода под скалите на Оя.",
                        "lat": 36.4590,
                        "lng": 25.3710
                    }
                ]
            },
            {
                "name": "The Artist Loft",
                "location": "Kreuzberg, Berlin",
                "city": "Berlin",
                "country": "Germany",
                "pricePerNight": 320,
                "rating": 4,
                "category": "Градски туризъм",
                "description": "Творческото сърце на Берлин. Индустриален дизайн среща съвременно изкуство в този уникален лофт в най-динамичния квартал на града.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/berlin_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/berlin_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/berlin_cafe.jpg"
                },
                "lat": 52.4986,
                "lng": 13.4069,
                "roomsAvailable": 15,
                "nearestAirport": { "name": "Berlin Brandenburg", "code": "BER" },
                "attractions": [
                    {
                        "name": "East Side Gallery",
                        "type": "museum",
                        "description": "Най-дългата останала част от Берлинската стена, превърната в галерия.",
                        "lat": 52.5050,
                        "lng": 13.4397
                    }
                ]
            },
            {
                "name": "Eco Bamboo Pods",
                "location": "Ubud, Bali",
                "city": "Ubud",
                "country": "Indonesia",
                "pricePerNight": 95,
                "rating": 4,
                "category": "Еко туризъм",
                "description": "Спете под звуците на джунглата. Нашите бамбукови капсули предлагат пълно сливане с природата на достъпна цена, без да жертват комфорта.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/bali_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/bali_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/bali_yoga.jpg"
                },
                "lat": -8.5069,
                "lng": 115.2625,
                "roomsAvailable": 8,
                "nearestAirport": { "name": "Ngurah Rai International", "code": "DPS" },
                "attractions": [
                    {
                        "name": "Tegallalang Rice Terrace",
                        "type": "nature",
                        "description": "Емблематичните оризови тераси на Бали с невероятни панорамни гледки.",
                        "lat": -8.4333,
                        "lng": 115.2833
                    }
                ]
            },
            {
                "name": "Hôtel de l'Éclat",
                "location": "Avenue Montaigne, Paris",
                "city": "Paris",
                "country": "France",
                "pricePerNight": 1850,
                "rating": 5,
                "category": "Градски лукс",
                "description": "Класически парижки разкош. Разположен на най-престижната модна улица, Hôtel de l'Éclat предлага неповторима гледка към Айфеловата кула и обслужване на световно ниво.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/paris_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/paris_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/paris_breakfast.jpg"
                },
                "lat": 48.8667,
                "lng": 2.3044,
                "roomsAvailable": 4,
                "nearestAirport": { "name": "Charles de Gaulle Airport", "code": "CDG" },
                "attractions": [
                    {
                        "name": "Eiffel Tower",
                        "type": "landmark",
                        "description": "Символът на Париж, само на няколко минути пеша.",
                        "lat": 48.8584,
                        "lng": 2.2945
                    }
                ]
            },
            {
                "name": "Aurora Glass Cabin",
                "location": "Hella, Iceland",
                "city": "Hella",
                "country": "Iceland",
                "pricePerNight": 480,
                "rating": 5,
                "category": "Еко туризъм",
                "description": "Вашият личен прозорец към Космоса. Aurora Glass Cabin предлага уникално изживяване сред суровата природа на Исландия, където стъкленият покрив ви позволява да заспите под танците на Северното сияние.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/iceland_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/iceland_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/iceland_tub.jpg"
                },
                "lat": 63.8333,
                "lng": -20.4000,
                "roomsAvailable": 6,
                "nearestAirport": { "name": "Keflavík International", "code": "KEF" },
                "attractions": [
                    {
                        "name": "Seljalandsfoss",
                        "type": "nature",
                        "description": "Един от най-фотогеничните водопади в Исландия, зад който можете да се разходите.",
                        "lat": 63.6156,
                        "lng": -19.9886
                    }
                ]
            },
            {
                "name": "Casa do Sol",
                "location": "Alfama, Lisbon",
                "city": "Lisbon",
                "country": "Portugal",
                "pricePerNight": 165,
                "rating": 4,
                "category": "Градски туризъм",
                "description": "Усетете автентичния дух на Лисабон. Casa do Sol е разположен в най-стария квартал на града, предлагайки уют и традиционен португалски чар на достъпна цена.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/lisbon_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/lisbon_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/lisbon_rooftop.jpg"
                },
                "lat": 38.7121,
                "lng": -9.1292,
                "roomsAvailable": 10,
                "nearestAirport": { "name": "Lisbon Portela Airport", "code": "LIS" },
                "attractions": [
                    {
                        "name": "Castelo de S. Jorge",
                        "type": "landmark",
                        "description": "Средновековен замък с една от най-добрите панорамни гледки над Лисабон.",
                        "lat": 38.7139,
                        "lng": -9.1334
                    }
                ]
            },
            {
                "name": "Nomad Sands Estate",
                "location": "Al Marmoom Desert, Dubai",
                "city": "Dubai",
                "country": "UAE",
                "pricePerNight": 2400,
                "rating": 5,
                "category": "Екзотична почивка",
                "description": "Изгубете се в тишината на пустинята. Nomad Sands Estate предлага несравнимо уединение сред златните дюни на Дубай, съчетавайки традиционен арабски дух с ултра-модерен лукс.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/dubai_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/dubai_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/dubai_dinner.jpg"
                },
                "lat": 24.8166,
                "lng": 55.3333,
                "roomsAvailable": 5,
                "nearestAirport": { "name": "Dubai International", "code": "DXB" },
                "attractions": [
                    {
                        "name": "Al Qudra Lakes",
                        "type": "nature",
                        "description": "Оазис в пустинята, дом на десетки видове птици и красиви залези.",
                        "lat": 24.8385,
                        "lng": 55.3670
                    }
                ]
            },
            {
                "name": "The Brick Lane Hub",
                "location": "Shoreditch, London",
                "city": "London",
                "country": "United Kingdom",
                "pricePerNight": 420,
                "rating": 4,
                "category": "Градски туризъм",
                "description": "Усетете истинския пулс на Лондон. Разположен в артистичния Шоредич, този хотел съчетава индустриално минало с модерен шик, предлагайки ви най-доброто от лондонската култура.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/london_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/london_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/london_rooftop.jpg"
                },
                "lat": 51.5235,
                "lng": -0.0760,
                "roomsAvailable": 14,
                "nearestAirport": { "name": "London City Airport", "code": "LCY" },
                "attractions": [
                    {
                        "name": "Spitalfields Market",
                        "type": "landmark",
                        "description": "Исторически пазар за мода, изкуство и невероятна улична храна.",
                        "lat": 51.5195,
                        "lng": -0.0755
                    }
                ]
            },
            {
                "name": "The Bohemian Nest",
                "location": "Žižkov, Prague",
                "city": "Prague",
                "country": "Czech Republic",
                "pricePerNight": 115,
                "rating": 4,
                "category": "Градски туризъм",
                "description": "Прага е приказка, а The Bohemian Nest е вашият уютен ъгъл в нея. Разположен в артистичния квартал Жижков, този хотел предлага автентичен дух и комфорт на невероятна цена.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/prague_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/prague_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/prague_pub.jpg"
                },
                "lat": 50.0841,
                "lng": 14.4485,
                "roomsAvailable": 18,
                "nearestAirport": { "name": "Václav Havel Airport Prague", "code": "PRG" },
                "attractions": [
                    {
                        "name": "Charles Bridge",
                        "type": "landmark",
                        "description": "Емблематичният средновековен мост, свързващ Стария град с Мала Страна.",
                        "lat": 50.0865,
                        "lng": 14.4114
                    }
                ]
            },
            {
                "name": "Villa del Sogno",
                "location": "Bellagio, Lake Como",
                "city": "Bellagio",
                "country": "Italy",
                "pricePerNight": 2200,
                "rating": 5,
                "category": "Луксозен отдих",
                "description": "Класическа италианска приказка. Villa del Sogno съчетава история и аристократичен стил на брега на езерото Комо, предлагайки ви уединение, което е вдъхновявало поети и крале.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/como_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/como_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/como_boat.jpg"
                },
                "lat": 45.9861,
                "lng": 9.2575,
                "roomsAvailable": 4,
                "nearestAirport": { "name": "Milan Malpensa Airport", "code": "MXP" },
                "attractions": [
                    {
                        "name": "Villa Melzi Gardens",
                        "type": "landmark",
                        "description": "Едни от най-красивите градини в Италия, разположени по брега на езерото.",
                        "lat": 45.9814,
                        "lng": 9.2530
                    }
                ]
            },
            {
                "name": "Hotel Modernista",
                "location": "Eixample, Barcelona",
                "city": "Barcelona",
                "country": "Spain",
                "pricePerNight": 380,
                "rating": 5,
                "category": "Градски туризъм",
                "description": "Живейте в произведение на изкуството. Hotel Modernista ви пренася в златната ера на Барселона, предлагайки уникален дизайн, вдъхновен от Гауди, точно до най-известните паметници на града.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/barcelona_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/barcelona_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/barcelona_terrace.jpg"
                },
                "lat": 41.3917,
                "lng": 2.1649,
                "roomsAvailable": 12,
                "nearestAirport": { "name": "Barcelona-El Prat Airport", "code": "BCN" },
                "attractions": [
                    {
                        "name": "Casa Batlló",
                        "type": "landmark",
                        "description": "Шедьовърът на Антони Гауди, разположен само на няколко преки от хотела.",
                        "lat": 41.3916,
                        "lng": 2.1647
                    }
                ]
            },
            {
                "name": "Riad Al-Nur",
                "location": "Medina, Marrakesh",
                "city": "Marrakesh",
                "country": "Morocco",
                "pricePerNight": 75,
                "rating": 4,
                "category": "Екзотична почивка",
                "description": "Изживейте магията на Маракеш. Riad Al-Nur е оазис на тишината сред шума на Медината, предлагащ автентичен марокански гостоприемство и дизайн на достъпна за всеки цена.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/marrakesh_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/marrakesh_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/marrakesh_patio.jpg"
                },
                "lat": 31.6258,
                "lng": -7.9891,
                "roomsAvailable": 6,
                "nearestAirport": { "name": "Marrakesh Menara Airport", "code": "RAK" },
                "attractions": [
                    {
                        "name": "Jemaa el-Fnaa",
                        "type": "landmark",
                        "description": "Пулсиращият главен площад на Маракеш, пълен с пазари, музиканти и разказвачи на истории.",
                        "lat": 31.6259,
                        "lng": -7.9891
                    }
                ]
            },
            {
                "name": "The Skyline Vanguard",
                "location": "5th Avenue, Manhattan",
                "city": "New York",
                "country": "USA",
                "pricePerNight": 2150,
                "rating": 5,
                "category": "Градски лукс",
                "description": "Върхът на нюйоркския престиж. The Skyline Vanguard ви предлага да живеете сред облаците, съчетавайки ултра-модерен дизайн с най-впечатляващите гледки към Сентръл Парк и Манхатън.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/nyc_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/nyc_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/nyc_lounge.jpg"
                },
                "lat": 40.7624,
                "lng": -73.9738,
                "roomsAvailable": 3,
                "nearestAirport": { "name": "John F. Kennedy International", "code": "JFK" },
                "attractions": [
                    {
                        "name": "Central Park",
                        "type": "park",
                        "description": "Зеленото сърце на Ню Йорк, разположено точно под прозорците на хотела.",
                        "lat": 40.7851,
                        "lng": -73.9683
                    }
                ]
            },
            {
                "name": "The Pine Crest Lodge",
                "location": "Kitzbühel, Austrian Alps",
                "city": "Kitzbühel",
                "country": "Austria",
                "pricePerNight": 420,
                "rating": 5,
                "category": "Планинска почивка",
                "description": "Вашият модерен подслон в Алпите. The Pine Crest Lodge съчетава традиционния австрийски уют с изчистен съвременен дизайн, предлагайки ви перфектната база за ски през зимата и планински преходи през лятото.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/alpine_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/alpine_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/alpine_sauna.jpg"
                },
                "lat": 47.4467,
                "lng": 12.3914,
                "roomsAvailable": 9,
                "nearestAirport": { "name": "Salzburg Airport", "code": "SZG" },
                "attractions": [
                    {
                        "name": "Hahnenkamm",
                        "type": "landmark",
                        "description": "Една от най-известните ски писти в света, дом на легендарното състезание Streif.",
                        "lat": 47.4261,
                        "lng": 12.3736
                    }
                ]
            },
            {
                "name": "The Danube Loft",
                "location": "Jewish Quarter, Budapest",
                "city": "Budapest",
                "country": "Hungary",
                "pricePerNight": 120,
                "rating": 4,
                "category": "Градски туризъм",
                "description": "Будапеща никога не спи, а The Danube Loft е точно в центъра на събитията. Този арт-хотел съчетава историята на града с модерна индустриална естетика, предлагайки перфектното място за млади пътешественици на достъпна цена.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/budapest_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/budapest_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/budapest_bar.jpg"
                },
                "lat": 47.4981,
                "lng": 19.0630,
                "roomsAvailable": 15,
                "nearestAirport": { "name": "Budapest Ferenc Liszt International", "code": "BUD" },
                "attractions": [
                    {
                        "name": "Szimpla Kert",
                        "type": "landmark",
                        "description": "Най-известният 'ruin bar' в света, разположен само на няколко минути пеша.",
                        "lat": 47.4967,
                        "lng": 19.0633
                    }
                ]
            },
            {
                "name": "The Abyssal Azure",
                "location": "Rangali Island, Maldives",
                "city": "Rangali",
                "country": "Maldives",
                "pricePerNight": 3500,
                "rating": 5,
                "category": "Екзотична почивка",
                "description": "Потопете се в дълбините на лукса. The Abyssal Azure не е просто хотел, а подводно приключение, където границата между вашия сън и океана изчезва под стъкления купол на вашата стая.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/maldives_under_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/maldives_under_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/maldives_under_dining.jpg"
                },
                "lat": 3.6190,
                "lng": 72.7145,
                "roomsAvailable": 2,
                "nearestAirport": { "name": "Velana International", "code": "MLE" },
                "attractions": [
                    {
                        "name": "Ithaa Undersea Restaurant",
                        "type": "landmark",
                        "description": "Първият в света изцяло стъклен подводен ресторант.",
                        "lat": 3.6185,
                        "lng": 72.7140
                    }
                ]
            },
            {
                "name": "The Harbour Veridian",
                "location": "The Rocks, Sydney",
                "city": "Sydney",
                "country": "Australia",
                "pricePerNight": 480,
                "rating": 5,
                "category": "Градски туризъм",
                "description": "Вашият дом пред Операта. The Harbour Veridian съчетава историческото наследство на Сидни с модерна елегантност, предлагайки ви най-добрата локация за опознаване на австралийския мегаполис.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/sydney_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/sydney_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/sydney_pool.jpg"
                },
                "lat": -33.8587,
                "lng": 151.2100,
                "roomsAvailable": 11,
                "nearestAirport": { "name": "Sydney Kingsford Smith Airport", "code": "SYD" },
                "attractions": [
                    {
                        "name": "Sydney Opera House",
                        "type": "landmark",
                        "description": "Архитектурният шедьовър на 20-ти век, намиращ се само на кратка разходка през пристанището.",
                        "lat": -33.8568,
                        "lng": 151.2153
                    }
                ]
            },
            {
                "name": "The Lotus Serenity",
                "location": "Old Quarter, Hanoi",
                "city": "Hanoi",
                "country": "Vietnam",
                "pricePerNight": 85,
                "rating": 4,
                "category": "Екзотична почивка",
                "description": "Потопете се в душата на Ханой. The Lotus Serenity предлага автентично изживяване в сърцето на Стария град, където френският колониален стил среща виетнамското гостоприемство на изключително достъпна цена.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/hanoi_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/hanoi_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/hanoi_rooftop.jpg"
                },
                "lat": 21.0333,
                "lng": 105.8500,
                "roomsAvailable": 20,
                "nearestAirport": { "name": "Noi Bai International", "code": "HAN" },
                "attractions": [
                    {
                        "name": "Hoan Kiem Lake",
                        "type": "landmark",
                        "description": "Легендарното езеро в центъра на Ханой, символ на мира и спокойствието.",
                        "lat": 21.0285,
                        "lng": 105.8522
                    }
                ]
            },
            {
                "name": "Canopy Emerald Estate",
                "location": "Nosara, Costa Rica",
                "city": "Nosara",
                "country": "Costa Rica",
                "pricePerNight": 1950,
                "rating": 5,
                "category": "Еко лукс",
                "description": "Слейте се с природата без да напускате комфорта на модерния свят. Canopy Emerald Estate е архитектурно чудо в сърцето на джунглата, където луксът се измерва в чист въздух, диви звуци и гледки, които само птиците познават.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/canopy_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/canopy_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/canopy_pool.jpg"
                },
                "lat": 9.9700,
                "lng": -85.6600,
                "roomsAvailable": 4,
                "nearestAirport": { "name": "Liberia International", "code": "LIR" },
                "attractions": [
                    {
                        "name": "Playa Guiones",
                        "type": "beach",
                        "description": "Световноизвестен плаж за сърф и йога, известен със своите златни залези.",
                        "lat": 9.9400,
                        "lng": -85.6700
                    }
                ]
            },
            {
                "name": "The Nordic Knot",
                "location": "Østerbro, Copenhagen",
                "city": "Copenhagen",
                "country": "Denmark",
                "pricePerNight": 380,
                "rating": 5,
                "category": "Градски туризъм",
                "description": "Изживейте датското 'hygge'. The Nordic Knot съчетава устойчива архитектура с върховния комфорт на скандинавския дизайн, предлагайки ви спокойна и стилна база в сърцето на Копенхаген.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/denmark_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/denmark_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/denmark_coffee.jpg"
                },
                "lat": 55.7039,
                "lng": 12.5834,
                "roomsAvailable": 14,
                "nearestAirport": { "name": "Copenhagen Airport", "code": "CPH" },
                "attractions": [
                    {
                        "name": "The Little Mermaid",
                        "type": "landmark",
                        "description": "Емблематичната статуя от приказката на Андерсен, разположена на крайбрежната алея.",
                        "lat": 55.6929,
                        "lng": 12.5993
                    }
                ]
            },
            {
                "name": "The Amber Cobblestone",
                "location": "Kazimierz, Krakow",
                "city": "Krakow",
                "country": "Poland",
                "pricePerNight": 90,
                "rating": 4,
                "category": "Градски туризъм",
                "description": "Историята оживява в Кажимеж. The Amber Cobblestone ви предлага автентично краковско преживяване в сграда с характер, разположена в най-оживения и артистичен квартал на града.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/krakow_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/krakow_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/krakow_breakfast.jpg"
                },
                "lat": 50.0520,
                "lng": 19.9449,
                "roomsAvailable": 12,
                "nearestAirport": { "name": "John Paul II International Airport", "code": "KRK" },
                "attractions": [
                    {
                        "name": "Wawel Royal Castle",
                        "type": "landmark",
                        "description": "Сърцето на полската история, разположено на хълм над река Висла.",
                        "lat": 50.0541,
                        "lng": 19.9354
                    }
                ]
            },
            {
                "name": "Serengeti Horizon Lodge",
                "location": "Serengeti National Park, Tanzania",
                "city": "Serengeti",
                "country": "Tanzania",
                "pricePerNight": 2800,
                "rating": 5,
                "category": "Екзотична почивка",
                "description": "Дивата природа среща безкомпромисния лукс. Serengeti Horizon Lodge ви предлага предна седалка за голямата миграция, съчетавайки духа на старото сафари с модерните удобства на петзвезден ризорт.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/safari_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/safari_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/safari_fire.jpg"
                },
                "lat": -2.3333,
                "lng": 34.8333,
                "roomsAvailable": 4,
                "nearestAirport": { "name": "Kilimanjaro International", "code": "JRO" },
                "attractions": [
                    {
                        "name": "The Great Migration",
                        "type": "nature",
                        "description": "Най-голямото придвижване на диви животни в света, пресичащо равнините на Серенгети.",
                        "lat": -2.3350,
                        "lng": 34.8350
                    }
                ]
            },
            {
                "name": "The Gabled Vault",
                "location": "Prinsengracht, Amsterdam",
                "city": "Amsterdam",
                "country": "Netherlands",
                "pricePerNight": 450,
                "rating": 5,
                "category": "Градски туризъм",
                "description": "Потопете се в атмосферата на Златния век. The Gabled Vault съчетава три века история с най-доброто от модерния нидерландски дизайн, предлагайки ви автентичен престой точно на брега на най-известния канал в Амстердам.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/amsterdam_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/amsterdam_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/amsterdam_library.jpg"
                },
                "lat": 52.3667,
                "lng": 4.8833,
                "roomsAvailable": 7,
                "nearestAirport": { "name": "Schiphol Airport", "code": "AMS" },
                "attractions": [
                    {
                        "name": "Anne Frank House",
                        "type": "landmark",
                        "description": "Историческото скривалище на Ане Франк, разположено само на няколко минути пеша по канала.",
                        "lat": 52.3752,
                        "lng": 4.8840
                    }
                ]
            },
            {
                "name": "Acropolis Vista Studio",
                "location": "Plaka, Athens",
                "city": "Athens",
                "country": "Greece",
                "pricePerNight": 110,
                "rating": 4,
                "category": "Градски туризъм",
                "description": "Вашият гръцки пристан под звездите. Разположен в историческия център Плака, Acropolis Vista Studio предлага автентичен уют и неповторима гледка към Партенона на цена, която оставя бюджет за още едно фрапе.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/athens_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/athens_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/athens_roof.jpg"
                },
                "lat": 37.9715,
                "lng": 23.7297,
                "roomsAvailable": 10,
                "nearestAirport": { "name": "Athens International", "code": "ATH" },
                "attractions": [
                    {
                        "name": "Parthenon",
                        "type": "landmark",
                        "description": "Най-известният древногръцки храм, символ на античната демокрация и изкуство.",
                        "lat": 37.9715,
                        "lng": 23.7267
                    }
                ]
            },
            {
                "name": "Vahine Pearl Sanctuary",
                "location": "Motu Piti Aau, Bora Bora",
                "city": "Bora Bora",
                "country": "French Polynesia",
                "pricePerNight": 3200,
                "rating": 5,
                "category": "Екзотична почивка",
                "description": "Раят, за който сте мечтали. Vahine Pearl Sanctuary предлага върховно уединение над най-красивата лагуна в света, съчетавайки полинезийската автентичност с несравним модерен лукс.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/borabora_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/borabora_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/borabora_breakfast.jpg"
                },
                "lat": -16.5004,
                "lng": -151.7415,
                "roomsAvailable": 3,
                "nearestAirport": { "name": "Bora Bora Airport", "code": "BOB" },
                "attractions": [
                    {
                        "name": "Mount Otemanu",
                        "type": "landmark",
                        "description": "Емблематичният връх на острова, останка от древен вулкан.",
                        "lat": -16.4858,
                        "lng": -151.7347
                    }
                ]
            },
            {
                "name": "The Bauhaus Brick",
                "location": "Friedrichshain, Berlin",
                "city": "Berlin",
                "country": "Germany",
                "pricePerNight": 245,
                "rating": 5,
                "category": "Градски туризъм",
                "description": "Където историята среща техното. The Bauhaus Brick ви предлага автентично берлинско преживяване в сърцето на Фридрихсхайн, съчетавайки суровата естетика на стара фабрика с изтънчения комфорт на модерния дизайн.",
                "images": {
                    "exterior": "http://localhost:5000/uploads/hotels/berlin_ext.jpg",
                    "room": "http://localhost:5000/uploads/hotels/berlin_room.jpg",
                    "amenity": "http://localhost:5000/uploads/hotels/berlin_bar.jpg"
                },
                "lat": 52.5122,
                "lng": 13.4504,
                "roomsAvailable": 12,
                "nearestAirport": { "name": "Berlin Brandenburg Airport", "code": "BER" },
                "attractions": [
                    {
                        "name": "East Side Gallery",
                        "type": "landmark",
                        "description": "Най-дългата оцеляла част от Берлинската стена, превърната в галерия на открито.",
                        "lat": 52.5050,
                        "lng": 13.4397
                    }
                ]
            }
        ];

        await Hotel.insertMany(hotels);
        console.log('🚀 УСПЕХ! Данните са вкарани без грешки!');
        process.exit();
    } catch (error) {
        console.error('❌ ГРЕШКА ПРИ ЗАПИС:', error);
        process.exit(1);
    }
};

seedDatabase();