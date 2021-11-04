const errorHandler = (err, req, res, next) => {
  if(err.statusCode) {
    res.status(err.statusCode).json({ error: { statusCode: err.statusCode, message: err.message } });
    return;
  }
  console.log(err);
  res.status(500).json({ error: { statusCode: 500, message: 'Internal Server Error' } });
}

module.exports = errorHandler;