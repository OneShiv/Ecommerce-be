const { Order, CartItem } = require('../models/order');
const { errorHandler } = require('../utils/dbErrorHandler');

exports.createOrder = (req, res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((error, data) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        return res.json(data);
    })
}