const formidable = require('formidable');
const { extend } = require('lodash');
const fs = require('fs');

const { errorHandler } = require('../utils/dbErrorHandler');
const Product = require('../models/product');

exports.createProduct = (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        // checking all fields

        const { name, description, category, quantity, shipping } = fields;
        if (!name || !description || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: 'name, description, category, quantity, shipping all are required fields'
            });
        }
        let product = new Product(fields);
        console.log(files);
        // restricting size of image to be less than 1 mb
        if (files.image) {
            if (files.image.size > 1000000) {
                return res.status(400).json({
                    error: 'Image must be less than 1 MB'
                });
            }
            console.log("hello");
            console.log(files);
            product.image.data = fs.readFileSync(files.image.path);
            product.image.contentType = files.image.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            return res.json(result);
        });
    });
}

exports.getProduct = (req, res, next, id) => {
    Product.findById({
        _id: id
    }, (err, response) => {
        if (err || !response) {
            return res.status(400).json({
                error: 'No such product exists'
            });
        }
        req.product = response;
        next();
    });
}

exports.readProduct = (req, res, next) => {
    req.product.image = undefined;
    return res.json(req.product);
}

exports.deleteProduct = (req, res, next) => {
    // we will get product and user in request

    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: 'No such product to delete'
            });
        }
        return res.json({
            message: "PRODUCT DELETED"
        });
    })
}

exports.updateProduct = (req, res) => {
    console.log(req.body);
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        // checking all fields
        console.log(fields);
        const { name, description, category, quantity, shipping } = fields;
        console.log(name, description, category, quantity, shipping);
        if (name === "" || description === "" || category === "" || quantity < 0 || shipping === "") {
            return res.status(400).json({
                error: 'either of field does not have proper update value'
            });
        }
        let product = req.product;
        if (name) {
            product.name = name
        }
        if (description) {
            product.description = description
        }
        if (shipping) {
            product.shipping = shipping
        }
        if (quantity >= 0) {
            product.quantity = quantity
        }
        if (category) {
            product.category = category;
        }
        // restricting size of image to be less than 1 mb
        if (files.image) {
            if (files.image.size > 1000000) {
                return res.status(400).json({
                    error: 'Image must be less than 1 MB'
                });
            }
            product.image.data = fs.readFileSync(files.image.path);
            product.image.contentType = files.image.type;
        }

        product.save((err, result) => {
            console.log(err);
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            return res.json(result);
        });
    });

}

/*
* get product by sale
* sell = /product?sortBy=sold&order=desc&limit=10
* arrival = /product?sortBy=createdAt&order=asc&limit=10
* if no params all products will be returned
*/
exports.readAllProducts = (req, res) => {
    console.log(req.query);
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : 'name';
    let limit = req.query.limit ? req.query.limit : 10;
    Product.find()
        .select("-image")
        .populate('category')
        .sort([[sortBy, order]])
        .limit(parseInt(limit))
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }
            res.send({
                products: data
            });
        })
}

// related products
// logic: find product based on requested product category
// product having same product category 

exports.listRelatedProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    Product.find({
        _id: {
            $ne: req.product
        },
        category: req.product.category
    })
        .select("-image")
        .limit(limit)
        .populate('category', '_id name')
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'No related product found'
                });
            }
            res.send({
                products: data
            });
        });
}

exports.getAllProductByCategory = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let category = req.query.category ? req.query.category : '';
    if (category === '') {
        return res.status(400).json({
            error: 'No such category exists found'
        });
    }
    Product.find({
        category: category
    })
        .select("-image")
        .populate('category')
        .limit(limit)
        .exec((err, response) => {
            if (err) {
                return res.status(400).json({
                    error: 'No products found'
                });
            }
            res.send({
                products: response
            });
        });

}

// get all products by search query

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : 'asc';
    let sortBy = req.body.sortBy ? req.body.sortBy : 'name';
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = parseInt(req.body.skip);

    let searchObject = {};

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === 'price') {
                searchObject[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            } else {
                searchObject[key] = req.body.filters[key]
            }
        }
    }

    Product.find(searchObject)
        .select("-image")
        .populate('category')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'No products found'
                });
            }
            res.json({
                size: data.length,
                products: data
            });
        })

}

exports.getProductImage = (req, res, next) => {
    if (req.product.image.data) {
        res.set('Content-Type', req.product.image.contentType);
        return res.send(req.product.image.data);
    }
    next();
}

exports.listSearch = (req, res) => {
    // create query object to hold search value
    const query = {};
    // assign search value to query name
    if (req.query.name) {
        query.name = {
            $regex: req.query.name,
            $options: 'i'
        }
        if (req.query.category && req.query.category !== 'All') {
            query.category = req.query.category
        }
    }

    // to check in db

    Product.find(query, (err, products) => {
        if (err) {
            return res.status(400).json({
                error: 'No Products found'
            });
        }
        return res.json({
            products: products
        });
    }).select("-image")
}