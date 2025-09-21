require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:4000";

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());


//health-check
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const usersRouter = require("./routes/users");
app.use("/api/users", usersRouter);

//подтяжка
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
// *
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
