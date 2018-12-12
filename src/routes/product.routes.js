const express = require('express');
const jwt = require('express-jwt');
const key = require('../config/config');
const auth = jwt(key);

const routes = express.Router();

const productController = require('../controllers/product.controller');

routes.get('/products', auth,  productController.getAllProduct);

routes.post('/product', auth,  productController.postProduct);
routes.get('/product/:id', auth,  productController.getProduct);
routes.put('/product', auth,  productController.putProduct);
routes.delete('/product/:id', auth,  productController.deleteProduct);

module.exports = routes;