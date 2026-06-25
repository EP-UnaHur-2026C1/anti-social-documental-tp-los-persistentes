const mongoose = require('mongoose');

const postImageSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
  
  
);


const PostImage = mongoose.model('PostImage', postImageSchema);
module.exports = PostImage;
