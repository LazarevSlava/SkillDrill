const bcrypt = require("bcryptjs");
exports.hashPassword = (p) => bcrypt.hash(p, 10);
exports.comparePassword = (p, hash) => bcrypt.compare(p, hash);
