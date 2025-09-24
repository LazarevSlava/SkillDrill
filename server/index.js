import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

import usersRouter from "./routes/users.js";
app.use("/api/users", usersRouter);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Подключение к MongoDB успешно");

    app.listen(PORT, () => {
      console.log(`🚀 Сервер работает на порту ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Ошибка подключения к БД:", err.message);
    process.exit(1);
  }
}

start();
