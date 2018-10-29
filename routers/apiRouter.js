const express = require('express');
const listRouter = require('./listRouter');
const itemRouter = require('./itemRouter');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to my API!',
  });
});

router.use(`/${listRouter.prefix}`, listRouter);
router.use(`/${itemRouter.prefix}`, itemRouter);

module.exports = router;