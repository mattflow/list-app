const express = require('express');
const listRouter = require('./routers/listRouter');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to my API!',
  });
});

router.use('/lists', listRouter);

module.exports = router;