const { Schema, model } = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const authorSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
});

authorSchema.plugin(uniqueValidator);

const Author = model('Author', authorSchema);

module.exports = Author;