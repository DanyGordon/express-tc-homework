const { Schema, model } = require('mongoose');

const postSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  author: { 
    type: Schema.Types.ObjectId,
    ref: 'Author' 
  }
});

const Post = model('Post', postSchema);

module.exports = Post;