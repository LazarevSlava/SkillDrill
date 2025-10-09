const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const DIFFICULTY = ["easy", "medium", "hard"];
const POSITION = ["Junior", "Middle", "Senior"];

const UserTemplateSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    topics: { type: [String], default: [] },
    durationMin: { type: Number, min: 5, max: 180, required: true },
    difficulty: { type: String, enum: DIFFICULTY, required: true },
    position: { type: String, enum: POSITION, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Опционально запретить дубликаты названий у одного пользователя:
UserTemplateSchema.index({ userId: 1, title: 1 }, { unique: true });

// Быстрые выборки по фильтрам
UserTemplateSchema.index({ userId: 1, isActive: 1, difficulty: 1 });

UserTemplateSchema.set("toJSON", { versionKey: false });

module.exports =
  mongoose.models.UserTemplate ||
  mongoose.model("UserTemplate", UserTemplateSchema);
