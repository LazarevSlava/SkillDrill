require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// ---- Config ----
const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = Number(process.env.PORT || 8080);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/skilldrill";

// доверять прокси в проде (корректные secure-cookies)
if (NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// ---- Core middleware ----
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// ---- Health-check ----
app.get("/health", (_req, res) => res.json({ ok: true, env: NODE_ENV }));

// ---- Routes ----
// НИЧЕГО не «глотаем»: если есть ошибка — увидим её сразу в логах
const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

// ---- Error handlers ----
// централизованный обработчик ошибок (если где-то next(err))
app.use((err, req, res, next) => {
  console.error("[error]", err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ ok: false, error: "server_error" });
});

// 404 в самом низу, после всех роутов
app.use((_req, res) => {
  res.status(404).send("Not Found");
});

// ---- Start ----
(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(
      "[mongo] connected:",
      // не светим пароль в логах, если он есть
      MONGO_URI.replace(/\/\/.*@/, "//***:***@"),
    );

    // (опционально) прогреть индексы пользователя
    try {
      const User = require("./models/User");
      await User.syncIndexes();
    } catch (e) {
      console.warn("[mongo] skip User.syncIndexes:", e?.message || e);
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[api] listening on 0.0.0.0:${PORT} (${NODE_ENV})`);
    });
  } catch (err) {
    console.error("[mongo] connection error:", err?.message || err);
    process.exit(1);
  }
})();

// страховка, чтобы контейнер не рестартовал молча
process.on("unhandledRejection", (e) => {
  console.error("unhandledRejection", e);
});
process.on("uncaughtException", (e) => {
  console.error("uncaughtException", e);
});
