const express = require('express');
const router = express.Router();
const { requireSignin, isAuth } = require('../controllers/auth-controller');
const { getUser, addOrderToUserHistory } = require('../controllers/user-controller');
const { createOrder } = require('../controllers/order-controller');
const { decreaseQuantity } = require('../controllers/product-controller');
router.post("/order/create/:userId", requireSignin, isAuth, addOrderToUserHistory, decreaseQuantity, createOrder);

router.param("userId", getUser);

module.exports = router;