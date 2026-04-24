const mongoose = require('mongoose');
const Hotel = require('./models/Hotel');

mongoose.connect('mongodb://localhost:27017/diplot_travel_agency_db')
    .then(() => console.log(' Свързан за импорт...'))
    .catch(err => console.error(err));

const hotels = [
    {
        "name": "The Azure Sanctuary",
        "location": "North Malé Atoll, Maldives",
        "city": "Malé",
        "country": "Maldives",
        "pricePerNight": 1250,
        "rating": 5,
        "category": "Морска почивка",
        "description": "Изживейте върховното уединение в нашите вили над водата, където минимализмът среща безкрайния хоризонт на Индийския океан.",
        "roomsAvailable": 7,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/azure_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/azure_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/azure_pool.jpg"
        },
        "lat": 4.1755,
        "lng": 73.5093,
        "nearestAirport": {
            "name": "Velana International",
            "code": "MLE"
        },
        "attractions": [
            {
                "name": "Banana Reef",
                "type": "diving",
                "description": "Едно от най-известните места за гмуркане в света.",
                "lat": 4.2166,
                "lng": 73.5333,
                "_id": "69c626d6de61aef3bf2afdb7"
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
        "roomsAvailable": 5,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/velvet_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/velvet_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/velvet_pool.jpg"
        },
        "lat": 45.4147,
        "lng": 6.6335,
        "nearestAirport": {
            "name": "Geneva Airport",
            "code": "GVA"
        },
        "attractions": [
            {
                "name": "La Croisette",
                "type": "skiing",
                "description": "Епицентърът на ски зоната в Куршевел.",
                "lat": 45.415,
                "lng": 6.634,
                "_id": "69c626d6de61aef3bf2afdb9"
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
        "roomsAvailable": 12,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/zenith_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/zenith_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/zenith_bar.jpg"
        },
        "lat": 35.6895,
        "lng": 139.6917,
        "nearestAirport": {
            "name": "Narita International",
            "code": "NRT"
        },
        "attractions": [
            {
                "name": "Shinjuku Gyoen",
                "type": "park",
                "description": "Оазис от тишина сред градската джунгла.",
                "lat": 35.6852,
                "lng": 139.71,
                "_id": "69c626d6de61aef3bf2afdbb"
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
        "roomsAvailable": 2,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/oia_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/oia_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/oia_spa.jpg"
        },
        "lat": 36.4618,
        "lng": 25.3753,
        "nearestAirport": {
            "name": "Santorini Airport",
            "code": "JTR"
        },
        "attractions": [
            {
                "name": "Amoudi Bay",
                "type": "beach",
                "description": "Живописно заливче с кристална вода под скалите на Оя.",
                "lat": 36.459,
                "lng": 25.371,
                "_id": "69c626d6de61aef3bf2afdbd"
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
        "roomsAvailable": 15,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/berlin_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/berlin_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/berlin_cafe.jpg"
        },
        "lat": 52.4986,
        "lng": 13.4069,
        "nearestAirport": {
            "name": "Berlin Brandenburg",
            "code": "BER"
        },
        "attractions": [
            {
                "name": "East Side Gallery",
                "type": "museum",
                "description": "Най-дългата останала част от Берлинската стена, превърната в галерия.",
                "lat": 52.505,
                "lng": 13.4397,
                "_id": "69c626d6de61aef3bf2afdbf"
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
        "roomsAvailable": 9,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/bali_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/bali_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/bali_yoga.jpg"
        },
        "lat": -8.5069,
        "lng": 115.2625,
        "nearestAirport": {
            "name": "Ngurah Rai International",
            "code": "DPS"
        },
        "attractions": [
            {
                "name": "Tegallalang Rice Terrace",
                "type": "nature",
                "description": "Емблематичните оризови тераси на Бали с невероятни панорамни гледки.",
                "lat": -8.4333,
                "lng": 115.2833,
                "_id": "69c626d6de61aef3bf2afdc1"
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
        "roomsAvailable": 4,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/paris_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/paris_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/paris_breakfast.jpg"
        },
        "lat": 48.8667,
        "lng": 2.3044,
        "nearestAirport": {
            "name": "Charles de Gaulle Airport",
            "code": "CDG"
        },
        "attractions": [
            {
                "name": "Eiffel Tower",
                "type": "landmark",
                "description": "Символът на Париж, само на няколко минути пеша.",
                "lat": 48.8584,
                "lng": 2.2945,
                "_id": "69c626d6de61aef3bf2afdc3"
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
        "roomsAvailable": 6,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/iceland_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/iceland_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/iceland_tub.jpg"
        },
        "lat": 63.8333,
        "lng": -20.4,
        "nearestAirport": {
            "name": "Keflavík International",
            "code": "KEF"
        },
        "attractions": [
            {
                "name": "Seljalandsfoss",
                "type": "nature",
                "description": "Един от най-фотогеничните водопади в Исландия, зад който можете да се разходите.",
                "lat": 63.6156,
                "lng": -19.9886,
                "_id": "69c626d6de61aef3bf2afdc5"
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
        "roomsAvailable": 10,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/lisbon_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/lisbon_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/lisbon_rooftop.jpg"
        },
        "lat": 38.7121,
        "lng": -9.1292,
        "nearestAirport": {
            "name": "Lisbon Portela Airport",
            "code": "LIS"
        },
        "attractions": [
            {
                "name": "Castelo de S. Jorge",
                "type": "landmark",
                "description": "Средновековен замък с една от най-добрите панорамни гледки над Лисабон.",
                "lat": 38.7139,
                "lng": -9.1334,
                "_id": "69c626d6de61aef3bf2afdc7"
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
        "roomsAvailable": 4,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/dubai_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/dubai_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/dubai_dinner.jpg"
        },
        "lat": 24.8166,
        "lng": 55.3333,
        "nearestAirport": {
            "name": "Dubai International",
            "code": "DXB"
        },
        "attractions": [
            {
                "name": "Al Qudra Lakes",
                "type": "nature",
                "description": "Оазис в пустинята, дом на десетки видове птици и красиви залези.",
                "lat": 24.8385,
                "lng": 55.367,
                "_id": "69c626d6de61aef3bf2afdc9"
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
        "roomsAvailable": 15,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/london_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/london_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/london_rooftop.jpg"
        },
        "lat": 51.5235,
        "lng": -0.076,
        "nearestAirport": {
            "name": "London City Airport",
            "code": "LCY"
        },
        "attractions": [
            {
                "name": "Spitalfields Market",
                "type": "landmark",
                "description": "Исторически пазар за мода, изкуство и невероятна улична храна.",
                "lat": 51.5195,
                "lng": -0.0755,
                "_id": "69c626d6de61aef3bf2afdcb"
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
        "roomsAvailable": 18,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/prague_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/prague_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/prague_pub.jpg"
        },
        "lat": 50.0841,
        "lng": 14.4485,
        "nearestAirport": {
            "name": "Václav Havel Airport Prague",
            "code": "PRG"
        },
        "attractions": [
            {
                "name": "Charles Bridge",
                "type": "landmark",
                "description": "Емблематичният средновековен мост, свързващ Стария град с Мала Страна.",
                "lat": 50.0865,
                "lng": 14.4114,
                "_id": "69c626d6de61aef3bf2afdcd"
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
        "category": "Градски лукс",
        "description": "Класическа италианска приказка. Villa del Sogno съчетава история и аристократичен стил на брега на езерото Комо, предлагайки ви уединение, което е вдъхновявало поети и крале.",
        "roomsAvailable": 4,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/como_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/como_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/como_boat.jpg"
        },
        "lat": 45.9861,
        "lng": 9.2575,
        "nearestAirport": {
            "name": "Milan Malpensa Airport",
            "code": "MXP"
        },
        "attractions": [
            {
                "name": "Villa Melzi Gardens",
                "type": "landmark",
                "description": "Едни от най-красивите градини в Италия, разположени по брега на езерото.",
                "lat": 45.9814,
                "lng": 9.253,
                "_id": "69c626d6de61aef3bf2afdcf"
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
        "roomsAvailable": 12,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/barcelona_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/barcelona_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/barcelona_terrace.jpg"
        },
        "lat": 41.3917,
        "lng": 2.1649,
        "nearestAirport": {
            "name": "Barcelona-El Prat Airport",
            "code": "BCN"
        },
        "attractions": [
            {
                "name": "Casa Batlló",
                "type": "landmark",
                "description": "Шедьовърът на Антони Гауди, разположен само на няколко преки от хотела.",
                "lat": 41.3916,
                "lng": 2.1647,
                "_id": "69c626d6de61aef3bf2afdd1"
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
        "roomsAvailable": 6,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/marrakesh_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/marrakesh_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/marrakesh_patio.jpg"
        },
        "lat": 31.6258,
        "lng": -7.9891,
        "nearestAirport": {
            "name": "Marrakesh Menara Airport",
            "code": "RAK"
        },
        "attractions": [
            {
                "name": "Jemaa el-Fnaa",
                "type": "landmark",
                "description": "Пулсиращият главен площад на Маракеш, пълен с пазари, музиканти и разказвачи на истории.",
                "lat": 31.6259,
                "lng": -7.9891,
                "_id": "69c626d6de61aef3bf2afdd3"
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
        "roomsAvailable": 3,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/nyc_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/nyc_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/nyc_lounge.jpg"
        },
        "lat": 40.7624,
        "lng": -73.9738,
        "nearestAirport": {
            "name": "John F. Kennedy International",
            "code": "JFK"
        },
        "attractions": [
            {
                "name": "Central Park",
                "type": "park",
                "description": "Зеленото сърце на Ню Йорк, разположено точно под прозорците на хотела.",
                "lat": 40.7851,
                "lng": -73.9683,
                "_id": "69c626d6de61aef3bf2afdd5"
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
        "roomsAvailable": 9,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/alpine_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/alpine_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/alpine_sauna.jpg"
        },
        "lat": 47.4467,
        "lng": 12.3914,
        "nearestAirport": {
            "name": "Salzburg Airport",
            "code": "SZG"
        },
        "attractions": [
            {
                "name": "Hahnenkamm",
                "type": "landmark",
                "description": "Една от най-известните ски писти в света, дом на легендарното състезание Streif.",
                "lat": 47.4261,
                "lng": 12.3736,
                "_id": "69c626d6de61aef3bf2afdd7"
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
        "roomsAvailable": 15,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/budapest_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/budapest_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/budapest_bar.jpg"
        },
        "lat": 47.4981,
        "lng": 19.063,
        "nearestAirport": {
            "name": "Budapest Ferenc Liszt International",
            "code": "BUD"
        },
        "attractions": [
            {
                "name": "Szimpla Kert",
                "type": "landmark",
                "description": "Най-известният 'ruin bar' в света, разположен само на няколко минути пеша.",
                "lat": 47.4967,
                "lng": 19.0633,
                "_id": "69c626d6de61aef3bf2afdd9"
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
        "roomsAvailable": 2,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/maldives_under_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/maldives_under_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/maldives_under_dining.jpg"
        },
        "lat": 3.619,
        "lng": 72.7145,
        "nearestAirport": {
            "name": "Velana International",
            "code": "MLE"
        },
        "attractions": [
            {
                "name": "Ithaa Undersea Restaurant",
                "type": "landmark",
                "description": "Първият в света изцяло стъклен подводен ресторант.",
                "lat": 3.6185,
                "lng": 72.714,
                "_id": "69c626d6de61aef3bf2afddb"
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
        "roomsAvailable": 11,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/sydney_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/sydney_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/sydney_pool.jpg"
        },
        "lat": -33.8587,
        "lng": 151.21,
        "nearestAirport": {
            "name": "Sydney Kingsford Smith Airport",
            "code": "SYD"
        },
        "attractions": [
            {
                "name": "Sydney Opera House",
                "type": "landmark",
                "description": "Архитектурният шедьовър на 20-ти век, намиращ се само на кратка разходка през пристанището.",
                "lat": -33.8568,
                "lng": 151.2153,
                "_id": "69c626d6de61aef3bf2afddd"
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
        "roomsAvailable": 20,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/hanoi_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/hanoi_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/hanoi_rooftop.jpg"
        },
        "lat": 21.0333,
        "lng": 105.85,
        "nearestAirport": {
            "name": "Noi Bai International",
            "code": "HAN"
        },
        "attractions": [
            {
                "name": "Hoan Kiem Lake",
                "type": "landmark",
                "description": "Легендарното езеро в центъра на Ханой, символ на мира и спокойствието.",
                "lat": 21.0285,
                "lng": 105.8522,
                "_id": "69c626d6de61aef3bf2afddf"
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
        "roomsAvailable": 4,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/canopy_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/canopy_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/canopy_pool.jpg"
        },
        "lat": 9.97,
        "lng": -85.66,
        "nearestAirport": {
            "name": "Liberia International",
            "code": "LIR"
        },
        "attractions": [
            {
                "name": "Playa Guiones",
                "type": "beach",
                "description": "Световноизвестен плаж за сърф и йога, известен със своите златни залези.",
                "lat": 9.94,
                "lng": -85.67,
                "_id": "69c626d6de61aef3bf2afde1"
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
        "roomsAvailable": 14,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/denmark_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/denmark_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/denmark_coffee.jpg"
        },
        "lat": 55.7039,
        "lng": 12.5834,
        "nearestAirport": {
            "name": "Copenhagen Airport",
            "code": "CPH"
        },
        "attractions": [
            {
                "name": "The Little Mermaid",
                "type": "landmark",
                "description": "Емблематичната статуя от приказката на Андерсен, разположена на крайбрежната алея.",
                "lat": 55.6929,
                "lng": 12.5993,
                "_id": "69c626d6de61aef3bf2afde3"
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
        "roomsAvailable": 12,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/krakow_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/krakow_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/krakow_breakfast.jpg"
        },
        "lat": 50.052,
        "lng": 19.9449,
        "nearestAirport": {
            "name": "John Paul II International Airport",
            "code": "KRK"
        },
        "attractions": [
            {
                "name": "Wawel Royal Castle",
                "type": "landmark",
                "description": "Сърцето на полската история, разположено на хълм над река Висла.",
                "lat": 50.0541,
                "lng": 19.9354,
                "_id": "69c626d6de61aef3bf2afde5"
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
        "roomsAvailable": 4,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/safari_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/safari_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/safari_fire.jpg"
        },
        "lat": -2.3333,
        "lng": 34.8333,
        "nearestAirport": {
            "name": "Kilimanjaro International",
            "code": "JRO"
        },
        "attractions": [
            {
                "name": "The Great Migration",
                "type": "nature",
                "description": "Най-голямото придвижване на диви животни в света, пресичащо равнините на Серенгети.",
                "lat": -2.335,
                "lng": 34.835,
                "_id": "69c626d6de61aef3bf2afde7"
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
        "roomsAvailable": 7,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/amsterdam_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/amsterdam_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/amsterdam_library.jpg"
        },
        "lat": 52.3667,
        "lng": 4.8833,
        "nearestAirport": {
            "name": "Schiphol Airport",
            "code": "AMS"
        },
        "attractions": [
            {
                "name": "Anne Frank House",
                "type": "landmark",
                "description": "Историческото скривалище на Ане Франк, разположено само на няколко минути пеша по канала.",
                "lat": 52.3752,
                "lng": 4.884,
                "_id": "69c626d6de61aef3bf2afde9"
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
        "roomsAvailable": 10,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/athens_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/athens_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/athens_roof.jpg"
        },
        "lat": 37.9715,
        "lng": 23.7297,
        "nearestAirport": {
            "name": "Athens International",
            "code": "ATH"
        },
        "attractions": [
            {
                "name": "Parthenon",
                "type": "landmark",
                "description": "Най-известният древногръцки храм, символ на античната демокрация и изкуство.",
                "lat": 37.9715,
                "lng": 23.7267,
                "_id": "69c626d6de61aef3bf2afdeb"
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
        "roomsAvailable": 3,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/borabora_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/borabora_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/borabora_breakfast.jpg"
        },
        "lat": -16.5004,
        "lng": -151.7415,
        "nearestAirport": {
            "name": "Bora Bora Airport",
            "code": "BOB"
        },
        "attractions": [
            {
                "name": "Mount Otemanu",
                "type": "landmark",
                "description": "Емблематичният връх на острова, останка от древен вулкан.",
                "lat": -16.4858,
                "lng": -151.7347,
                "_id": "69c626d6de61aef3bf2afded"
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
        "roomsAvailable": 12,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/berlin_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/berlin_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/berlin_bar.jpg"
        },
        "lat": 52.5122,
        "lng": 13.4504,
        "nearestAirport": {
            "name": "Berlin Brandenburg Airport",
            "code": "BER"
        },
        "attractions": [
            {
                "name": "East Side Gallery",
                "type": "landmark",
                "description": "Най-дългата оцеляла част от Берлинската стена, превърната в галерия на открито.",
                "lat": 52.505,
                "lng": 13.4397,
                "_id": "69c626d6de61aef3bf2afdef"
            }
        ]
    },
    {
        "name": "Sakura Traditional Ryokan",
        "location": "Gion District, Kyoto, Japan",
        "city": "Kyoto",
        "country": "Japan",
        "pricePerNight": 450,
        "rating": 5,
        "category": "Културен туризъм",
        "description": "Потопете се в автентичната атмосфера на древно Киото. Нашият риокан предлага традиционни татами стаи, общи онсен бани и класическа кайсеки вечеря.",
        "roomsAvailable": 12,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/ryokan_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/ryokan_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/ryokan_onsen.jpg"
        },
        "lat": 35.0036,
        "lng": 135.7785,
        "nearestAirport": {
            "name": "Kansai International",
            "code": "KIX"
        },
        "attractions": [
            {
                "name": "Kiyomizu-dera Temple",
                "type": "landmark",
                "description": "Емблематичен будистки храм, известен със своята дървена сцена, предлагаща зашеметяваща гледка към града.",
                "lat": 34.9949,
                "lng": 135.785,
                "_id": "69e51fd05e2e00bc49a2cbfc"
            }
        ]
    },
    {
        "name": "Alpine Echo Chalet",
        "location": "Zermatt Village, Swiss Alps, Switzerland",
        "city": "Zermatt",
        "country": "Switzerland",
        "pricePerNight": 890,
        "rating": 5,
        "category": "Планинска почивка",
        "description": "Луксозно шале с директна гледка към емблематичния връх Матерхорн. Насладете се на уютна камина, частно спа и ски-ин/ски-аут достъп през зимата.",
        "roomsAvailable": 5,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/chalet_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/chalet_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/chalet_spa.jpg"
        },
        "lat": 46.0207,
        "lng": 7.7491,
        "nearestAirport": {
            "name": "Zurich International",
            "code": "ZRH"
        },
        "attractions": [
            {
                "name": "Matterhorn Glacier Paradise",
                "type": "adventure",
                "description": "Най-високата въжена линия в Европа, водеща до ледников рай с целогодишен сняг и панорамни гледки.",
                "lat": 45.9383,
                "lng": 7.73,
                "_id": "69e51fd05e2e00bc49a2cbfe"
            }
        ]
    },
    {
        "name": "Red Sands Bedouin Retreat",
        "location": "Wadi Rum Protected Area, Jordan",
        "city": "Wadi Rum",
        "country": "Jordan",
        "pricePerNight": 320,
        "rating": 5,
        "category": "Пустинно приключение",
        "description": "Изживейте магията на пустинята в нашите луксозни стъклени куполи. Наблюдавайте звездите директно от леглото си и се насладете на традиционно бедуинско гостоприемство сред марсиански пейзажи.",
        "roomsAvailable": 10,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/wadirum_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/wadirum_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/wadirum_dining.jpg"
        },
        "lat": 29.5768,
        "lng": 35.4209,
        "nearestAirport": {
            "name": "King Hussein International",
            "code": "AQJ"
        },
        "attractions": [
            {
                "name": "Khazali Canyon",
                "type": "nature",
                "description": "Тясна клисура, известна със своите древни петроглифи и надписи, издълбани по високите скални стени.",
                "lat": 29.5333,
                "lng": 35.4167,
                "_id": "69e51fd05e2e00bc49a2cc00"
            }
        ]
    },
    {
        "name": "Verde Canopy Eco-Lodge",
        "location": "Monteverde Cloud Forest, Costa Rica",
        "city": "Monteverde",
        "country": "Costa Rica",
        "pricePerNight": 280,
        "rating": 5,
        "category": "Еко туризъм",
        "description": "Слейте се с природата в нашите луксозни еко-къщички, сгушени високо в короните на дърветата. Събудете се от песните на тропически птици и изследвайте мъгливите гори по висящи мостове.",
        "roomsAvailable": 15,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/verde_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/verde_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/verde_pool.jpg"
        },
        "lat": 10.3,
        "lng": -84.8167,
        "nearestAirport": {
            "name": "Juan Santamaría International",
            "code": "SJO"
        },
        "attractions": [
            {
                "name": "Monteverde Cloud Forest Reserve",
                "type": "nature",
                "description": "Уникален природен резерват, известен със своята мъглива атмосфера, висящи мостове и огромно биоразнообразие.",
                "lat": 10.301,
                "lng": -84.796,
                "_id": "69e51fd05e2e00bc49a2cc02"
            }
        ]
    },
    {
        "name": "Highland Crown Castle",
        "location": "Isle of Skye, Scotland",
        "city": "Portree",
        "country": "Scotland",
        "pricePerNight": 550,
        "rating": 5,
        "category": "Културен туризъм",
        "description": "Почувствайте се като кралски особи в този реставриран замък от 16-ти век. Предлагаме автентични стаи с антични мебели, дегустация на уиски край камината и драматични гледки към суровите шотландски пейзажи.",
        "roomsAvailable": 12,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/castle_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/castle_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/castle_whisky.jpg"
        },
        "lat": 57.4125,
        "lng": -6.196,
        "nearestAirport": {
            "name": "Inverness Airport",
            "code": "INV"
        },
        "attractions": [
            {
                "name": "Old Man of Storr",
                "type": "nature",
                "description": "Драматични и емблематични скални образувания, стърчащи над зелените хълмове на остров Скай.",
                "lat": 57.5072,
                "lng": -6.1743,
                "_id": "69e51fd05e2e00bc49a2cc04"
            }
        ]
    },
    {
        "name": "Aurora Ice Palace",
        "location": "Rovaniemi, Lapland, Finland",
        "city": "Rovaniemi",
        "country": "Finland",
        "pricePerNight": 600,
        "rating": 5,
        "category": "Арктическо преживяване",
        "description": "Спете в стаи, изцяло изваяни от лед и сняг или изберете нашите стъклени иглута с панорамни покриви. Насладете се на уютни термални спални чували и наблюдавайте магическото Северно сияние директно от леглото си.",
        "roomsAvailable": 14,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/ice_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/ice_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/ice_sauna.jpg"
        },
        "lat": 66.5039,
        "lng": 25.7294,
        "nearestAirport": {
            "name": "Rovaniemi Airport",
            "code": "RVN"
        },
        "attractions": [
            {
                "name": "Santa Claus Village",
                "type": "landmark",
                "description": "Официалното село на Дядо Коледа, разположено точно на Арктическия кръг, предлагащо целогодишна коледна магия.",
                "lat": 66.5434,
                "lng": 25.8481,
                "_id": "69e51fd05e2e00bc49a2cc06"
            }
        ]
    },
    {
        "name": "Kelebek Cave Retreat",
        "location": "Göreme, Cappadocia, Turkey",
        "city": "Göreme",
        "country": "Turkey",
        "pricePerNight": 350,
        "rating": 5,
        "category": "Културен туризъм",
        "description": "Уникален бутиков хотел, ръчно изсечен в древните вулканични скали на Кападокия. Посрещнете изгрева от личната си тераса, докато стотици балони с горещ въздух изпълват небето над приказните комини.",
        "roomsAvailable": 18,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/cave_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/cave_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/cave_terrace.jpg"
        },
        "lat": 38.6431,
        "lng": 34.8295,
        "nearestAirport": {
            "name": "Nevşehir Kapadokya",
            "code": "NAV"
        },
        "attractions": [
            {
                "name": "Göreme Open Air Museum",
                "type": "culture",
                "description": "Комплекс от скални църкви и манастири с невероятно запазени византийски фрески от 10-ти век.",
                "lat": 38.6401,
                "lng": 34.8453,
                "_id": "69e51fd05e2e00bc49a2cc08"
            }
        ]
    },
    {
        "name": "Villa del Sole Estate",
        "location": "Tuscany, Italy",
        "city": "San Gimignano",
        "country": "Italy",
        "pricePerNight": 420,
        "rating": 5,
        "category": "Винен туризъм",
        "description": "Потопете се в италианската 'La Dolce Vita' в тази реставрирана каменна вила от 17-ти век. Заобиколени от лозя и маслинови горички, гостите могат да се насладят на ексклузивни винени дегустации и домашна тосканска кухня.",
        "roomsAvailable": 9,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/tuscany_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/tuscany_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/tuscany_wine.jpg"
        },
        "lat": 43.4675,
        "lng": 11.0539,
        "nearestAirport": {
            "name": "Florence Amerigo Vespucci",
            "code": "FLR"
        },
        "attractions": [
            {
                "name": "Historic Centre of San Gimignano",
                "type": "culture",
                "description": "Средновековен град, известен като 'Средновековния Манхатън' заради своите добре запазени каменни кули и автентична архитектура.",
                "lat": 43.4675,
                "lng": 11.0422,
                "_id": "69e51fd05e2e00bc49a2cc0a"
            }
        ]
    },
    {
        "name": "Lotus Lake Palace",
        "location": "Udaipur, Rajasthan, India",
        "city": "Udaipur",
        "country": "India",
        "pricePerNight": 850,
        "rating": 5,
        "category": "Кралски лукс",
        "description": "Почувствайте се като истински махараджа в този зашеметяващ дворец от бял мрамор, сякаш плаващ в средата на езерото Пичола. Пристигането е с частна лодка, а обслужването е достойно за кралски особи.",
        "roomsAvailable": 8,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/india_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/india_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/india_boat.jpg"
        },
        "lat": 24.5764,
        "lng": 73.6798,
        "nearestAirport": {
            "name": "Maharana Pratap Airport",
            "code": "UDR"
        },
        "attractions": [
            {
                "name": "City Palace Udaipur",
                "type": "culture",
                "description": "Огромен и величествен дворцов комплекс, съчетаващ раджпутска и моголска архитектура, извисяващ се над езерото.",
                "lat": 24.5768,
                "lng": 73.6835,
                "_id": "69e51fd05e2e00bc49a2cc0c"
            }
        ]
    },
    {
        "name": "Amazonia Floating Lodge",
        "location": "Manaus, Amazon Rainforest, Brazil",
        "city": "Manaus",
        "country": "Brazil",
        "pricePerNight": 420,
        "rating": 5,
        "category": "Еко туризъм",
        "description": "Ексклузивен плаващ хотел дълбоко в сърцето на Амазонската джунгла. Събудете се от звуците на реката и екзотичните птици. Предлагаме каяк турове и нощно сафари за каймани.",
        "roomsAvailable": 15,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/amazon_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/amazon_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/amazon_kayak.jpg"
        },
        "lat": -3.119,
        "lng": -60.0217,
        "nearestAirport": {
            "name": "Eduardo Gomes International",
            "code": "MAO"
        },
        "attractions": [
            {
                "name": "Meeting of Waters (Encontro das Águas)",
                "type": "nature",
                "description": "Уникален природен феномен, при който тъмните води на река Рио Негро текат успоредно със светлите води на Амазонка, без да се смесват в продължение на километри.",
                "lat": -3.136,
                "lng": -59.902,
                "_id": "69e51fd05e2e00bc49a2cc0e"
            }
        ]
    },
    {
        "name": "Condor Cliff Pods",
        "location": "Sacred Valley, Cusco, Peru",
        "city": "Cusco",
        "country": "Peru",
        "pricePerNight": 650,
        "rating": 5,
        "category": "Екстремен лукс",
        "description": "Спете в прозрачна стъклена капсула от авио-алуминий, окачена на 400 метра височина върху отвесна скала. Достъпът изисква скално катерене или спускане по зиплайн, но наградата е спираща дъха панорама към Свещената долина на инките и милиони звезди над вас.",
        "roomsAvailable": 4,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/peru_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/peru_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/peru_dining.jpg"
        },
        "lat": -13.3039,
        "lng": -72.0722,
        "nearestAirport": {
            "name": "Alejandro Velasco Astete",
            "code": "CUZ"
        },
        "attractions": [
            {
                "name": "Machu Picchu",
                "type": "landmark",
                "description": "Изгубеният град на инките – едно от новите седем чудеса на света, разположено високо в мъгливите върхове на Андите.",
                "lat": -13.1631,
                "lng": -72.545,
                "_id": "69e51fd05e2e00bc49a2cc10"
            }
        ]
    },
    {
        "name": "Obsidian Geothermal Retreat",
        "location": "Grindavík, Iceland",
        "city": "Grindavík",
        "country": "Iceland",
        "pricePerNight": 850,
        "rating": 5,
        "category": "Термален релакс",
        "description": "Потопете се в лечебните, млечносини геотермални води на нашите частни лагуни. Хотелът е изграден от естествен черен вулканичен камък и стъкло, предлагайки минималистичен скандинавски лукс сред суровите пейзажи на Исландия.",
        "roomsAvailable": 12,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/iceland1_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/iceland1_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/iceland1_pool.jpg"
        },
        "lat": 63.8804,
        "lng": -22.4495,
        "nearestAirport": {
            "name": "Keflavík International",
            "code": "KEF"
        },
        "attractions": [
            {
                "name": "Fagradalsfjall Volcano",
                "type": "adventure",
                "description": "Активен вулкан, който предлага възможност за безопасни и вълнуващи преходи покрай застинали полета от прясна лава.",
                "lat": 63.8886,
                "lng": -22.2716,
                "_id": "69e51fd05e2e00bc49a2cc12"
            }
        ]
    },
    {
        "name": "Riad Al-Zahara",
        "location": "Medina, Marrakech, Morocco",
        "city": "Marrakech",
        "country": "Morocco",
        "pricePerNight": 320,
        "rating": 5,
        "category": "Културно туризъм",
        "description": "Скрит оазис в сърцето на оживената Медина. Този традиционен марокански риад разполага с тих вътрешен двор, богато украсен с ръчно изработени мозайки, ароматни цитрусови дървета и освежаващ централен басейн.",
        "roomsAvailable": 6,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/morocco_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/morocco_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/morocco_rooftop.jpg"
        },
        "lat": 31.6295,
        "lng": -7.9811,
        "nearestAirport": {
            "name": "Marrakech Menara Airport",
            "code": "RAK"
        },
        "attractions": [
            {
                "name": "Jemaa el-Fnaa",
                "type": "culture",
                "description": "Световноизвестният централен площад на Маракеш, изпълнен с улични музиканти, разказвачи на приказки и колоритни пазари.",
                "lat": 31.6258,
                "lng": -7.9891,
                "_id": "69e51fd05e2e00bc49a2cc14"
            }
        ]
    },
    {
        "name": "Emerald Lake Timber Lodge",
        "location": "Banff National Park, Canada",
        "city": "Banff",
        "country": "Canada",
        "pricePerNight": 520,
        "rating": 5,
        "category": "Езерна почивка",
        "description": "Луксозна А-образна дървена хижа, разположена на брега на зашеметяващо тюркоазено ледниково езеро. Събудете се с панорамна гледка към вековни борови гори и величествени скалисти върхове.",
        "roomsAvailable": 10,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/banff_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/banff_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/banff_canoe.jpg"
        },
        "lat": 51.4254,
        "lng": -116.1773,
        "nearestAirport": {
            "name": "Calgary International",
            "code": "YYC"
        },
        "attractions": [
            {
                "name": "Lake Louise",
                "type": "nature",
                "description": "Емблематично ледниково езеро, известно със своя невероятен тюркоазен цвят и заобикалящите го стръмни планини и ледници.",
                "lat": 51.4111,
                "lng": -116.2167,
                "_id": "69e51fd05e2e00bc49a2cc16"
            }
        ]
    },
    {
        "name": "Pitons Panorama Sanctuary",
        "location": "Soufrière, St. Lucia, Caribbean",
        "city": "Soufrière",
        "country": "Saint Lucia",
        "pricePerNight": 1350,
        "rating": 5,
        "category": "Еко лукс",
        "description": "Архитектурен шедьовър, в който всяка стая има само три стени, а четвъртата липсва, за да открие зашеметяваща панорама към планините Питони и Карибско море. Разполага с частен инфинити басейн с цветни стъклени мозайки и 24-часово обслужване от иконом.",
        "roomsAvailable": 5,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/caribbean_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/caribbean_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/caribbean_pool.jpg"
        },
        "lat": 13.8477,
        "lng": -61.0711,
        "nearestAirport": {
            "name": "Hewanorra International",
            "code": "UVF"
        },
        "attractions": [
            {
                "name": "The Pitons",
                "type": "nature",
                "description": "Две емблематични вулканични кули, издигащи се директно от морето, включени в списъка на ЮНЕСКО за световно наследство.",
                "lat": 13.8167,
                "lng": -61.0667,
                "_id": "69e51fd05e2e00bc49a2cc18"
            }
        ]
    },
    {
        "name": "Le Grand Palais de Monaco",
        "location": "Place du Casino, Monte Carlo, Monaco",
        "city": "Monte Carlo",
        "country": "Monaco",
        "pricePerNight": 1900,
        "rating": 5,
        "category": "Кралски лукс",
        "description": "Легендарен хотел в сърцето на Княжеството, въплъщение на стила Belle Époque. Предлага несравним разкош, интериори с кристални полилеи и тераси, които гледат директно към пистата на Формула 1 и яхтеното пристанище Порт Еркюл.",
        "roomsAvailable": 15,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/monaco_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/monaco_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/monaco_terrace.jpg"
        },
        "lat": 43.7391,
        "lng": 7.4278,
        "nearestAirport": {
            "name": "Nice Côte d'Azur",
            "code": "NCE"
        },
        "attractions": [
            {
                "name": "Casino de Monte-Carlo",
                "type": "culture",
                "description": "Едно от най-известните казина в света, шедьовър на архитектурата и символ на хайлайфа в Монако.",
                "lat": 43.7393,
                "lng": 7.4281,
                "_id": "69e51fd05e2e00bc49a2cc1a"
            }
        ]
    },
    {
        "name": "Echo Antarctic Horizon",
        "location": "Queen Maud Land, Antarctica",
        "city": "Wolf's Fang Runway",
        "country": "Antarctica",
        "pricePerNight": 1200,
        "rating": 5,
        "category": "Арктическо преживяване",
        "description": "Най-изолираният лукс на планетата. Спете в свръхмодерни капсули, вдъхновени от космическата ера, разположени върху ледници на милиони години. Насладете се на пълна тишина, полярни изследвания и гурме кухня на края на света.",
        "roomsAvailable": 4,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/antarctica_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/antarctica_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/antarctica_exp2.jpg"
        },
        "lat": -70.7719,
        "lng": 11.8383,
        "nearestAirport": {
            "name": "Wolf's Fang Runway (Private)",
            "code": "WFR"
        },
        "attractions": [
            {
                "name": "Emperor Penguin Colony",
                "type": "wildlife",
                "description": "Възможност за посещение на огромни колонии от величествени императорски пингвини в естествената им среда.",
                "lat": -70.5,
                "lng": 10,
                "_id": "69e51fd05e2e00bc49a2cc1c"
            }
        ]
    },
    {
        "name": "Dragon's Pearl Cruise",
        "location": "Ha Long Bay, Vietnam",
        "city": "Ha Long",
        "country": "Vietnam",
        "pricePerNight": 450,
        "rating": 5,
        "category": "Морски круиз",
        "description": "Традиционен виетнамски кораб (джунка), превърнат в петзвезден плаващ хотел. Плавайте сред хиляди варовикови острови, издигащи се от изумрудените води, и се насладете на вечери с морски дарове под звездите.",
        "roomsAvailable": 12,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/vietnam_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/vietnam_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/vietnam_deck.jpg"
        },
        "lat": 20.9101,
        "lng": 107.1839,
        "nearestAirport": {
            "name": "Van Don International",
            "code": "VDO"
        },
        "attractions": [
            {
                "name": "Sung Sot Cave",
                "type": "nature",
                "description": "Една от най-големите и грандиозни пещери в залива Ха Лонг, известна със своите невероятни сталактити и сталагмити.",
                "lat": 20.85,
                "lng": 107.12,
                "_id": "69e51fd05e2e00bc49a2cc1e"
            }
        ]
    },
    {
        "name": "Southern Cross Observatory Lodge",
        "location": "Lake Tekapo, Southern Alps, New Zealand",
        "city": "Tekapo",
        "country": "New Zealand",
        "pricePerNight": 720,
        "rating": 5,
        "category": "Планинска почивка",
        "description": "Разположен в сърцето на международния резерват за тъмно небе, този хотел предлага стаи с изцяло стъклени покриви. Наблюдавайте Южния кръст и Млечния път с професионален телескоп директно от вашата тераса.",
        "roomsAvailable": 8,
        "images": {
            "exterior": "http://localhost:5000/uploads/hotels/nz_ext.jpg",
            "room": "http://localhost:5000/uploads/hotels/nz_room.jpg",
            "amenity": "http://localhost:5000/uploads/hotels/nz_telescope.jpg"
        },
        "lat": -43.8833,
        "lng": 170.45,
        "nearestAirport": {
            "name": "Christchurch International",
            "code": "CHC"
        },
        "attractions": [
            {
                "name": "Church of the Good Shepherd",
                "type": "landmark",
                "description": "Живописна каменна църква на брега на езерото Текапо, предлагаща една от най-фотографираните гледки в света.",
                "lat": -43.8831,
                "lng": 170.4831,
                "_id": "69e51fd05e2e00bc49a2cc20"
            }
        ]
    }
];

const seedDB = async () => {
    try {
        await Hotel.deleteMany({});
        await Hotel.insertMany(hotels);
        console.log('🚀 Базата данни е напълнена успешно с експортираните данни!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();