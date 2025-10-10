// server/controllers/dashboard.js
const Session = require("../models/Session");
const Run = require("../models/Run");
const SessionTemplate = require("../models/SessionTemplate");
const UserTemplate = require("../models/UserTemplate");

function getUserId(req) {
  return req.user?._id || req.userId || req.auth?.userId || null;
}

async function summary(req, res, next) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "unauthorized" });

    const now = new Date();

    // Параллельно собираем основные данные
    const [
      totalAll,
      totalDraft,
      totalInProgress,
      totalScheduled,
      totalCompleted,
      upcomingSessions,
      recentRunsRaw,
      globalTplCount,
      userTplCount,
    ] = await Promise.all([
      Session.countDocuments({ userId }),
      Session.countDocuments({ userId, status: "draft" }),
      Session.countDocuments({ userId, status: "in_progress" }),
      Session.countDocuments({ userId, status: "scheduled" }),
      Session.countDocuments({ userId, status: "completed" }),
      Session.find({ userId, status: "scheduled", scheduledAt: { $gte: now } })
        .sort({ scheduledAt: 1 })
        .limit(5)
        .lean(),
      Run.find({ userId }).sort({ startedAt: -1 }).limit(5).lean(),
      SessionTemplate.countDocuments({ isActive: true }),
      UserTemplate.countDocuments({ userId }),
    ]);

    // Дотянем названия сессий для recentRuns (без тяжёлых $lookup)
    const sessionIds = [
      ...new Set(recentRunsRaw.map((r) => String(r.sessionId))),
    ];
    const sessionsMap = sessionIds.length
      ? (
          await Session.find(
            { _id: { $in: sessionIds } },
            { snapshot: 1 },
          ).lean()
        ).reduce((acc, s) => {
          acc[String(s._id)] = s;
          return acc;
        }, {})
      : {};

    const recentRuns = recentRunsRaw.map((r) => ({
      _id: r._id,
      sessionId: r.sessionId,
      startedAt: r.startedAt,
      finishedAt: r.finishedAt,
      durationSec: r.durationSec,
      result: r.result,
      metrics: r.metrics || {},
      sessionTitle:
        sessionsMap[String(r.sessionId)]?.snapshot?.title || "Session",
      sessionTopics: sessionsMap[String(r.sessionId)]?.snapshot?.topics || [],
    }));

    res.json({
      totals: {
        all: totalAll,
        draft: totalDraft,
        in_progress: totalInProgress,
        scheduled: totalScheduled,
        completed: totalCompleted,
      },
      templates: {
        globalActive: globalTplCount,
        userOwned: userTplCount,
      },
      upcoming: upcomingSessions.map((s) => ({
        _id: s._id,
        scheduledAt: s.scheduledAt,
        status: s.status,
        title: s.snapshot?.title || "Session",
        durationMin: s.snapshot?.durationMin || null,
        topics: s.snapshot?.topics || [],
      })),
      recentRuns,
      now,
    });
  } catch (e) {
    next(e);
  }
}

module.exports = { summary };
