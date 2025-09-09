require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
//для доступа остальных к этим приколас
app.use(express.json());
//экспресс для структуры сайта самого

//health-check
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const usersRouter = require("./routes/users");
app.use("/api/users", usersRouter);

//подтяжка
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

async function start() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" Подключение к MongoDB успешно");

    app.listen(PORT, () => {
      console.log(` Сервер работает на порту ${PORT}`);
    });
  } catch (err) {
    console.error(" Ошибка подключения к БД:", err.message);
    process.exit(1);
  }
}

start();
