const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: String,
    checked: {
      type: Boolean,
      default: false,
    },
    checkedAt: Date,
    list: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = itemSchema;