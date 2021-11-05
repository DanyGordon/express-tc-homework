const createError = require('http-errors');
const Author = require('../models/author.model');
const Post = require('../models/post.model');

exports.findAllAuthors = async () => {
  try {
    return await Author.find({});
  } catch (err) {
    throw err;
  }
}

exports.createNewAuthor = async ({ body }) => {
  try {
    await Author.init();
    const createdAuthor = new Author(body);
    await createdAuthor.save();
    return createdAuthor._id;
  } catch (err) {
    if(err.name === 'ValidationError') {
      if(err.errors.name.kind === 'unique') {
        throw createError(409, err.errors.name.message);
      }
      throw createError(400, err.errors.name.message);
    }
    throw err;
  }
}

exports.findAuthorById = async ({ authorId }) => {
  try {
    const author = await Author.findById(authorId);
    if (author) {
      return author;
    } else {
      throw createError(404, `Author with id ${authorId} not found!`);
    }
  } catch (err) {
    throw err;
  }
}

exports.updateAuthorById = async ({ authorId }, { body }) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(authorId, 
      { $set: body }, { new: true, runValidators: true, context: 'query' });
    
    if (updatedAuthor) {
      return updatedAuthor;
    } else {
      throw createError(404, `Author with id ${authorId} not found!`);
    }
  } catch (err) {
    if(err.name === 'ValidationError') {
      if(err.errors.name.kind === 'unique') {
        throw createError(409, err.errors.name.message);
      }
      throw createError(400, err.errors.name.message);
    }
    throw err;
  }
}

exports.removeAuthorById = async ({ authorId }) => {
  try {
    await Author.findByIdAndRemove(authorId);
    return true;
  } catch (err) {
    throw err;
  }
}

exports.findAllAuthorPost = async ({ authorId }) => {
  try {
    const author = await Author.findById(authorId).populate('posts');
    if (author) {
      return author.posts;
    } else {
      throw createError(404, `Author with id ${authorId} not found!`);
    }
  } catch (err) {
    throw err;
  }
}

exports.createNewPost = async ({ authorId }, { body }) => {
  try {
    const author = await Author.findById(authorId).populate('posts');
    if (author) {
      body.author = authorId;
      const post = await Post.create(body);
      author.posts.push(post);
      await author.save({ validateModifiedOnly: true });
      return post._id;
    } else {
      throw createError(404, `Author with id ${authorId} not found!`);
    }
  } catch (err) {
    throw err;
  }
}

exports.findPostById = async ({ authorId, postId }) => {
  try {
    const author = await Author.findById(authorId);
    if (author) {
      const post = await Post.findById(postId).populate('author');
      if (!post || post.author._id.toString() !== author._id.toString()) {
        throw createError(404, `Author with id ${authorId} has not post ${postId}!`);
      } else {
        return post;
      }
    } else {
      throw createError(404, `Author with id ${authorId} not found!`);
    }
  } catch (err) {
    throw err;
  }
}

exports.removePostById = async ({ authorId, postId }) => {
  try {
    const author = await Author.findById(authorId);
    if (author) {
      const post = await Post.findById(postId);
      if (post && post.author._id.toString() === author._id.toString()) {
        const indx = author.posts.findIndex(post => post._id.toString() === postId);
        author.posts = [...author.posts.slice(0, indx), ...author.posts.slice(indx + 1)]
        post.delete();
        await author.save({ validateModifiedOnly: true });
      }
      return true;
    } else {
      throw createError(404, `Author with id ${authorId} not found!`);
    }
  } catch (err) {
    throw err;
  }
}