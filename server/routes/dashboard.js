// server/routes/dashboard.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const ctrl = require("../controllers/dashboard");

router.use(auth);
router.get("/summary", ctrl.summary);

module.exports = router;
