const express = require('express');

const authMiddleware = require('../middlewares/steemConnectAuth');
const notifications = require('./notifications');
const orders = require('./orders');
const advertisements = require('./advertisements');

const router = express.Router();

//router.use('/notifications', authMiddleware, notifications);
router.use('/notifications', notifications);
//router.use('/orders', authMiddleware, orders);
router.use('/orders',  orders);
//router.use('/advertisements', authMiddleware, advertisements);
router.use('/advertisements', advertisements);
module.exports = router;
