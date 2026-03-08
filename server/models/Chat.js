app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        // 1. Вземаме всички хотели от базата
        const hotels = await Hotel.find();
        const hotelList = hotels.map(h => `${h.name} в ${h.location} за ${h.pricePerNight}лв`).join(", ");

        // 2. Даваме на Gemma контекст: какво предлагаме и какво иска човекът
        const prompt = `Ти си туристически агент. Имаме следните хотели: ${hotelList}. 
        Потребителят иска: "${message}". 
        Избери ЕДИН най-подходящ хотел. 
        Върни отговора точно в този формат:
        ХОТЕЛ: [Името на хотела]
        ОБЯСНЕНИЕ: [Кратко обяснение в 1 изречение]`;

        const response = await ollama.chat({
            model: 'gemma:2b',
            messages: [{ role: 'user', content: prompt }],
        });

        res.json({ reply: response.message.content });
    } catch (error) { res.status(500).json({ error: "AI грешка" }); }
});