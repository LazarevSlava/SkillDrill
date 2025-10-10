// server/controllers/runs.js
const mongoose = require("mongoose");
const { Types } = mongoose;
const Session = require("../models/Session");
const Run = require("../models/Run");

function getUserId(req) {
  return req.user?._id || req.userId || req.auth?.userId || null;
}
function isObjectId(v) {
  return Types.ObjectId.isValid(String(v));
}
function now() {
  return new Date();
}

/**
 * POST /sessions/:id/start
 * Стартует новый прогон для указанной сессии.
 * Условия:
 *  - сессия принадлежит пользователю
 *  - статус сессии: draft|scheduled (иначе 409)
 *  - нет уже открытого рана (finishedAt == null) по этой сессии (иначе 409)
 */
async function start(req, res, next) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "unauthorized" });

    const { id } = req.params; // sessionId
    if (!isObjectId(id))
      return res.status(400).json({ error: "invalid_session_id" });

    // 1) существует ли сессия и принадлежит ли она пользователю
    const session = await Session.findOne({ _id: id, userId }).lean();
    if (!session) return res.status(404).json({ error: "session_not_found" });

    // 2) не запущен ли уже открытый ран по этой сессии
    const openRun = await Run.findOne({
      sessionId: id,
      userId,
      finishedAt: null,
    }).lean();
    if (openRun)
      return res
        .status(409)
        .json({ error: "run_already_in_progress", runId: openRun._id });

    // 3) можно ли перевести сессию в in_progress
    if (!["draft", "scheduled"].includes(session.status)) {
      return res
        .status(409)
        .json({ error: "invalid_session_status", status: session.status });
    }

    // 4) сначала переключим статус сессии (чтобы не стартовали дважды гонку)
    const updated = await Session.findOneAndUpdate(
      { _id: id, userId, status: { $in: ["draft", "scheduled"] } },
      { $set: { status: "in_progress", updatedAt: now() } },
      { new: true },
    ).lean();

    if (!updated) {
      return res.status(409).json({ error: "session_status_conflict" });
    }

    // 5) создаём ран
    const run = await Run.create({
      sessionId: id,
      userId,
      startedAt: now(),
      finishedAt: null,
      transcript: [],
      metrics: {},
      result: undefined,
    });

    return res.status(201).json({ item: run, session: updated });
  } catch (e) {
    next(e);
  }
}

/**
 * POST /runs/:id/finish
 * Завершает ран, считает durationSec, ставит статус сессии в completed,
 * если не осталось других открытых ранов по этой сессии.
 * Body (необязательно):
 *  - result?: string ("passed" | "failed" | "aborted" | ...)
 *  - metrics?: object
 *  - transcriptAppend?: [{ role, text, t?, meta? }, ...]  // будет дописано в конец
 */
async function finish(req, res, next) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "unauthorized" });

    const { id } = req.params; // runId
    if (!isObjectId(id))
      return res.status(400).json({ error: "invalid_run_id" });

    const body = req.body || {};
    const finishedAt = now();

    // 1) найдём ран, проверим принадлежность и что он ещё не завершён
    const run = await Run.findOne({ _id: id, userId }).lean();
    if (!run) return res.status(404).json({ error: "run_not_found" });
    if (run.finishedAt)
      return res.status(409).json({ error: "run_already_finished" });

    // 2) подготовим апдейт
    const update = {
      finishedAt,
      durationSec: run.startedAt
        ? Math.max(0, Math.round((finishedAt - new Date(run.startedAt)) / 1000))
        : undefined,
    };

    if (body.result && typeof body.result === "string")
      update.result = body.result;
    if (body.metrics && typeof body.metrics === "object")
      update.metrics = body.metrics;

    // дописать в транскрипт
    if (Array.isArray(body.transcriptAppend) && body.transcriptAppend.length) {
      update.$push = { transcript: { $each: body.transcriptAppend } };
    }

    // 3) применим апдейт
    const updatedRun = await Run.findOneAndUpdate(
      { _id: id, userId, finishedAt: null },
      update,
      { new: true },
    ).lean();

    if (!updatedRun) {
      return res.status(409).json({ error: "run_finish_conflict" });
    }

    // 4) если больше нет открытых ранов по этой сессии — закрываем сессию
    const sessionId = updatedRun.sessionId;
    const otherOpen = await Run.exists({ sessionId, userId, finishedAt: null });

    let updatedSession = null;
    if (!otherOpen) {
      updatedSession = await Session.findOneAndUpdate(
        {
          _id: sessionId,
          userId,
          status: { $in: ["in_progress", "scheduled", "draft"] },
        },
        { $set: { status: "completed", updatedAt: now() } },
        { new: true },
      ).lean();
    }

    return res.json({ item: updatedRun, session: updatedSession });
  } catch (e) {
    next(e);
  }
}

/**
 * GET /runs?sessionId=...&limit=20&skip=0
 * Возвращает раны пользователя (опционально — только по конкретной сессии)
 */
async function list(req, res, next) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "unauthorized" });

    const { sessionId } = req.query;
    let { limit = "20", skip = "0" } = req.query;
    limit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 50);
    skip = Math.max(parseInt(skip, 10) || 0, 0);

    const filter = { userId };
    if (sessionId) {
      if (!isObjectId(sessionId))
        return res.status(400).json({ error: "invalid_session_id" });
      filter.sessionId = sessionId;
    }

    const [items, total] = await Promise.all([
      Run.find(filter)
        .sort({ startedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean({ virtuals: true }),
      Run.countDocuments(filter),
    ]);

    res.json({ items, count: items.length, total });
  } catch (e) {
    next(e);
  }
}

module.exports = { start, finish, list };
