const express = require('express');
const router = express.Router();
const listSchema = require('../schemas/listSchema');
const mongoose = require('mongoose');

const List = mongoose.model('List', listSchema);

const publicSchema = {
  name: 'String',
  favorited: 'Boolean',
  favoritedAt: {
    type: 'Date',
    optional: true, 
  },
};

const incorrectSchemaResponse = {
  success: false,
  message: 'Must follow schema requirements',
  listSchema: publicSchema,
};

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
    if (req.body.name && req.body.favorited) {
      List.create({
        name: req.body.name,
        favorited: req.body.favorited,
        favoritedAt: req.body.favoritedAt,
      }, (err, list) => {
        if (err) {
          res.send(err);
        } else {
          res.json(list);
        }
      });
    } else {
      res.json(incorrectSchemaResponse);
    }
  });

router.route('/:listId')
  .get((req, res) => {
    List.findById(req.params.listId, (err, list) => {
      if (err) {
        res.send(err);
      } else {
        res.json(list);
      }
    });
  })
  .put((req, res) => {
    List.findById(req.params.listId, (err, list) => {
      if (err) {
        res.send(err);
      } else if (req.body.name !== void 0 && req.body.favorited !== void 0) {
        list.name = req.body.name;
        list.favorited = req.body.favorited;
        list.favoritedAt = req.body.favoritedAt;
        list.save((err, updatedList) => {
          if (err) {
            res.send(err);
          } else {
            res.json(updatedList);
          }
        });
      } else {
        res.json(incorrectSchemaResponse);
      }
    });
  })
  .delete((req, res) => {
    List.deleteOne({ _id: req.params.listId }, (err) => {
      if (err) {
        res.send(err);
      } else {
        res.json({
          success: true,
          message: 'List successfully deleted',
        });
      }
    });
  });

module.exports = router;