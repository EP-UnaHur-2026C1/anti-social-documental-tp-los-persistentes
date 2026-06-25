const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostImage',
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
