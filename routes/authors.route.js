const express = require('express');

const validator = require('../middlewares/validation.middleware');
const controller = require('../controllers/authors.controller');

const router = express.Router();

router.route('/')
  .get(controller.getAllAuthors)
  .post(validator.validateAuthor, controller.createAuthor);

router.route('/:authorId')
  .get(controller.getAuthorById)
  .patch(validator.validateAuthor, controller.patchAuthorById)
  .delete(controller.removeAuthorById);

router.route('/:authorId/posts')
  .get(controller.getAllAuthorPost)
  .post(validator.validatePostCreate, controller.createPost);

router.route('/:authorId/posts/:id')
  .get(controller.getPostById)
  .delete(controller.removePostById);

module.exports = router;