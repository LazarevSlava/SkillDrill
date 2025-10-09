const mongoose = require("mongoose");
const { Schema } = mongoose;

const DIFFICULTY = ["easy", "medium", "hard"];
const POSITION = ["Junior", "Middle", "Senior"];

const SessionTemplateSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true }, // URL-идентификатор
    title: { type: String, required: true },
    description: { type: String },
    topics: { type: [String], default: [] }, // ["js","react"]
    durationMin: { type: Number, min: 5, max: 180, required: true },
    difficulty: { type: String, enum: DIFFICULTY, required: true },
    position: { type: String, enum: POSITION, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Частые выборки
SessionTemplateSchema.index({ difficulty: 1, durationMin: 1 });
SessionTemplateSchema.index({ position: 1, isActive: 1 });

// Удобный toJSON (без __v)
SessionTemplateSchema.set("toJSON", {
  versionKey: false,
});

module.exports =
  mongoose.models.SessionTemplate ||
  mongoose.model("SessionTemplate", SessionTemplateSchema);
