const express = require('express');
const listRouter = require('./listRouter');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to my API!',
  });
});

router.use(`/${listRouter.prefix}`, listRouter);

module.exports = router;