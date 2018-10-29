const express = require('express');
const router = express.Router();
const itemSchema = require('../schemas/itemSchema');
const listSchema = require('../schemas/listSchema');
const mongoose = require('mongoose');

const Item = mongoose.model('Item', itemSchema);
const List = mongoose.model('List', listSchema);

router.prefix = 'items';

router.route('/:itemId')
  .get((req, res) => {
    Item.findById(req.params.itemId, (err, item) => {
      if (err) {
        res.send(err);
      } else {
        res.json(item);
      }
    });
  })
  .put((req, res) => {
    Item.findById(req.params.itemId, (err, item) => {
      if (err) {
        res.send(err);
      } else if (req.body.name !== void 0 && req.body.checked !== void 0) {
        item.name = req.body.name;
        item.checked = req.body.checked;
        item.checkedAt = req.body.checkedAt;
        item.save(err => {
          if (err) {
            res.send(err);
          } else {
            res.json({
              success: true,
              message: 'Item successfully updated',
            });
          }
        });
      }
    });
  })
  .delete((req, res) => {
    Item.findById(req.params.itemId, (err, item) => {
      if (err) {
        res.send(err);
      } else {
        const listId = item.list;
        Item.deleteOne({ _id: item._id }, (err) => {
          if (err) {
            res.send(err);
          } else {
            List.findById(listId, (err, list) => {
              if (err) {
                res.send(err);
              } else {
                list.save((err) => {
                  if (err) {
                    res.send(err);
                  } else {
                    res.json({
                      success: true,
                      message: 'Item was deleted successfully',
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  });

module.exports = router;