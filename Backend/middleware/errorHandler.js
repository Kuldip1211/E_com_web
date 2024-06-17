// middleware/errorHandler.js
function notFound(req, res, next) {
  res.status(404).send(`Not Found: ${req.originalUrl}`);
}

function errorHandler(err, req, res, next) {
  res.status(500).send({ message: err.message });
}

module.exports = { notFound , errorHandler };