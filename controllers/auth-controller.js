const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { errorHandler } = require('../utils/dbErrorHandler');


// jwt to gennerate the token
// expressjwt will authorisation

exports.signup = (req, res) => {
    // req.body will not give anything if bodyparser not used.
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            })
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        })
    });
}

exports.signin = (req, res) => {
    // find user by email

    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with this email id does not exist'
            })
        }

        // need to check for that email and password it matches in db
        // authenticate method
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Either of email or password is wrong'
            });
        }
        // generate a signed token with user id
        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET);

        // store token in cookie with expiry time

        res.cookie('token', token, {
            expire: new Date() + 9999
        });

        // send response with token

        const { _id, name, email, role } = user;
        return res.json({
            token,
            user: {
                _id,
                name,
                email,
                role
            }
        });
    });
}

exports.signout = (req, res) => {
    res.clearCookie('token');
    res.json({
        message: 'Signout success'
    });
}

// protect the routes with signin
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});

exports.isAuth = (req, res, next) => {
    console.log(req.profile);
    console.log(req.auth);
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: 'Access Denied'
        });
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    console.log(req.profile.role);
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: 'Admin resource access denied'
        });
    }
    next();
}