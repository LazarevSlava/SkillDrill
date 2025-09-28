require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = Number(process.env.PORT || 8080);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/skilldrill"; // fallback только если явно не передали

if (NODE_ENV === "production") {
  app.set("trust proxy", 1); // корректные secure-cookies за прокси
}

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// health-check
app.get("/health", (_req, res) => res.json({ ok: true, env: NODE_ENV }));

// пример роутов
try {
  const usersRouter = require("./routes/users");
  app.use("/users", usersRouter);
} catch {
  // если роутов пока нет — не падаем
}

// запуск
(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(
      "[mongo] connected:",
      MONGO_URI.replace(/\/\/.*@/, "//***:***@"),
    );

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[api] listening on 0.0.0.0:${PORT} (${NODE_ENV})`);
    });
  } catch (err) {
    console.error("[mongo] connection error:", err?.message || err);
    process.exit(1);
  }
})();
