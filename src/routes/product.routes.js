const express = require('express');
const jwt = require('express-jwt');
const key = require('../config/config');
const auth = jwt(key);

const routes = express.Router();

const productController = require('../controllers/product.controller');

routes.get('/products', auth,  productController.getAll);

module.exports = routes;