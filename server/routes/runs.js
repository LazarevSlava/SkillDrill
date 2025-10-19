// server/routes/runs.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const ctrl = require("../controllers/runs");

router.use(auth);

// список моих ранов (опц. по sessionId)
router.get("/", ctrl.list);

// завершить ран
router.post("/:id/finish", ctrl.finish);

module.exports = router;
