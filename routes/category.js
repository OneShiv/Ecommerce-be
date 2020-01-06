const express = require('express');
const router = express.Router();

const { createCategory, readCategory, getCategory, updateCategory, deleteCategory, readAllCategories } = require('../controllers/category-controller.js');
const { isAuth, isAdmin, requireSignin } = require('../controllers/auth-controller.js');
const { getUser } = require('../controllers/user-controller');

router.post("/category/create/:userId", requireSignin, isAuth, isAdmin, createCategory);
router.get("/category/:categoryId", readCategory);
router.put("/category/:categoryId/:userId", requireSignin, isAuth, isAdmin, updateCategory);
router.delete("/category/:categoryId/:userId", requireSignin, isAuth, isAdmin, deleteCategory);
router.get("/categories", readAllCategories);


router.param("userId", getUser);
router.param("categoryId", getCategory);
module.exports = router;
