// server/middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { COOKIE_NAME } = require("../utils/auth");

module.exports = async function auth(req, res, next) {
  try {
    const cookieToken = req.cookies?.[COOKIE_NAME];
    const hdr = req.headers.authorization || "";
    const bearerToken = hdr.startsWith("Bearer ") ? hdr.slice(7) : undefined;

    const token = cookieToken || bearerToken;
    if (!token) {
      return res.status(401).json({ ok: false, error: "unauthorized" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload?.userId) {
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
