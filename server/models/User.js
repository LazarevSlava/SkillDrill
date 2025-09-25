const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true, // автоматом в нижний регистр
      unique: true,
      minlength: 3,
      maxlength: 32,
      match: /^[a-z0-9_]+$/, // только латиница, цифры и "_"
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
