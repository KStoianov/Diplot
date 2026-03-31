import React, { createContext, useState, useContext, useEffect } from 'react';

export const translations = {
    bg: {
        // Общи & Навигация
        search: "Търсене", myTrips: "Моите почивки", logout: "Изход",
        // Начална страница (Home)
        heroTitle1: "Пренапиши", heroTitle2: "историята си.", heroSubtitle: "Къде ще те отведе следващият импулс? Опиши го.", searchPlaceholder: "Напр: Търся уединена вила на океана за 7 дни...", discoverBtn: "Открий",
        tropicalParadise: "Тропически рай", mountainRetreat: "Планинско уединение", unknownAdventure: "Непознато приключение", curatedCollection: "Curated Collection", speciallyForYou: "Специално за Вас.", perNight: "За нощувка",
        // Резултати & Модал
        premiumSelection: "Premium Selection", your: "Вашето", nextLevel: "следващо ниво.", exterior: "Екстериор", suite: "Сюит", amenities: "Удобства", rating: "Rating", approxPrice: "Ориентировъчна цена", nearestAirport: "Най-близко летище", transport: "Транспорт", checkIn: "Настаняване", checkOut: "Напускане", totalFor: "Общо за", nights: "нощувки", bookNow: "Запази почивката", saved: "Запазено", goToMyTrips: "Към Моите Почивки", chooseLogistics: "Изберете логистика (Полет / Кола)",
        // Моите пътешествия
        backToSearch: "Към Търсачката", travelLog: "Travel Log", myTripsTitle1: "Моите", myTripsTitle2: "пътешествия.", noTrips: "Все още нямате резервирани приключения.", searchHoliday: "Търси почивка", period: "Период", days: "Дни", totalPrice: "Обща Цена", awaitingFinalization: "Очаква Финализиране", wantFlight: "✈️ Искам самолетни билети и трансфер", ownTransportOption: "🚗 Ще пътувам със собствен транспорт", departureCity: "Град на тръгване (Напр. Варна)", exactAddress: "Точен адрес на взимане", generateTicket: "Генерирай Билет", confirmHotelOnly: "Потвърди (Само Хотел)", confirmedHotelOnly: "Потвърдено (Собствен Транспорт)", confirmedWithLogistics: "Потвърдено с Логистика", clickForDetails: "Кликни за детайли", downloadReceipt: "Изтегли Квитанция", walk: "Пеша", car: "Кола", fullItinerary: "Full Itinerary", ownTransportTitle: "Собствен транспорт", ownTransportDesc: "Тази резервация включва само хотелско настаняване.", flightTicket: "Авиобилет", from: "От", to: "До", transferLabel: "Трансфер:", seatLabel: "Място:", distanceToAttraction: "Разстояние до атракция", time: "Време", paidAmount: "Платена сума", paid: "Платено", loadingGen: "Зареждане...", loadingSave: "Запазване...",
        // Профил
        premiumMember: 'Премиум член', activeProfile: 'Активен профил', favoritePlaces: 'Любими места', emptyFavoritesTitle: 'Нямате любими места', emptyFavoritesDesc: 'Потърсете и добавете хотели към своите любими места.',
        // Категории (Database)
        "Морска почивка": "Морска почивка", "Градски туризъм": "Градски туризъм", "Планинска почивка": "Планинска почивка", "Еко туризъм": "Еко туризъм", "Екзотична почивка": "Екзотична почивка", "Градски лукс": "Градски лукс", "Еко лукс": "Еко лукс",
        // Вход & Регистрация
        loginError: "Грешка при вход", loginHeroDesc: "Открийте следващата си мечтана дестинация. Интелигентна търсачка, ексклузивни оферти и премиум преживяване от ново поколение.", welcomeBack: "Добре дошли пак", loginToAccount: "Влезте във вашия акаунт", emailLabel: "Имейл", passwordLabel: "Парола", loginBtn: "Вход", noAccount: "Нямате акаунт?", createNow: "Създайте сега", registerSuccess: "Регистрацията е успешна! Влезте сега.", registerError: "Грешка при регистрация!", joinDiplot: "Стани част от Diplot", unlockWorld: "Отключи свят от възможности и персонализирани приключения.", fullNameLabel: "Пълно име", namePlaceholder: "Иван Иванов", createAccountBtn: "Създай акаунт", alreadyHaveAccount: "Вече имаш акаунт?", loginHere: "Влез тук", registerHeroTitle: "EXPLORE", registerHeroDesc: "\"Пътешествието от хиляди мили започва с една единствена стъпка.\" Направи я с нас и преоткрий смисъла на думите свобода и лукс.",
        loading: "Зареждане...",
        vipTransportDesc: "Личен шофьор с Mercedes-Benz S-Class. Включва посрещане с табелка на летището, шампанско, освежаващи кърпи и Wi-Fi."
    },
    en: {
        search: "Search", myTrips: "My Trips", logout: "Logout",
        heroTitle1: "Rewrite", heroTitle2: "your story.", heroSubtitle: "Where will your next impulse take you? Describe it.", searchPlaceholder: "E.g., I'm looking for a secluded ocean villa for 7 days...", discoverBtn: "Discover",
        tropicalParadise: "Tropical Paradise", mountainRetreat: "Mountain Retreat", unknownAdventure: "Unknown Adventure", curatedCollection: "Curated Collection", speciallyForYou: "Specially For You.", perNight: "Per Night",
        premiumSelection: "Premium Selection", your: "Your", nextLevel: "next level.", exterior: "Exterior", suite: "Suite", amenities: "Amenities", rating: "Rating", approxPrice: "Approximate Price", nearestAirport: "Nearest Airport", transport: "Transport", checkIn: "Check-in", checkOut: "Check-out", totalFor: "Total for", nights: "nights", bookNow: "Book Now", saved: "Saved", goToMyTrips: "Go to My Trips", chooseLogistics: "Choose logistics (Flight / Car)",
        backToSearch: "Back to Search", travelLog: "Travel Log", myTripsTitle1: "My", myTripsTitle2: "journeys.", noTrips: "You don't have any booked adventures yet.", searchHoliday: "Search Holiday", period: "Period", days: "Days", totalPrice: "Total Price", awaitingFinalization: "Awaiting Finalization", wantFlight: "✈️ I want flight tickets and transfer", ownTransportOption: "🚗 I will use my own transport", departureCity: "Departure City (e.g. London)", exactAddress: "Exact pickup address", generateTicket: "Generate Ticket", confirmHotelOnly: "Confirm (Hotel Only)", confirmedHotelOnly: "Confirmed (Own Transport)", confirmedWithLogistics: "Confirmed with Logistics", clickForDetails: "Click for details", downloadReceipt: "Download Receipt", walk: "Walk", car: "Car", fullItinerary: "Full Itinerary", ownTransportTitle: "Own Transport", ownTransportDesc: "This booking includes hotel accommodation only.", flightTicket: "Flight Ticket", from: "From", to: "To", transferLabel: "Transfer:", seatLabel: "Seat:", distanceToAttraction: "Distance to attraction", time: "Time", paidAmount: "Amount Paid", paid: "Paid", loadingGen: "Loading...", loadingSave: "Saving...",
        premiumMember: 'Premium Member', activeProfile: 'Active Profile', favoritePlaces: 'Favorite Places', emptyFavoritesTitle: 'No Favorite Places', emptyFavoritesDesc: 'Search and add hotels to your favorite places.',
        "Морска почивка": "Beach Holiday", "Градски туризъм": "City Break", "Планинска почивка": "Mountain Retreat", "Еко туризъм": "Eco Tourism", "Екзотична почивка": "Exotic Getaway", "Градски лукс": "Urban Luxury", "Еко лукс": "Eco Luxury",
        loginError: "Login error", loginHeroDesc: "Discover your next dream destination. Intelligent search, exclusive offers, and a next-generation premium experience.", welcomeBack: "Welcome back", loginToAccount: "Log into your account", emailLabel: "Email", passwordLabel: "Password", loginBtn: "Log In", noAccount: "Don't have an account?", createNow: "Create now", registerSuccess: "Registration successful! Please log in.", registerError: "Registration error!", joinDiplot: "Join Diplot", unlockWorld: "Unlock a world of possibilities and personalized adventures.", fullNameLabel: "Full Name", namePlaceholder: "John Doe", createAccountBtn: "Create Account", alreadyHaveAccount: "Already have an account?", loginHere: "Log in here", registerHeroTitle: "EXPLORE", registerHeroDesc: "\"A journey of a thousand miles begins with a single step.\" Take it with us and rediscover the meaning of freedom and luxury.",
        loading: "Loading...",
        vipTransportDesc: "Personal chauffeur with a Mercedes-Benz S-Class. Airport meet & greet, champagne, refreshing towels and Wi-Fi included."
    }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Взимаме записания език от localStorage или слагаме 'bg' по подразбиране
    const [language, setLanguage] = useState(localStorage.getItem('app_lang') || 'bg');

    const toggleLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('app_lang', lang);
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);

export const LanguageSwitcher = () => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <button
                onClick={() => toggleLanguage('bg')}
                className={`transition-colors duration-300 ${language === 'bg' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
                БГ
            </button>
            <span className="text-slate-700">|</span>
            <button
                onClick={() => toggleLanguage('en')}
                className={`transition-colors duration-300 ${language === 'en' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
                EN
            </button>
        </div>
    );
};