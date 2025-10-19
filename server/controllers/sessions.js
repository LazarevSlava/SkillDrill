// server/controllers/sessions.js
const mongoose = require("mongoose");
const { Types } = mongoose;
const Session = require("../models/Session");
const SessionTemplate = require("../models/SessionTemplate");
const UserTemplate = require("../models/UserTemplate");

const ALLOWED_STATUS = [
  "draft",
  "in_progress",
  "scheduled",
  "completed",
  "canceled",
];

function getUserId(req) {
  return req.user?._id || req.userId || req.auth?.userId || null;
}

function isObjectId(v) {
  return Types.ObjectId.isValid(String(v));
}

function toDateOrNull(v) {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(+d) ? null : d;
}

function snapshotFromTemplate(tpl) {
  if (!tpl) return null;
  return {
    title: tpl.title,
    description: tpl.description,
    topics: Array.isArray(tpl.topics) ? tpl.topics : [],
    durationMin: tpl.durationMin,
    difficulty: tpl.difficulty,
    position: tpl.position,
  };
}

/**
 * POST /sessions
 * Body:
 *  - templateId: string (ObjectId)
 *  - source?: "global" | "user"    (если не передан, попытаемся автоопределить)
 *  - scheduledAt?: ISO date        (если есть, статус станет "scheduled", иначе "draft")
 *  - meta?: object                 (доп.настройки)
 */
async function create(req, res, next) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "unauthorized" });

    const { templateId, source: sourceRaw, scheduledAt, meta } = req.body || {};
    if (!isObjectId(templateId)) {
      return res
        .status(400)
        .json({ error: "validation_error", details: ["invalid templateId"] });
    }

    let source =
      sourceRaw === "global" || sourceRaw === "user" ? sourceRaw : null;

    // 1) достаём шаблон (по source либо автоопределение)
    let tpl = null;

    if (source === "global") {
      tpl = await SessionTemplate.findById(templateId).lean();
      if (!tpl || tpl.isActive === false) {
        return res
          .status(404)
          .json({ error: "template_not_found_or_inactive" });
      }
    } else if (source === "user") {
      tpl = await UserTemplate.findOne({ _id: templateId, userId }).lean();
      if (!tpl || tpl.isActive === false) {
        return res
          .status(404)
          .json({ error: "user_template_not_found_or_inactive" });
      }
    } else {
      // автоопределение
      tpl = await SessionTemplate.findById(templateId).lean();
      if (tpl && tpl.isActive !== false) {
        source = "global";
      } else {
        tpl = await UserTemplate.findOne({ _id: templateId, userId }).lean();
        if (tpl && tpl.isActive !== false) {
          source = "user";
        }
      }
      if (!source || !tpl) {
        return res.status(404).json({ error: "template_not_found" });
      }
    }

    // 2) формируем snapshot и статус
    const snapshot = snapshotFromTemplate(tpl);
    const scheduled = toDateOrNull(scheduledAt);
    const status = scheduled ? "scheduled" : "draft";

    // 3) создаём документ
    const doc = await Session.create({
      userId,
      source,
      templateId,
      snapshot,
      status,
      scheduledAt: scheduled,
      meta: meta && typeof meta === "object" ? meta : {},
    });

    res.status(201).json({ item: doc });
  } catch (e) {
    next(e);
  }
}

/**
 * GET /sessions
 * Query:
 *  - status?: draft|in_progress|scheduled|completed|canceled
 *  - q?: поиск по snapshot.title/description/topics
 *  - limit?: number (<=50)
 *  - skip?: number
 */
async function list(req, res, next) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "unauthorized" });

    const { status, q } = req.query;
    let { limit = "20", skip = "0" } = req.query;

    limit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 50);
    skip = Math.max(parseInt(skip, 10) || 0, 0);

    const filter = { userId };
    if (status) {
      if (!ALLOWED_STATUS.includes(status)) {
        return res
          .status(400)
          .json({ error: "validation_error", details: ["invalid status"] });
      }
      filter.status = status;
    }
    if (q) {
      const re = new RegExp(q, "i");
      filter.$or = [
        { "snapshot.title": re },
        { "snapshot.description": re },
        { "snapshot.topics": re },
      ];
    }

    const [items, total] = await Promise.all([
      Session.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean({ virtuals: true }),
      Session.countDocuments(filter),
    ]);

    res.json({ items, count: items.length, total });
  } catch (e) {
    next(e);
  }
}

/**
 * GET /sessions/:id
 */
async function getOne(req, res, next) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "unauthorized" });

    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ error: "invalid_id" });

    const item = await Session.findOne({ _id: id, userId }).lean({
      virtuals: true,
    });
    if (!item) return res.status(404).json({ error: "not_found" });

    res.json({ item });
  } catch (e) {
    next(e);
  }
}

/**
 * PATCH /sessions/:id
 * Body:
 *  - status?: one of ALLOWED_STATUS
 *  - scheduledAt?: ISO date | null
 *  - meta?: object (мердж ограниченно)
 */
async function update(req, res, next) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "unauthorized" });

    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ error: "invalid_id" });

    const patch = {};
    const { status, scheduledAt, meta } = req.body || {};

    if (status) {
      if (!ALLOWED_STATUS.includes(status)) {
        return res
          .status(400)
          .json({ error: "validation_error", details: ["invalid status"] });
      }
      patch.status = status;
    }

    if (scheduledAt !== undefined) {
      patch.scheduledAt = scheduledAt ? toDateOrNull(scheduledAt) : null;
    }

    if (meta && typeof meta === "object") {
      // ограниченный мердж meta (без глубокого merge для простоты)
      patch.meta = meta;
    }

    const item = await Session.findOneAndUpdate(
      { _id: id, userId },
      { $set: patch },
      { new: true },
    ).lean({ virtuals: true });

    if (!item) return res.status(404).json({ error: "not_found_or_no_access" });

    res.json({ item });
  } catch (e) {
    next(e);
  }
}

module.exports = { create, list, getOne, update };
