// server/controllers/sessionTemplates.js
const SessionTemplate = require("../models/SessionTemplate");

/**
 * GET /session-templates
 * Параметры:
 *  - active: "1" | "0" (по умолчанию 1)
 *  - q: строка поиска по title/description/slug
 *  - difficulty, position
 */
async function list(req, res, next) {
  try {
    const { active = "1", q, difficulty, position } = req.query;

    const filter = {};
    if (active === "1") filter.isActive = true;
    if (active === "0") filter.isActive = false;

    if (difficulty) filter.difficulty = difficulty;
    if (position) filter.position = position;

    if (q) {
      filter.$or = [
        { title: new RegExp(q, "i") },
        { description: new RegExp(q, "i") },
        { slug: new RegExp(q, "i") },
      ];
    }

    const items = await SessionTemplate.find(filter)
      .sort({ difficulty: 1, durationMin: 1, title: 1 })
      .lean({ virtuals: true });

    res.json({ items, count: items.length });
  } catch (e) {
    next(e);
  }
}

module.exports = { list };
