const authorsService = require('../services/author.service');

exports.getAllAuthors = async (req, res, next) => {
  try {
    const authors = await authorsService.findAllAuthors();
    res.status(200).json(authors);
  } catch (err) {
    next(err);
  }
}

exports.createAuthor = async (req, res, next) => {
  try {
    const id = await authorsService.createNewAuthor(req);
    res.location(getCurrentUrl(req) + id);
    res.status(201).end();
  } catch (err) {
    next(err);
  }
}

exports.getAuthorById = async (req, res, next) => {
  try {
    const author = await authorsService.findAuthorById(req.params);
    res.status(200).json(author);
  } catch (err) {
    next(err);
  }
}

exports.patchAuthorById = async (req, res, next) => {
  try {
    const updatedAuthor = await authorsService.updateAuthorById(req.params, req);
    res.status(200).json(updatedAuthor);
  } catch (err) {
    next(err);
  }
}

exports.removeAuthorById = async (req, res, next) => {
  try {
    await authorsService.removeAuthorById(req.params);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

exports.getAllAuthorPost = async (req, res, next) => {
  try {
    const posts = await authorsService.findAllAuthorPost(req.params);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
}

exports.createPost  = async (req, res, next) => {
  try {
    const id = await authorsService.createNewPost(req.params, req);
    res.location(getCurrentUrl(req) + id)
    res.status(201).end();
  } catch (err) {
    next(err);
  }
}

exports.getPostById = async (req, res, next) => {
  try {
    const post = await authorsService.findPostById(req.params);
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
}

exports.removePostById = async (req, res, next) => {
  try {
    await authorsService.removePostById(req.params);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

function getCurrentUrl(req) {
  let endpoint = req.originalUrl;
  if (!endpoint.endsWith('/')) {
    endpoint = req.originalUrl + '/'
  }
  return req.protocol + '://' + req.get('host') + endpoint;
}