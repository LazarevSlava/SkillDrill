const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const SESSION_STATUS = [
  "draft",
  "in_progress",
  "scheduled",
  "completed",
  "canceled",
];

const DIFFICULTY = ["easy", "medium", "hard"];
const POSITION = ["Junior", "Middle", "Senior"];

const SnapshotSchema = new Schema(
  {
    // фиксируем параметры шаблона на момент создания
    title: String,
    description: String,
    topics: { type: [String], default: [] },
    durationMin: Number,
    difficulty: { type: String, enum: DIFFICULTY },
    position: { type: String, enum: POSITION },
  },
  { _id: false },
);

const SessionSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },

    // откуда взяли шаблон: глобальный или пользовательский
    source: { type: String, enum: ["global", "user"], required: true },

    // ссылка на sessionTemplates._id или userTemplates._id
    templateId: { type: Types.ObjectId, required: true, index: true },

    snapshot: { type: SnapshotSchema, required: true },

    status: {
      type: String,
      enum: SESSION_STATUS,
      default: "draft",
      index: true,
    },

    scheduledAt: { type: Date, index: true }, // для планировщика

    // дополнительные настройки (вежливость, акценты и т.п.)
    meta: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true, minimize: false },
);

// Частые дашборд-запросы: найти сессии пользователя по статусу
SessionSchema.index({ userId: 1, status: 1, createdAt: -1 });

SessionSchema.set("toJSON", { versionKey: false });

module.exports =
  mongoose.models.Session || mongoose.model("Session", SessionSchema);
