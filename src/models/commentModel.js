const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    texto: {
      type: String,
      required: true,
      trim: true,
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

commentSchema.virtual('visibilidad').get(function () {
  const mesesConfigurable = parseInt(process.env.COMMENT_VISIBILITY_MONTHS || 6);
  const ahora = new Date();
  const diferenciaMeses = (ahora.getFullYear() - this.createdAt.getFullYear()) * 12 +
    (ahora.getMonth() - this.createdAt.getMonth());
  return diferenciaMeses < mesesConfigurable && this.visible;
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
