const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/crypto");
const { createToken, setAuthCookie } = require("../utils/auth");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedName = name.trim().toLowerCase();
  const normalizedEmail = email.trim().toLowerCase();

  const [byName, byEmail] = await Promise.all([
    User.findOne({ name: normalizedName }),
    User.findOne({ email: normalizedEmail }),
  ]);
  if (byName) return res.status(409).json({ ok: false, error: "name_taken" });
  if (byEmail) return res.status(409).json({ ok: false, error: "email_taken" });

  const passwordHash = await hashPassword(password);
  const newUser = await User.create({
    name: normalizedName,
    email: normalizedEmail,
    passwordHash,
  });

  const token = createToken({ userId: newUser.id });
  setAuthCookie(res, token);

  return res.status(201).json({
    ok: true,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    },
  });
};

exports.login = async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findOne({ name: name.trim().toLowerCase() });
  if (!user)
    return res.status(401).json({ ok: false, error: "invalid_credentials" });

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok)
    return res.status(401).json({ ok: false, error: "invalid_credentials" });

  const token = createToken({ userId: user.id });
  setAuthCookie(res, token);

  return res.json({
    ok: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email || null,
      createdAt: user.createdAt,
    },
  });
};
