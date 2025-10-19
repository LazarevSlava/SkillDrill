// server/utils/auth.js
const jwt = require("jsonwebtoken");

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "auth";

function createToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// ВАЖНО: пока мы на HTTP — secure=false, sameSite='lax'.
// Когда перейдём на HTTPS, включим secure=true и sameSite='none'.
function setAuthCookie(res, token) {
  const secure = process.env.COOKIE_SECURE === "true"; // в .env по умолчанию НЕ ставим
  const sameSite = secure ? "none" : "lax";

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure, // false на HTTP
    sameSite, // 'lax' на HTTP, 'none' на HTTPS
    path: "/", // не указывать domain для IP!
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 дней
  });
}

module.exports = { createToken, setAuthCookie, COOKIE_NAME };
