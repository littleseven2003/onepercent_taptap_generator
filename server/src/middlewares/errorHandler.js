function errorHandler(err, req, res, _next) {
  console.error('[Error]', err.message || err);

  const status = err.status || 500;
  const message = status === 500 ? '生成失败，请稍后重试' : err.message;

  res.status(status).json({ code: status, message });
}

module.exports = { errorHandler };
