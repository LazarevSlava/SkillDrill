// server/controllers/sessionTemplates.js
const SessionTemplate = require("../models/SessionTemplate");

exports.list = async (req, res, next) => {
  try {
    // Если шаблоны глобальные для всех — без фильтра по userId
    const items = await SessionTemplate.find({}).lean();
    res.json({ items });
  } catch (e) {
    next(e);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await SessionTemplate.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ ok: false, error: "not_found" });
    res.json({ item });
  } catch (e) {
    next(e);
  }
};
