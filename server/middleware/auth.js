const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function auth(req, res, next) {
  try {
    const token = req.cookies && req.cookies.auth;
    if (!token) {
      return res.status(401).json({ ok: false, error: "unauthorized" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload || !payload.userId) {
      return res.status(401).json({ ok: false, error: "unauthorized" });
    }

    const user = await User.findById(payload.userId).select("-passwordHash");
    if (!user) {
      return res.status(401).json({ ok: false, error: "unauthorized" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }
};
