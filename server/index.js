// server/index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // чтобы secure-cookie корректно работали за прокси
}

// ВАЖНО: origin = адрес фронта (Vite по умолчанию 5173)
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// health-check
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Роуты
const usersRouter = require("./routes/users");
// Делаем /users — под это уже настроен фронт
app.use("/users", usersRouter);

// Параметры окружения
const PORT = process.env.PORT || 4000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/skilldrill";

// Старт
async function start() {
  try {
    await mongoose.connect(MONGO_URI); // для Mongoose 7+ без лишних опций
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connect error:", err.message);
    process.exit(1);
  }
}

start();
