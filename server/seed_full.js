const { MongoClient } = require('mongodb');

async function runFullSeed() {
    const client = new MongoClient('mongodb://localhost:27017');
    try {
        await client.connect();
        const db = client.db('diplot_travel_agency_db');
        const collection = db.collection('hotels');
        
        // ⚠️ Първо изчистваме старата база, за да няма дублиране
        await collection.deleteMany({}); 

        const hotels = [
            // --- БЪЛГАРИЯ ---
            { 
                name: "Банско Сноу & Спа", location: "България, Банско", pricePerNight: 95, roomsAvailable: 10, nearestAirport: { name: "Sofia", code: "SOF" }, category: "Ski", rating: 4, image: "https://images.unsplash.com/photo-1551882547-ff40c0d12256?w=800", lat: 41.8383, lng: 23.4885,
                attractions: [
                    { name: "Ски писта Тодорка", type: "sport", icon: "⛷️", description: "Най-популярната писта в района.", lat: 41.8000, lng: 23.4700 },
                    { name: "Механа Бански Старец", type: "food", icon: "🍷", description: "Автентична кухня в стария град.", lat: 41.8350, lng: 23.4850 }
                ]
            },
            { 
                name: "Варна Сий Вю", location: "България, Варна", pricePerNight: 120, roomsAvailable: 8, nearestAirport: { name: "Varna", code: "VAR" }, category: "Beach", rating: 5, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800", lat: 43.2046, lng: 27.9105,
                attractions: [
                    { name: "Морската градина", type: "park", icon: "🌳", description: "Огромен парк край брега.", lat: 43.2040, lng: 27.9250 },
                    { name: "Делфинариум", type: "show", icon: "🐬", description: "Единственото по рода си шоу на Балканите.", lat: 43.2120, lng: 27.9400 }
                ]
            },
            { 
                name: "Търново Хистори", location: "България, В. Търново", pricePerNight: 75, roomsAvailable: 12, nearestAirport: { name: "Sofia", code: "SOF" }, category: "Culture", rating: 4, image: "https://images.unsplash.com/photo-1542314831-c6a4d27ce66b?w=800", lat: 43.0812, lng: 25.6411,
                attractions: [
                    { name: "Крепост Царевец", type: "history", icon: "🏰", description: "Символът на средновековна България.", lat: 43.0833, lng: 25.6517 },
                    { name: "Самоводска чаршия", type: "craft", icon: "🏺", description: "Улица на занаятите и традициите.", lat: 43.0850, lng: 25.6380 }
                ]
            },

            // --- ГЪРЦИЯ ---
            { 
                name: "Атина Ризорт", location: "Гърция, Атина", pricePerNight: 160, roomsAvailable: 6, nearestAirport: { name: "Athens Intl", code: "ATH" }, category: "Beach", rating: 5, image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800", lat: 37.9838, lng: 23.7275,
                attractions: [
                    { name: "Партенонът", type: "history", icon: "🏛️", description: "Древен храм на Акропола.", lat: 37.9715, lng: 23.7267 },
                    { name: "Плака", type: "area", icon: "🏘️", description: "Най-старият квартал с тесни улички.", lat: 37.9740, lng: 23.7300 }
                ]
            },
            { 
                name: "Санторини Блу", location: "Гърция, Санторини", pricePerNight: 350, roomsAvailable: 3, nearestAirport: { name: "Santorini", code: "JTR" }, category: "Beach", rating: 5, image: "https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?w=800", lat: 36.4618, lng: 25.3753,
                attractions: [
                    { name: "Залезът в Оя", type: "view", icon: "🌅", description: "Най-известният залез в света.", lat: 36.4630, lng: 25.3740 },
                    { name: "Червеният плаж", type: "beach", icon: "⛱️", description: "Уникален плаж с вулканични скали.", lat: 36.3480, lng: 25.3960 }
                ]
            },
            { 
                name: "Олимп Лодж", location: "Гърция, Литохоро", pricePerNight: 85, roomsAvailable: 15, nearestAirport: { name: "Thessaloniki", code: "SKG" }, category: "Mountain", rating: 3, image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800", lat: 40.1042, lng: 22.5023,
                attractions: [
                    { name: "Връх Митикас", type: "hiking", icon: "⛰️", description: "Най-високият връх на планината Олимп.", lat: 40.0860, lng: 22.3580 },
                    { name: "Каньонът Енипеас", type: "nature", icon: "🌊", description: "Прекрасни пътеки и водопади.", lat: 40.1010, lng: 22.4800 }
                ]
            },

            // --- ИТАЛИЯ ---
            { 
                name: "Рома Антикуа", location: "Италия, Рим", pricePerNight: 180, roomsAvailable: 9, nearestAirport: { name: "Rome Fiumicino", code: "FCO" }, category: "City", rating: 5, image: "https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=800", lat: 41.9028, lng: 12.4964,
                attractions: [
                    { name: "Колизеумът", type: "history", icon: "🏟️", description: "Арена на антични гладиаторски битки.", lat: 41.8902, lng: 12.4922 },
                    { name: "Фонтан ди Треви", type: "sight", icon: "⛲", description: "Един от най-красивите барокови фонтани.", lat: 41.9009, lng: 12.4833 }
                ]
            },
            { 
                name: "Доломити Алпин", location: "Италия, Кортина", pricePerNight: 240, roomsAvailable: 7, nearestAirport: { name: "Venice", code: "VCE" }, category: "Ski", rating: 4, image: "https://images.unsplash.com/photo-1520689453620-336e7fb63eb8?w=800", lat: 46.5405, lng: 12.1357,
                attractions: [
                    { name: "Езерото Мизурина", type: "view", icon: "🏞️", description: "Известно като перлата на Доломитите.", lat: 46.5820, lng: 12.2540 },
                    { name: "Лифт Тофана", type: "sport", icon: "🚠", description: "Достъп до легендарни ски писти.", lat: 46.5450, lng: 12.1200 }
                ]
            },
            { 
                name: "Амалфи Коуст", location: "Италия, Амалфи", pricePerNight: 290, roomsAvailable: 4, nearestAirport: { name: "Naples", code: "NAP" }, category: "Beach", rating: 5, image: "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?w=800", lat: 40.6340, lng: 14.6027,
                attractions: [
                    { name: "Катедралата на Амалфи", type: "history", icon: "⛪", description: "Централният площад и храм.", lat: 40.6343, lng: 14.6033 },
                    { name: "Пътят на боговете", type: "hiking", icon: "🥾", description: "Панорамен преход с гледка към Капри.", lat: 40.6170, lng: 14.5160 }
                ]
            },

            // --- ФРАНЦИЯ ---
            { 
                name: "Париж Лукс", location: "Франция, Париж", pricePerNight: 220, roomsAvailable: 5, nearestAirport: { name: "Charles de Gaulle", code: "CDG" }, category: "City", rating: 5, image: "https://images.unsplash.com/photo-1502602898657-3e907a5ea58e?w=800", lat: 48.8566, lng: 2.3522,
                attractions: [
                    { name: "Айфелова кула", type: "landmark", icon: "🗼", description: "Символът на Париж и Франция.", lat: 48.8584, lng: 2.2945 },
                    { name: "Лувърът", type: "art", icon: "🖼️", description: "Най-големият музей в света.", lat: 48.8606, lng: 2.3376 }
                ]
            },
            { 
                name: "Шамони Монблан", location: "Франция, Шамони", pricePerNight: 210, roomsAvailable: 4, nearestAirport: { name: "Geneva", code: "GVA" }, category: "Ski", rating: 4, image: "https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=800", lat: 45.9237, lng: 6.8694,
                attractions: [
                    { name: "Егюий дю Миди", type: "view", icon: "🏔️", description: "Връх с панорама към Монблан.", lat: 45.8794, lng: 6.8875 },
                    { name: "Мер дю Глас", type: "nature", icon: "❄️", description: "Ледник с пещери и тунели.", lat: 45.9220, lng: 6.9150 }
                ]
            },
            { 
                name: "Ница Ривиера", location: "Франция, Ница", pricePerNight: 190, roomsAvailable: 11, nearestAirport: { name: "Nice", code: "NCE" }, category: "Beach", rating: 4, image: "https://images.unsplash.com/photo-1533475141695-8e31b674bce4?w=800", lat: 43.7102, lng: 7.2620,
                attractions: [
                    { name: "Променад дез Англе", type: "walk", icon: "🌴", description: "Легендарната крайбрежна алея.", lat: 43.6950, lng: 7.2650 },
                    { name: "Старият град", type: "area", icon: "🎨", description: "Цветни пазари и тесни улички.", lat: 43.6970, lng: 7.2750 }
                ]
            },

            // --- ИСПАНИЯ ---
            { 
                name: "Барселона Готик", location: "Испания, Барселона", pricePerNight: 145, roomsAvailable: 12, nearestAirport: { name: "Barcelona", code: "BCN" }, category: "Culture", rating: 4, image: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=800", lat: 41.3851, lng: 2.1734,
                attractions: [
                    { name: "Саграда Фамилия", type: "landmark", icon: "⛪", description: "Шедьовърът на Антони Гауди.", lat: 41.4036, lng: 2.1744 },
                    { name: "Парк Гюел", type: "art", icon: "🦎", description: "Приказна градина с мозайки.", lat: 41.4145, lng: 2.1527 }
                ]
            },
            { 
                name: "Мадрид Палас", location: "Испания, Мадрид", pricePerNight: 165, roomsAvailable: 8, nearestAirport: { name: "Madrid", code: "MAD" }, category: "City", rating: 5, image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800", lat: 40.4168, lng: -3.7038,
                attractions: [
                    { name: "Кралският дворец", type: "history", icon: "🤴", description: "Официалната резиденция на краля.", lat: 40.4179, lng: -3.7144 },
                    { name: "Музей Прадо", type: "art", icon: "🎨", description: "Една от най-богатите галерии в света.", lat: 40.4138, lng: -3.6921 }
                ]
            },
            { 
                name: "Ибиса Бийч", location: "Испания, Ибиса", pricePerNight: 280, roomsAvailable: 4, nearestAirport: { name: "Ibiza", code: "IBZ" }, category: "Beach", rating: 4, image: "https://images.unsplash.com/photo-1573843225204-be251626bb9e?w=800", lat: 38.9067, lng: 1.4206,
                attractions: [
                    { name: "Далт Вила", type: "history", icon: "🏰", description: "Старият град на хълма.", lat: 38.9070, lng: 1.4360 },
                    { name: "Ес Ведра", type: "view", icon: "⛰️", description: "Мистичен скален остров.", lat: 38.8700, lng: 1.2200 }
                ]
            },

            // --- ХЪРВАТИЯ ---
            { 
                name: "Адриатик Дубровник", location: "Хърватия, Дубровник", pricePerNight: 210, roomsAvailable: 6, nearestAirport: { name: "Dubrovnik", code: "DBV" }, category: "Beach", rating: 5, image: "https://images.unsplash.com/photo-1555990538-9e972956a23e?w=800", lat: 42.6507, lng: 18.0944,
                attractions: [
                    { name: "Градските стени", type: "history", icon: "🛡️", description: "Обиколете целия стар град.", lat: 42.6410, lng: 18.1070 },
                    { name: "Връх Сърдж", type: "view", icon: "🚠", description: "Панорама от високо с лифт.", lat: 42.6480, lng: 18.1100 }
                ]
            },
            { 
                name: "Сплит Харбър", location: "Хърватия, Сплит", pricePerNight: 130, roomsAvailable: 10, nearestAirport: { name: "Split", code: "SPU" }, category: "Culture", rating: 4, image: "https://images.unsplash.com/photo-1589197331516-4d846c33bf18?w=800", lat: 43.5081, lng: 16.4402,
                attractions: [
                    { name: "Дворецът на Диоклециан", type: "history", icon: "🏛️", description: "Римско наследство в центъра.", lat: 43.5084, lng: 16.4404 },
                    { name: "Хълмът Марян", type: "nature", icon: "🌲", description: "Горски парк край брега.", lat: 43.5070, lng: 16.4100 }
                ]
            },
            { 
                name: "Хвар Сън", location: "Хърватия, Хвар", pricePerNight: 195, roomsAvailable: 5, nearestAirport: { name: "Split", code: "SPU" }, category: "Beach", rating: 5, image: "https://images.unsplash.com/photo-1534008757030-2670ca43530c?w=800", lat: 43.1736, lng: 16.4419,
                attractions: [
                    { name: "Фортица Спанйола", type: "view", icon: "🏰", description: "Гледка към Паклените острови.", lat: 43.1770, lng: 16.4430 },
                    { name: "Паклени острови", type: "nature", icon: "🚤", description: "Архипелаг с кристална вода.", lat: 43.1600, lng: 16.3800 }
                ]
            },

            // --- ШВЕЙЦАРИЯ ---
            { 
                name: "Цермат Матерхорн", location: "Швейцария, Цермат", pricePerNight: 420, roomsAvailable: 3, nearestAirport: { name: "Zurich", code: "ZRH" }, category: "Ski", rating: 5, image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=800", lat: 46.0207, lng: 7.7491,
                attractions: [
                    { name: "Горнерграт", type: "view", icon: "🏔️", description: "Влак до вечните ледници.", lat: 45.9830, lng: 7.7850 },
                    { name: "Глетчер Палас", type: "sight", icon: "❄️", description: "Ледена пещера вътре в ледника.", lat: 45.9383, lng: 7.7292 }
                ]
            },
            { 
                name: "Интерлакен Лейк", location: "Швейцария, Интерлакен", pricePerNight: 310, roomsAvailable: 5, nearestAirport: { name: "Bern", code: "BRN" }, category: "Mountain", rating: 4, image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=800", lat: 46.6863, lng: 7.8632,
                attractions: [
                    { name: "Хардер Кулм", type: "view", icon: "🔭", description: "Гледка към езерата и планините.", lat: 46.6970, lng: 7.8540 },
                    { name: "Езеро Бриенц", type: "water", icon: "⛵", description: "Тюркоазена вода и разходки.", lat: 46.7200, lng: 7.9700 }
                ]
            },
            { 
                name: "Ст. Мориц Ски", location: "Швейцария, Ст. Мориц", pricePerNight: 550, roomsAvailable: 2, nearestAirport: { name: "Engadin", code: "SMV" }, category: "Ski", rating: 5, image: "https://images.unsplash.com/photo-1544133782-999332560383?w=800", lat: 46.4908, lng: 9.8355,
                attractions: [
                    { name: "Корвиля", type: "sport", icon: "⛷️", description: "Ски писти за напреднали.", lat: 46.5050, lng: 9.8150 },
                    { name: "Езеро Сейнт Мориц", type: "nature", icon: "⛸️", description: "Езеро, ставащо на ледена пързалка.", lat: 46.4910, lng: 9.8450 }
                ]
            },

            // --- АВСТРИЯ ---
            { 
                name: "Виена Гранд", location: "Австрия, Виена", pricePerNight: 205, roomsAvailable: 12, nearestAirport: { name: "Vienna", code: "VIE" }, category: "City", rating: 5, image: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800", lat: 48.2082, lng: 16.3738,
                attractions: [
                    { name: "Дворец Шьонбрун", type: "history", icon: "🏰", description: "Императорска резиденция.", lat: 48.1848, lng: 16.3122 },
                    { name: "Стефансдом", type: "landmark", icon: "⛪", description: "Емблематичната катедрала.", lat: 48.2085, lng: 16.3730 }
                ]
            },
            { 
                name: "Инсбрук Алпин", location: "Австрия, Инсбрук", pricePerNight: 140, roomsAvailable: 9, nearestAirport: { name: "Innsbruck", code: "INN" }, category: "Ski", rating: 4, image: "https://images.unsplash.com/photo-1520114056694-98d939a9978a?w=800", lat: 47.2692, lng: 11.4041,
                attractions: [
                    { name: "Златният покрив", type: "landmark", icon: "🏛️", description: "Символът на града от 15-ти век.", lat: 47.2685, lng: 11.3933 },
                    { name: "Лифт Нордкете", type: "view", icon: "🚠", description: "Панорама от Алпите за 20 мин.", lat: 47.2860, lng: 11.3990 }
                ]
            },
            { 
                name: "Залцбург Моцарт", location: "Австрия, Залцбург", pricePerNight: 160, roomsAvailable: 7, nearestAirport: { name: "Salzburg", code: "SZG" }, category: "Culture", rating: 4, image: "https://images.unsplash.com/photo-1599940824399-b87987cb9723?w=800", lat: 47.8095, lng: 13.0550,
                attractions: [
                    { name: "Крепост Хоензалцбург", type: "history", icon: "🛡️", description: "Добре запазена крепост на хълм.", lat: 47.7940, lng: 13.0470 },
                    { name: "Градините Мирабел", type: "park", icon: "🌷", description: "Красиви барокови градини.", lat: 47.8050, lng: 13.0420 }
                ]
            },

            // --- ПОРТУГАЛИЯ ---
            { 
                name: "Лисабон Сърф", location: "Португалия, Лисабон", pricePerNight: 110, roomsAvailable: 15, nearestAirport: { name: "Lisbon", code: "LIS" }, category: "Beach", rating: 4, image: "https://images.unsplash.com/photo-1585208798174-6cedd863bc99?w=800", lat: 38.7223, lng: -9.1393,
                attractions: [
                    { name: "Кулата Белем", type: "history", icon: "🗼", description: "Символ на откривателите.", lat: 38.6916, lng: -9.2160 },
                    { name: "Квартал Алфама", type: "walk", icon: "🚋", description: "Най-старият квартал с Fado.", lat: 38.7120, lng: -9.1300 }
                ]
            },
            { 
                name: "Алгарве Ризорт", location: "Португалия, Албуфейра", pricePerNight: 240, roomsAvailable: 8, nearestAirport: { name: "Faro", code: "FAO" }, category: "Beach", rating: 5, image: "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800", lat: 37.0891, lng: -8.2479,
                attractions: [
                    { name: "Пещерата Бенагил", type: "nature", icon: "🛶", description: "Достъп до скрития плаж с лодка.", lat: 37.0870, lng: -8.4230 },
                    { name: "Плаж Фалезия", type: "beach", icon: "🏖️", description: "Златист пясък под червени скали.", lat: 37.0850, lng: -8.1700 }
                ]
            },
            { 
                name: "Порто Ривър", location: "Португалия, Порто", pricePerNight: 135, roomsAvailable: 10, nearestAirport: { name: "Porto", code: "OPO" }, category: "Culture", rating: 4, image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800", lat: 41.1579, lng: -8.6291,
                attractions: [
                    { name: "Мост Луи I", type: "landmark", icon: "🌉", description: "Двуетажен метален мост.", lat: 41.1390, lng: -8.6090 },
                    { name: "Квартал Рибейра", type: "food", icon: "🍤", description: "Зона с ресторанти край реката.", lat: 41.1400, lng: -8.6130 }
                ]
            },

            // --- ГЕРМАНИЯ ---
            { 
                name: "Берлин Сити", location: "Германия, Берлин", pricePerNight: 155, roomsAvailable: 20, nearestAirport: { name: "Berlin", code: "BER" }, category: "City", rating: 4, image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800", lat: 52.5200, lng: 13.4050,
                attractions: [
                    { name: "Бранденбургската врата", type: "history", icon: "🏛️", description: "Символ на обединена Германия.", lat: 52.5163, lng: 13.3777 },
                    { name: "Берлинската стена", type: "history", icon: "🎨", description: "Източната галерия.", lat: 52.5050, lng: 13.4390 }
                ]
            },
            { 
                name: "Мюнхен Биер", location: "Германия, Мюнхен", pricePerNight: 180, roomsAvailable: 14, nearestAirport: { name: "Munich", code: "MUC" }, category: "Culture", rating: 5, image: "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=800", lat: 48.1351, lng: 11.5820,
                attractions: [
                    { name: "Мариенплац", type: "walk", icon: "⛪", description: "Сърцето на стария Мюнхен.", lat: 48.1370, lng: 11.5750 },
                    { name: "Английската градина", type: "park", icon: "🏄", description: "Огромен градски парк.", lat: 48.1500, lng: 11.5900 }
                ]
            },
            { 
                name: "Гармиш Ски", location: "Германия, Гармиш", pricePerNight: 170, roomsAvailable: 6, nearestAirport: { name: "Munich", code: "MUC" }, category: "Ski", rating: 4, image: "https://images.unsplash.com/photo-1482867996988-29ec3aee816d?w=800", lat: 47.4917, lng: 11.0955,
                attractions: [
                    { name: "Връх Цугшпице", type: "view", icon: "🏔️", description: "Най-високият връх в Германия.", lat: 47.4211, lng: 10.9848 },
                    { name: "Ждрелото Партнахклам", type: "nature", icon: "🏞️", description: "Мистични водопади и скали.", lat: 47.4680, lng: 11.1180 }
                ]
            }
        ];

        await collection.insertMany(hotels);
        console.log('🎉 УСПЕХ! Всички 30 хотела и 60 атракции са заредени в базата!');
    } finally {
        await client.close();
    }
}
runFullSeed();