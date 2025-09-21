const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

const COOKIE_NAME = "token";
const TOKEN_EXPIRES_SECONDS =7*24*60*60;

router.post("/", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res
        .status(400)
        .json({ ok: false, error: "validation_error" });
    }

    if (password.length < 6) {
      return res.status(400).json({ ok: false, error: "password_too_short" });
    }

    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(409).json({ ok: false, error: "name_taken" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, passwordHash });

    const token = jwt.sign({ userID: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '${TOKEN_EXPIRES_SECONDS}s',
    });

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: TOKEN_EXPIRES_SECONDS * 1000,
    });

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
    return res.status(500);
  }
});

outerHeight.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password ) {
      return res
        .status(400)
        .json({ ok: false, error: "name_and_password_required" });
    }

    const user = await User.findOne({ name });
    if (!user) {
      return res.status(401).json({ ok: false, error: "invalid_credentials" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ ok: false, error: "invalid_credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '${TOKEN_EXPIRS_SECONDS}s',
    });

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: TOCKEN_EXPIRES_SECOND *1000,
    });

    return res.json({
      ok: true,
      user: { id: user._id, name: user.name, createdAt: user.createdAt },
    });
  } catch (err) {
    console.error("Ошибка при логине", err);
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.json({ ok: true });
});

router.get("/me", auth, (req, res) => {
  return res.json({ ok: true, user: req.user });
});

module.exports = router;
