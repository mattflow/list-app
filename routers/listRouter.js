const express = require('express');
const router = express.Router();
const listSchema = require('../schemas/listSchema');
const mongoose = require('mongoose');

const List = mongoose.model('List', listSchema);

router.get('/', (req, res) => {
  List.find({}, (err, docs) => {
    if (err) {
      res.send(err);
    } else {
      res.json(docs);
    }
  });
});

module.exports = router;