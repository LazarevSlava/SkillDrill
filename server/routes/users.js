const express = require("express");
const bcrypt = require("bcryptjs"); // надёжнее в alpine
const router = express.Router();

const User = require("../models/User");

// Если у тебя уже есть готовые хелперы — оставь этот импорт.
// Иначе закомментируй и используй простые локальные версии ниже.
// const { createToken, setAuthCookie } = require("../middleware/auth");

// --- Простейшие локальные хелперы JWT/cookie (на случай отсутствия middleware/auth) ---
const jwt = require("jsonwebtoken");
function createToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  // 7 дней достаточно для локалки; при желании вынеси в env
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}
function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("auth", token, {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd, // в проде за прокси
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
// -----------------------------------------------------------------------------

// Регистрация: POST /users
router.post("/", async (req, res) => {
  try {
    const { name, password, email } = req.body || {};

    if (!name || !password || !email) {
      return res.status(400).json({ ok: false, error: "validation_error" });
    }
    if (password.length < 6) {
      return res.status(400).json({ ok: false, error: "password_too_short" });
    }

    const normalizedName = String(name).trim().toLowerCase();
    const normalizedEmail = String(email).trim().toLowerCase();

    // примитивная проверка email (ранний ответ)
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(normalizedEmail)) {
      return res.status(400).json({ ok: false, error: "invalid_email" });
    }

    // проверка занятости
    const [existingByName, existingByEmail] = await Promise.all([
      User.findOne({ name: normalizedName }),
      User.findOne({ email: normalizedEmail }),
    ]);
    if (existingByName) {
      return res.status(409).json({ ok: false, error: "name_taken" });
    }
    if (existingByEmail) {
      return res.status(409).json({ ok: false, error: "email_taken" });
    }

    // создание
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      passwordHash,
    });

    // auth cookie + ответ
    const token = createToken({ userId: newUser._id.toString() });
    setAuthCookie(res, token);

    return res.status(201).json({
      ok: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err) {
    // дубликаты индекса (на всякий)
    if (err?.code === 11000) {
      if (String(err.message || "").includes("email")) {
        return res.status(409).json({ ok: false, error: "email_taken" });
      }
      if (String(err.message || "").includes("name")) {
        return res.status(409).json({ ok: false, error: "name_taken" });
      }
    }
    console.error("Ошибка при регистрации:", err);
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

// Логин: POST /users/login (по name + password)
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body || {};
    if (!name || !password) {
      return res
        .status(400)
        .json({ ok: false, error: "name_and_password_required" });
    }

    const normalizedName = String(name).trim().toLowerCase();
    const user = await User.findOne({ name: normalizedName });
    if (!user) {
      return res.status(401).json({ ok: false, error: "invalid_credentials" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ ok: false, error: "invalid_credentials" });
    }

    const token = createToken({ userId: user._id.toString() });
    setAuthCookie(res, token);

    return res.json({
      ok: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email || null,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Ошибка при логине:", err);
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

module.exports = router;
