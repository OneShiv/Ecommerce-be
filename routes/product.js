const express = require('express');
const router = express.Router();

const { createProduct, getProduct, readProduct, deleteProduct, updateProduct, readAllProducts, listRelatedProducts, getAllProductByCategory, listBySearch, getProductImage } = require('../controllers/product-controller.js');
const { isAuth, isAdmin, requireSignin } = require('../controllers/auth-controller.js');
const { getUser } = require('../controllers/user-controller');

router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, createProduct);
router.get("/product/:productId", readProduct);

// products based on new arrival or max selling or normal
router.get("/products", readAllProducts);
// taking userid here so that we can check that if admin then only can delete

// get related products

router.get('/products/related/:productId', listRelatedProducts);


// get productby category id
router.get('/products/category', getAllProductByCategory);

router.delete("/product/:productId/:userId", requireSignin, isAuth, isAdmin, deleteProduct);
router.put("/product/:productId/:userId", requireSignin, isAuth, isAdmin, updateProduct);
router.param("userId", getUser);
router.param("productId", getProduct);

router.post("/products/by/search", listBySearch);
router.get("/product/image/:productId", getProductImage);

module.exports = router;
