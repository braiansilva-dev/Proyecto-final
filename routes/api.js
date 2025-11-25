const express = require('express');
const router = express.Router();

const catsController = require('../controllers/catsController');
const productsController = require('../controllers/productsController');
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');
const jwtMiddleware = require('../modules/jwtMiddleware');

// Categories
router.get('/cats/cat', catsController.getCats);

// Category products (files like 101.json)
router.get('/cats_products/:id', catsController.getCatProducts);

// Products and product info
router.get('/products/:id', productsController.getProduct);
router.get('/products_comments/:id', productsController.getProductComments);

// User cart (protected)
router.get('/user_cart/:id', jwtMiddleware.verifyToken, cartController.getUserCart);

// Cart buy and sell/publish (static json files)
router.get('/cart/buy', cartController.getBuy);
router.get('/sell/publish', cartController.getPublish);

// Auth
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
