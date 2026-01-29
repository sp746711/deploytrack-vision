/**
 * Global error handler. Catches all errors (including Mongoose validation,
 * async route errors). Never crashes the process; returns normalized JSON.
 */
export default function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors || {}).map((e) => e.message).filter(Boolean);
    return res.status(400).json({
      success: false,
      message: messages.length ? messages.join("; ") : "Validation failed",
    });
  }

  // Mongoose duplicate key (e.g. unique index)
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A record with this value already exists",
    });
  }

  // Mongoose CastError (invalid ObjectId etc.)
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid ID or parameter" });
  }

  // JWT errors are handled in auth middleware; fallback
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }

  const status = err.statusCode || err.status || 500;
  const message = err.message && String(err.message).trim() ? err.message : "Internal server error";
  return res.status(status).json({ success: false, message });
}
