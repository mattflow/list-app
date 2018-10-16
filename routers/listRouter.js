const express = require('express');
const router = express.Router();
const listSchema = require('../schemas/listSchema');
const mongoose = require('mongoose');

const List = mongoose.model('List', listSchema);

router.prefix = 'lists';

router.route('/')
  .get((req, res) => {
    List.find({}, (err, docs) => {
      if (err) {
        res.send(err);
      } else {
        res.json(docs);
      }
    });
  })
  .post((req, res) => {
    console.log(req.body);
    if (req.body.name) {
      List.create({ name: req.body.name }, (err, list) => {
        if (err) {
          res.send(err);
        } else {
          res.json(list);
        }
      });
    } else {
      res.json({
        message: 'Name must be included',
        success: false,
      });
    }
  });

module.exports = router;