const createError = require('http-errors');
const Author = require('../models/author.model');
const Post = require('../models/post.model');

exports.getAllAuthors = async (req, res, next) => {
  try {
    const authors = await Author.find({});
		res.status(200).json(authors);
  } catch (err) {
    next(err);
  }
}

exports.createAuthor = async (req, res, next) => {
  try {
    await Author.init();
    const createdAuthor = new Author(req.body);
    await createdAuthor.save();
		res.location(getCurrentUrl(req) + createdAuthor._id);
		res.status(201).end();
  } catch (err) {
    if(err.name === 'ValidationError') {
      if(err.errors.name.kind === 'unique') {
        next(createError(409, err.errors.name.message));
        return;
      }
      next(createError(400, err.errors.name.message));
      return;
    }
    next(err);
  }
}

exports.getAuthorById = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.authorId);
		if (author) {
			res.status(200).json(author);
		} else {
      next(createError(404, `Author with id ${req.params.authorId} not found!`));
		}
  } catch (err) {
    next(err);
  }
}

exports.patchAuthorById = async (req, res, next) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.authorId, 
      { $set: req.body }, { new: true, runValidators: true, context: 'query' });
    
    if (updatedAuthor) {
			res.status(200).json(updatedAuthor);
		} else {
			next(createError(404, `Author with id ${req.params.authorId} not found!`));
		}
  } catch (err) {
    if(err.name === 'ValidationError') {
      if(err.errors.name.kind === 'unique') {
        next(createError(409, err.errors.name.message));
        return;
      }
      next(createError(400, err.errors.name.message));
      return;
    }
    next(err);
  }
}

exports.removeAuthorById = async (req, res, next) => {
  try {
    await Author.findByIdAndRemove(req.params.authorId);
		res.status(204).end();
  } catch (err) {
    next(err);
  }
}

exports.getAllAuthorPost = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.authorId).populate('posts');
		if (author) {
			res.status(200).json(author.posts);
		} else {
			next(createError(404, `Author with id ${req.params.authorId} not found!`));
		}
  } catch (err) {
    next(err);
  }
}

exports.createPost  = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.authorId).populate('posts');
		if (author) {
			req.body.author = req.params.authorId;
			const post = await Post.create(req.body);
			author.posts.push(post);
			await author.save({ validateModifiedOnly: true });
			res.location(getCurrentUrl(req) + post._id)
			res.status(201).end();
		} else {
			next(createError(404, `Author with id ${req.params.authorId} not found!`));
		}
  } catch (err) {
    next(err);
  }
}

exports.getPostById = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.authorId);
		if (author) {
      const post = await Post.findById(req.params.id).populate('author');
      if (!post || post.author._id.toString() !== author._id.toString()) {
        next(createError(404, `Author with id ${req.params.authorId} has not post ${req.params.id}!`));
      } else {
        res.status(200).json(post);
      }
    } else {
      next(createError(404, `Author with id ${req.params.authorId} not found!`));
    }
  } catch (err) {
    next(err);
  }
}

exports.removePostById = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.authorId);
		if (author) {
      const post = await Post.findById(req.params.id);
      if (post && post.author._id.toString() === author._id.toString()) {
        const indx = author.posts.findIndex(post => post._id.toString() === req.params.id);
        author.posts = [...author.posts.slice(0, indx), ...author.posts.slice(indx + 1)]
        post.delete();
        await author.save({ validateModifiedOnly: true });
      }
      res.status(204).end();
    } else {
      next(createError(404, `Author with id ${req.params.authorId} not found!`));
    }
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