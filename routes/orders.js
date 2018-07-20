const express = require('express');
const _ = require('lodash');

const redis = require('../helpers/redis');
const validTokenMiddleware = require('../middlewares/expoToken');

const router = express.Router();

router.get('/', async (req, res) => {
  redis
    .lrangeAsync(`orders:${req.user.name}`, 0, -1)
    .then(results => {
      const orders = results.map(order => JSON.parse(order));
      res.send(orders);
    })
    .catch(() => res.sendStatus(500));
});

module.exports = router;
