const express = require('express');
const _ = require('lodash');

const redis = require('../helpers/redis');
const validTokenMiddleware = require('../middlewares/expoToken');

const router = express.Router();

router.get('/', async (req, res) => {
  redis
    .lrangeAsync(`notifications:${req.user.name}`, 0, -1)
    .then(results => {
      const notifications = results.map(notification => JSON.parse(notification));
      res.send(notifications);
    })
    .catch(() => res.sendStatus(500));
});

module.exports = router;
