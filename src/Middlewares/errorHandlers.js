const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;

  const message =
    err.message ||
    (statusCode === 404
      ? "Resource tidak ditemukan"
      : "Terjadi kesalahan pada server");

  console.error(`[ERROR ${statusCode}] ${message}`);

  return res.status(statusCode).json({
    statusCode,
    message,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
};

module.exports = errorHandler;
