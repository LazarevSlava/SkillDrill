const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      minlength: 3,
      maxlength: 32,
      match: /^[a-z0-9_]+$/,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      // ВАЖНО: делаем "required" только на уровне логики регистрации (ниже в роуте),
      // чтобы не падать из-за старых пользователей без email.
      // Здесь оставим без required, а уникальность обеспечим через partial index:
      // unique: true  // <- НЕ ставим прямо тут
      // match — простая проверка формата
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// Уникальный индекс только для документов, где email — строка.
// Это позволит не ломать существующие записи без email.
userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: "string" } } },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
