const express = require('express');
const _ = require('lodash');

const redis = require('../helpers/redis');
const validTokenMiddleware = require('../middlewares/expoToken');

const router = express.Router();

router.get('/', async (req, res) => {
  redis
    .lrangeAsync(`advertisements`, 0, -1)
    .then(results => {
      const advertisements = results.map(advertisement => JSON.parse(advertisement));
      res.send(advertisements);
    })
    .catch(() => res.sendStatus(500));
});

module.exports = router;
