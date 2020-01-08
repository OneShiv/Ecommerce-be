const Category = require('../models/category');
const { errorHandler } = require('../utils/dbErrorHandler');
exports.createCategory = (req, res, next) => {
    console.log(req.body);
    const category = new Category(req.body);
    category.save((err, data) => {
        if (err || !data) {
            return res.status(400).json({
                error: !req.body.name ? "No empty category name allowed" : errorHandler(err)
            })
        }
        res.json({
            data
        })
    });
}

exports.getCategory = (req, res, next, id) => {
    Category.findById({
        _id: id
    }, (err, category) => {
        if (err || !category) {
            return res.status(400).json({
                error: 'No such category'
            });
        }
        req.category = category;
        next();
    })
}

exports.readCategory = (req, res) => {
    return res.send({
        category: req.category
    });
}

exports.updateCategory = (req, res) => {
    const category = req.category;
    if (req.body.name) {
        category.name = req.body.name
    }
    else {
        return res.status(400).json({
            error: "Name cannot be blank"
        });
    }
    category.save((err, category) => {
        return res.status(200).json({
            category
        });
    });
}

exports.deleteCategory = (req, res) => {
    const category = req.category;
    category.remove((err, removedCategory) => {
        if (err) {
            return res.status(400).json({
                error: "Unable to remove categroy"
            });
        }
        res.send({
            message: "OK CATEGORY REMOVED"
        });
    })
}

exports.readAllCategories = (req, res) => {
    Category.find({}, (err, resp_categories) => {
        if (err) {
            return res.status(400).json({
                error: "Unable to retrieve categories"
            });
        }
        return res.status(200).json({
            categories: resp_categories
        });
    })
}