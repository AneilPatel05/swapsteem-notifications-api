const express = require('express');

const authMiddleware = require('../middlewares/steemConnectAuth');
const notifications = require('./notifications');
const orders = require('./orders');
const advertisements = require('./advertisements');

const router = express.Router();

router.use('/notifications', authMiddleware, notifications);
router.use('/orders', authMiddleware, orders);
router.use('/advertisements', authMiddleware, advertisements);
module.exports = router;
