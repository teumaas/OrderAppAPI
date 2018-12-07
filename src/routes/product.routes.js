const express = require('express');
const jwt = require('express-jwt');
const key = require('../config/config');
const auth = jwt(key);

const routes = express.Router();

const productController = require('../controllers/product.controller');

routes.get('/products', auth,  productController.getAllProduct);

routes.post('/product', auth,  productController.postProduct);
routes.get('/product', auth,  productController.getProduct);
routes.put('/product', auth,  productController.putProduct);
routes.delete('/product', auth,  productController.deleteProduct);

module.exports = routes;