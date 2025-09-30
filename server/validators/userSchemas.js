const { z } = require("zod");

exports.registerSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

exports.loginSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    password: z.string().min(1),
  }),
});
