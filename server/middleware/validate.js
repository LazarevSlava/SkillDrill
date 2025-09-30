exports.validate = (schema) => (req, res, next) => {
  try {
    schema.parse({ body: req.body, params: req.params, query: req.query });
    next();
  } catch {
    return res.status(400).json({ ok: false, error: "validation_error" });
  }
};
