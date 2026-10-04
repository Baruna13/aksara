export function notFound(_req, res) {
  res.status(404).json({ error: { message: 'Endpoint tidak ditemukan' } });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({
    error: {
      message: status === 500 ? 'Terjadi kesalahan di server' : err.message,
      code: err.code,
    },
  });
}
