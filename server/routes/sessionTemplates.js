// server/routes/sessionTemplates.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const ctrl = require("../controllers/sessionTemplates"); // <= ВАЖНО: свой контроллер

router.use(auth);

// GET /session-templates -> { items: SessionTemplate[] }
router.get("/", ctrl.list);

// (опционально)
router.get("/:id", ctrl.getOne);

module.exports = router;
