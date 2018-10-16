const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const itemSchema = require('./itemSchema');

const listSchema = new Schema({
  name: String,
  favorited: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  archived: {
    type: Boolean,
    default: false,
  },
  items: [itemSchema],
});

module.exports = listSchema;