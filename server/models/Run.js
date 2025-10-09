// server/models/Run.js
const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

/** Реплика из диалога (AI ↔ user ↔ system) */
const TranscriptItemSchema = new Schema(
  {
    role: { type: String, enum: ["ai", "user", "system"], required: true },
    text: { type: String, required: true },
    t: { type: Number, default: 0 }, // сек с начала запуска
    meta: { type: Schema.Types.Mixed }, // доп. атрибуты (voiceId, hints и т.п.)
  },
  { _id: false },
);

/** Детальная оценка по каждому вопросу/подзадаче */
const EvaluationItemSchema = new Schema(
  {
    questionId: String, // ваш ID шага/вопроса (если есть)
    prompt: String, // текст вопроса/задания
    userAnswer: String, // краткий ответ или выдержка
    aiFeedback: String, // развернутый комментарий/объяснение
    correctness: { type: String, enum: ["correct", "partial", "incorrect"] },
    score: { type: Number, min: 0, max: 100 },
    topics: { type: [String], default: [] }, // напр. ["js", "react/hooks"]
    timeSec: Number, // время на ответ (если считаем)
    meta: Schema.Types.Mixed, // попытки, подсказки, ссылки на транскрипт и т.п.
  },
  { _id: false },
);

/** Сводка оценки запуска (для «карточки результата») */
const EvaluationSummarySchema = new Schema(
  {
    totalQuestions: Number,
    answered: Number,
    correct: Number,
    partial: Number,
    incorrect: Number,

    scoreOverall: { type: Number, min: 0, max: 100 }, // итоговый балл
    pass: Boolean, // прошел/не прошел по рубрике

    rubricVersion: String, // версия правил оценивания
    model: String, // профиль/модель, выполнившая оценку

    strengths: { type: [String], default: [] }, // сильные стороны (маркеры)
    weaknesses: { type: [String], default: [] }, // зоны роста (маркеры)
    recommendations: { type: [String], default: [] }, // actionable-советы

    // агрегаты по темам: { "js": {questions, correct, score}, ... }
    perTopic: {
      type: Map,
      of: new Schema(
        {
          questions: Number,
          correct: Number,
          score: { type: Number, min: 0, max: 100 },
        },
        { _id: false },
      ),
      default: undefined,
    },
  },
  { _id: false },
);

/** Основная модель запуска интервью */
const RunSchema = new Schema(
  {
    // связи
    sessionId: {
      type: Types.ObjectId,
      ref: "Session",
      required: true,
      index: true,
    },
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },

    // время
    startedAt: { type: Date, default: () => new Date(), index: true },
    finishedAt: { type: Date },
    durationSec: { type: Number }, // можно вычислять, но храним для удобства

    // диалог
    transcript: { type: [TranscriptItemSchema], default: [] },

    // любые рассчитанные численные/структурные метрики
    metrics: { type: Schema.Types.Mixed, default: {} },

    // итоговый результат (статус исхода)
    result: { type: String }, // "passed" | "failed" | "aborted" | "timeout" | ...

    // агрегаты в корне для быстрых фильтров/списков
    scoreOverall: { type: Number, min: 0, max: 100, index: true },
    passed: { type: Boolean, index: true },

    // подробная оценка для карточки результата
    evaluation: {
      summary: { type: EvaluationSummarySchema },
      items: { type: [EvaluationItemSchema], default: [] },
    },
  },
  { timestamps: true, minimize: false },
);

/** Индексы под частые выборки дашборда и аналитики */
RunSchema.index({ userId: 1, startedAt: -1 });
RunSchema.index({ sessionId: 1, createdAt: -1 });
RunSchema.index({ userId: 1, passed: 1, startedAt: -1 });
RunSchema.index({ userId: 1, scoreOverall: -1 });

/** Чистый JSON без __v */
RunSchema.set("toJSON", { versionKey: false });

module.exports = mongoose.models.Run || mongoose.model("Run", RunSchema);
