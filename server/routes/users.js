// server/routes/users.js
require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

const COOKIE_NAME = "token";
const TOKEN_EXPIRES_SECONDS = 7 * 24 * 60 * 60; // 7 дней

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TOKEN_EXPIRES_SECONDS * 1000,
  });
}

function createToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: `${TOKEN_EXPIRES_SECONDS}s`,
  });
}

// Регистрация
router.post("/", async (req, res) => {
  try {
    const { name, password } = req.body || {};

    if (!name || !password) {
      return res.status(400).json({ ok: false, error: "validation_error" });
    }

    if (password.length < 6) {
      return res.status(400).json({ ok: false, error: "password_too_short" });
    }

    // нормализуем имя
    const normalizedName = name.trim().toLowerCase();

    const existingUser = await User.findOne({ name: normalizedName });
    if (existingUser) {
      return res.status(409).json({ ok: false, error: "name_taken" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name: normalizedName, passwordHash });

    const token = createToken({ userId: newUser._id.toString() });
    setAuthCookie(res, token);

    return res.status(201).json({
      ok: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err) {
    console.error("Ошибка при регистрации:", err);
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

// Логин
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body || {};

    if (!name || !password) {
      return res
        .status(400)
        .json({ ok: false, error: "name_and_password_required" });
    }

    // нормализуем имя
    const normalizedName = name.trim().toLowerCase();

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
      user: { id: user._id, name: user.name, createdAt: user.createdAt },
    });
  } catch (err) {
    console.error("Ошибка при логине:", err);
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

// Логаут
router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.json({ ok: true });
});

// Текущий пользователь
router.get("/me", auth, (req, res) => {
  return res.json({ ok: true, user: req.user });
});

module.exports = router;
