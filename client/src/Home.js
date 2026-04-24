import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiStar, FiMapPin, FiCompass, FiSun, FiWind } from 'react-icons/fi';

// Вмъкваме езиковия контекст
import { useLanguage } from './components/LanguageContext';

//  Дефинираме адреса на сървъра
const API_URL = "http://localhost:5000";

//  Пътищата към  3000x4000 снимки
const dayImages = [
    `${API_URL}/uploads/home_photos/day1.jpg`,
    `${API_URL}/uploads/home_photos/day2.jpg`
];

const nightImages = [
    `${API_URL}/uploads/home_photos/night1.jpg`,
    `${API_URL}/uploads/home_photos/night2.jpg`
];

const Home = () => {
    const [wish, setWish] = useState('');
    const [availableHotels, setAvailableHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [bgImage, setBgImage] = useState('');
    const navigate = useNavigate();

    const { t, language } = useLanguage();
    const { scrollY } = useScroll();

    //  ОПТИМИЗИРАНИ ЕФЕКТИ ЗА ВИСОКА РЕЗОЛЮЦИЯ
    const yHero = useTransform(scrollY, [0, 800], [0, 150]);
    const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);
    // Намаляваме максималния blur до 12px, за да не се губи красотата на снимката
    const blurBg = useTransform(scrollY, [0, 600], ['blur(0px)', 'blur(12px)']);
    // Тъй като снимките са 3000px+, можем да си позволим по-голям зум (1.10) без пиксели
    const scaleBg = useTransform(scrollY, [0, 1000], [1.0, 1.10]);

    const quickIdeas = [
        { text: t('tropicalParadise'), icon: <FiSun /> },
        { text: t('mountainRetreat'), icon: <FiWind /> },
        { text: t('unknownAdventure'), icon: <FiCompass /> }
    ];

    const updateBackground = () => {
        const isDark = document.documentElement.classList.contains('dark');
        const images = isDark ? nightImages : dayImages;
        const randomPic = images[Math.floor(Math.random() * images.length)];
        setBgImage(randomPic);
    };

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            navigate('/login');
            return;
        }
        setUser(storedUser);
        updateBackground();

        axios.get(`${API_URL}/api/hotels`)
            .then(res => setAvailableHotels(res.data))
            .catch(err => console.error("Грешка при зареждане на хотелите"));

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') updateBackground();
            });
        });

        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, [navigate]);

    const askGemma = async () => {
        if (!wish) return;
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/api/chat`, { message: wish });
            navigate('/search', { state: { results: availableHotels, aiMessage: res.data, duration: res.data.duration || 7 } });
        } catch (err) {
            alert("AI е зает, опитайте пак.");
        }
        setLoading(false);
    };

    const recommendedHotels = useMemo(() => {
        if (!availableHotels.length || !user) return [];
        return [...availableHotels].sort(() => 0.5 - Math.random()).slice(0, 3);
    }, [availableHotels, user]);

    const handleRecommendedClick = (hotel) => {
        navigate('/search', {
            state: {
                results: [hotel],
                aiMessage: { rawText: language === 'en' ? `Personalized recommendation: ${hotel.name}.` : `Персонализирана препоръка: ${hotel.name}.` },
                duration: 7
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B1121] font-sans selection:bg-teal-500/30 overflow-hidden relative">

            {/*  CINEMATIC IMAGE BACKGROUND */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute inset-0 w-full h-full"
                    style={{ filter: blurBg, scale: scaleBg }}
                >
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={bgImage}
                            src={bgImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="w-full h-full object-cover"
                            style={{ 
                                // 'center 35%' фокусира снимката малко над средата (идеално за пейзажи с небе)
                                objectPosition: 'center 35%',
                                imageRendering: 'auto'
                            }}
                            alt="Background"
                        />
                    </AnimatePresence>
                </motion.div>

                {/*  ОВЪРЛЕЙ ЗА ЧЕТИМОСТ (Увеличен интензитет за по-наситени авторски снимки) */}
                <div className="absolute inset-0 bg-white/20 dark:bg-[#0B1121]/75 transition-colors duration-1000"></div>
                <div className="absolute bottom-0 left-0 w-full h-[70vh] bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA]/60 to-transparent dark:from-[#0B1121] dark:via-[#0B1121]/80 transition-colors duration-1000"></div>
            </div>

            {/*  HERO SECTION */}
            <motion.div
                className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-4 w-full"
                style={{ y: yHero, opacity: opacityHero }}
            >
                <div className="text-center max-w-5xl mx-auto w-full mt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1] mb-6 drop-shadow-sm">
                            {t('heroTitle1')} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 italic pr-4">
                                {t('heroTitle2')}
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-800 dark:text-slate-300 font-light max-w-2xl mx-auto mb-16 drop-shadow-md">
                            {t('heroSubtitle')}
                        </p>
                    </motion.div>

                    {/*  SEARCH BAR */}
                    <motion.div
                        className="w-full max-w-3xl mx-auto relative group"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 rounded-[2rem] blur opacity-25 group-focus-within:opacity-50 transition duration-700"></div>
                        <div className="relative flex flex-col md:flex-row items-center bg-white/80 dark:bg-[#151E32]/85 backdrop-blur-2xl p-2 md:rounded-[2rem] rounded-3xl border border-white/60 dark:border-white/10 shadow-xl">
                            <input
                                type="text"
                                value={wish}
                                onChange={(e) => setWish(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') askGemma(); }}
                                placeholder={t('searchPlaceholder')}
                                className="w-full bg-transparent text-slate-900 dark:text-white px-8 py-5 md:py-4 outline-none placeholder-slate-500 dark:placeholder-slate-400 text-lg md:text-xl font-light"
                            />
                            <button
                                onClick={askGemma}
                                disabled={loading || !wish}
                                className="w-full md:w-auto bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 text-white dark:text-slate-900 px-10 py-5 md:py-4 rounded-full md:rounded-[1.5rem] font-bold transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>{t('discoverBtn')} <FiArrowRight className="w-5 h-5" /></>
                                )}
                            </button>
                        </div>
                    </motion.div>

                    {/*  TAGS */}
                    <motion.div
                        className="flex flex-wrap justify-center gap-4 mt-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        {quickIdeas.map((idea, index) => (
                            <button
                                key={index}
                                onClick={() => setWish(idea.text)}
                                className="px-6 py-3 rounded-full bg-white/60 dark:bg-[#151E32]/60 border border-white/60 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 text-slate-800 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all font-medium text-sm flex items-center gap-2 backdrop-blur-md shadow-sm"
                            >
                                <span className="text-teal-600 dark:text-teal-400">{idea.icon}</span>
                                {idea.text}
                            </button>
                        ))}
                    </motion.div>
                </div>
            </motion.div>

            {/*  RECOMMENDATIONS SECTION */}
            {recommendedHotels.length > 0 && (
                <div className="relative z-10 max-w-[1100px] mx-auto px-4 pb-40 pt-20">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 px-4">
                        <div>
                            <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 uppercase tracking-[0.2em] mb-2 font-mono">{t('curatedCollection')}</h3>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">{t('speciallyForYou')}</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 justify-items-center">
                        {recommendedHotels.map((hotel, idx) => (
                            <motion.div
                                key={hotel._id}
                                onClick={() => handleRecommendedClick(hotel)}
                                className="group cursor-pointer flex flex-col w-full max-w-[320px]"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: idx * 0.15, duration: 0.7 }}
                            >
                                <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden mb-6 shadow-lg border border-slate-200/60 dark:border-white/5">
                                    <img
                                        src={hotel.images?.exterior || hotel.image}
                                        alt={hotel.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"; }}
                                    />
                                    <div className="absolute top-5 left-5 bg-white/40 dark:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">
                                        {t(hotel.category)}
                                    </div>
                                    <div className="absolute top-5 right-5 bg-white/40 dark:bg-black/40 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-slate-900 dark:text-white">
                                        {hotel.rating}<FiStar className="ml-0.5 w-3 h-3 text-yellow-600 fill-current inline" />
                                    </div>
                                </div>
                                <div className="px-2">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm font-medium mb-3">
                                        <FiMapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                        {hotel.location}
                                    </div>
                                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white leading-snug mb-4 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                        {hotel.name}
                                    </h4>
                                    <div className="flex justify-between items-end border-t border-slate-200 dark:border-slate-800 pt-4 mt-auto">
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">{t('perNight')}</p>
                                            <p className="font-black text-xl text-slate-900 dark:text-white">{hotel.pricePerNight} {language === 'bg' ? 'лв.' : 'BGN'}</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-900 dark:text-white group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-slate-900 transition-all duration-300 shadow-sm">
                                            <FiArrowRight className="w-5 h-5 group-hover:-rotate-45 transition-transform duration-300" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;