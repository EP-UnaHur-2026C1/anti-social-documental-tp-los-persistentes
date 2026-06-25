const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
