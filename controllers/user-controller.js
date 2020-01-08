const User = require('../models/user');

exports.getUser = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'user not found'
            });
        }
        req.profile = user;
        next();
    })
}

exports.updateUser = (req, res) => {
    User.findOneAndUpdate({
        _id: req.profile._id
    },
        {
            $set: req.body
        },
        { new: true },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: 'Not Authorised to perform action'
                })
            }
            user.salt = undefined;
            user.hashed_password = undefined;
            res.json({
                user
            });
        });
}

exports.addOrderToUserHistory = (req, res, next) => {
    let history = [];
    req.body.order.products.forEach((item) => history.push({
        _id: item.item._id,
        name: item.item.name,
        quantity: item.item.count,
        description: item.item.description,
        category: item.count,
        transaction_id: req.body.order.transaction_id,
        amount: req.body.order.amount
    }));

    User.findOneAndUpdate({
        _id: req.profile._id
    }, {
        $push: {
            history: history
        }
    }, { new: true }, (err, data) => {
        if (err) {
            return res.status(400).json({
                error: "Failed to update"
            })
        }
        next();
    })
}
