import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res
        .status(400)
        .json({ ok: false, error: "name_and_password_required" });
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

export default router;
