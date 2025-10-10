// server/controllers/userTemplates.js
const UserTemplate = require("../models/UserTemplate");

const DIFFICULTY = ["easy", "medium", "hard"];
const POSITION = ["Junior", "Middle", "Senior"];

function getUserId(req) {
  return req.user?._id || req.userId || req.auth?.userId || null;
}

function pickTemplateBody(body = {}) {
  const payload = {
    title: body.title?.trim(),
    description: body.description?.trim(),
    topics: Array.isArray(body.topics) ? body.topics : [],
    durationMin: Number(body.durationMin),
    difficulty: body.difficulty,
    position: body.position,
    isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
  };
  return payload;
}

function validateTemplatePayload(p) {
  const errors = [];

  if (!p.title) errors.push("title is required");
  if (
    !Number.isFinite(p.durationMin) ||
    p.durationMin < 5 ||
    p.durationMin > 180
  ) {
    errors.push("durationMin must be a number between 5 and 180");
  }
  if (!DIFFICULTY.includes(p.difficulty)) {
    errors.push(`difficulty must be one of: ${DIFFICULTY.join(", ")}`);
  }
  if (!POSITION.includes(p.position)) {
    errors.push(`position must be one of: ${POSITION.join(", ")}`);
  }
  if (!Array.isArray(p.topics)) {
    errors.push("topics must be an array of strings");
  } else if (p.topics.some((t) => typeof t !== "string")) {
    errors.push("topics must contain only strings");
  }

  return errors;
}

/**
 * GET /user-templates
 * Параметры: q (поиск по title/description), active (1|0)
 */
async function list(req, res, next) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "unauthorized" });

    const { q, active } = req.query;
    const filter = { userId };

    if (active === "1") filter.isActive = true;
    if (active === "0") filter.isActive = false;

    if (q) {
      filter.$or = [
        { title: new RegExp(q, "i") },
        { description: new RegExp(q, "i") },
      ];
    }

    const items = await UserTemplate.find(filter)
      .sort({ updatedAt: -1 })
      .lean({ virtuals: true });

    res.json({ items, count: items.length });
  } catch (e) {
    next(e);
  }
}

/**
 * POST /user-templates
 * Body: { title, description?, topics[], durationMin, difficulty, position, isActive? }
 */
async function create(req, res, next) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "unauthorized" });

    const payload = pickTemplateBody(req.body);
    const errors = validateTemplatePayload(payload);
    if (errors.length)
      return res
        .status(400)
        .json({ error: "validation_error", details: errors });

    const doc = await UserTemplate.create({ ...payload, userId });
    res.status(201).json({ item: doc });
  } catch (e) {
    // дубль по уникальности (userId+title), если включили индекс
    if (e && e.code === 11000) {
      return res.status(409).json({
        error: "duplicate_title",
        message: "Template with this title already exists",
      });
    }
    next(e);
  }
}

/**
 * DELETE /user-templates/:id
 * Удалить только свой пресет
 */
async function remove(req, res, next) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "unauthorized" });

    const { id } = req.params;
    const result = await UserTemplate.deleteOne({ _id: id, userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "not_found_or_no_access" });
    }
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

module.exports = { list, create, remove };
