const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const itemSchema = require('./itemSchema');

const listSchema = new Schema({
    name: String,
    favorited: {
      type: Boolean,
      default: false,
    },
    items: [{
      type: Schema.Types.ObjectId,
      ref: 'Item',
    }],
  },
  {
    timestamps: true,
  },
);

module.exports = listSchema;