const validator = require('express-validator');
const createError = require('http-errors');

const validationCallback = (req, res, next) => {
  const validationError = validator.validationResult(req);
  if(!validationError.isEmpty()) {
    next(createError(400, validationError.array()[0].msg));
    return;
  }
  next();
}

exports.validateAuthor = [validator
  .body('name')
  .notEmpty()
  .withMessage('Field name is required.')
  .isLength({ min: 2 })
  .withMessage('Field name can\'t be shorter legth than 2.')
  .trim()
  .escape(), 
  validationCallback];

exports.validatePostCreate = [validator
  .body('text')
  .notEmpty()
  .withMessage('Field text can\'t be empty.')
  .trim()
  .escape(),
  validationCallback];