const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Это позволит твоему сайту на GitHub общаться с сервером на Render

// ТВОЯ ССЫЛКА
const uri = "mongodb+srv://mishutushkin2012_db_user:123p9877@cluster0.fiz6ydc.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri)
    .then(() => console.log("Успешно подключено к MongoDB! 🔥"))
    .catch(err => console.error("Ошибка подключения:", err));

const User = mongoose.model('User', {
    username: String,
    balance: { type: Number, default: 1000 }
});

app.get('/get-balance/:name', async (req, res) => {
    try {
        let user = await User.findOne({ username: req.params.name });
        if (!user) user = await User.create({ username: req.params.name, balance: 1000 });
        res.json({ balance: user.balance });
    } catch (e) { res.status(500).send(e); }
});

app.post('/spin', async (req, res) => {
    try {
        const { username } = req.body;
        let user = await User.findOne({ username });
        if (!user || user.balance < 100) return res.json({ success: false, error: "Мало звезд" });

        user.balance -= 100;
        const rewards = [0, 20, 50, 150, 500, 1000];
        const winValue = rewards[Math.floor(Math.random() * rewards.length)];
        user.balance += winValue;
        await user.save();

        res.json({ success: true, winValue, newBalance: user.balance });
    } catch (e) { res.status(500).send(e); }
});

// ВАЖНО: Render сам назначает порт через переменную окружения
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});