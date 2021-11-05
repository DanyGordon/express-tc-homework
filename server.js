const express = require('express');
const { connect } = require('mongoose');
const createError = require('http-errors');

const { url, options } = require('./config/db.config');

const logger = require('./middlewares/logger.middleware');
const errorHandler = require('./middlewares/error-handler.middleware');

const authorsRouter = require('./routes/authors.route');

const app = express();
const PORT = 3000;

connect(url, options).then(() => {
  console.log('Successfully connected to database');
}).catch((err) => {
  console.log(err);
});

app.use(express.json());

app.use(logger);

app.use('/authors', authorsRouter);

app.use((req, res, next) => {
  next(createError(404, `[${req.method}]: ${req.originalUrl} not found.`));
})

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started and listening port ${PORT}`);
});