const router = require("express").Router();
const users = require("../controllers/users");
const { validate } = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validators/userSchemas");

router.post("/", validate(registerSchema), users.register);
router.post("/login", validate(loginSchema), users.login);

module.exports = router;
