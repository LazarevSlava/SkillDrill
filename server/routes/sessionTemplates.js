// server/routes/sessions.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const ctrl = require("../controllers/sessions");
const runsCtrl = require("../controllers/runs");

// приватные
router.use(auth);

router.post("/", ctrl.create);
router.get("/", ctrl.list);
router.get("/:id", ctrl.getOne);
router.patch("/:id", ctrl.update);

// СТАРТ прогона по сессии
router.post("/:id/start", runsCtrl.start);

module.exports = router;
