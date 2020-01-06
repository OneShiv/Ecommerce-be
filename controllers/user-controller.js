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