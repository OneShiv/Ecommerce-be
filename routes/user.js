const express = require('express');
const router = express.Router();

const { getUser, updateUser } = require('../controllers/user-controller');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth-controller');
router.get('/user/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
    req.profile.salt = undefined;
    req.profile.hashed_password = undefined;
    res.json({
        user: req.profile
    });
});

router.put('/user/:userId', requireSignin, isAuth, updateUser);

router.param('userId', getUser)

module.exports = router;