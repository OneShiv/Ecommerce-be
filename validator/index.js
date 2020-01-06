exports.userSignupValidator = (req, res, next) => {
    req.check('name', 'Name is required').notEmpty();
    req.check('email', 'Email is required with minimum lenth of 5 char').matches(/.+@.+\..+/).withMessage("Email must contain @").isLength({
        min: 5,
        max: 32
    });
    req.check('password', 'Password is required').notEmpty();
    req.check('password').isLength({
        min: 6
    }).matches(/\d/)
        .withMessage('Password must conatin one number')

    const errors = req.validationErrors();

    if (errors) {
        const firstError = errors.map(err => err.msg)[0];
        return res.status(400).json({
            error: firstError
        })
    }
    next();
}