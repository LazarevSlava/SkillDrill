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
app.get("/health", (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({ ok: true, env: process.env.NODE_ENV || "development" });
});

// Более “умный” вариант с проверкой Mongo:
app.get("/ready", (_req, res) => {
  const state = mongoose.connection.readyState; // 1=connected
  if (state === 1) {
    return res.json({ ok: true, db: "connected" });
  }
  return res.status(503).json({ ok: false, db: "not_connected" });
});
// ---- Routes ----
const usersRouter = require("./routes/users");
const sessionTemplatesRouter = require("./routes/sessionTemplates");
const userTemplatesRouter = require("./routes/userTemplates");
const sessionsRouter = require("./routes/sessions");
const runsRouter = require("./routes/runs");
const dashboardRouter = require("./routes/dashboard");
app.use("/users", usersRouter);
app.use("/session-templates", sessionTemplatesRouter);
app.use("/user-templates", userTemplatesRouter);
app.use("/sessions", sessionsRouter);
app.use("/runs", runsRouter);
app.use("/dashboard", dashboardRouter);

// ---- Error handlers ----
// централизованный обработчик ошибок (если где-то next(err))
app.use((err, req, res, next) => {
  console.error("[error]", err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ ok: false, error: "server_error" });
});

app.use((_req, res) => {
  res.status(404).send("Not Found");
});

// ---- Start ----
(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(
      "[mongo] connected:",
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
