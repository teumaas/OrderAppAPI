const express = require('express');
const jwt = require('express-jwt');
const key = require('../config/config');
const auth = jwt(key);

const routes = express.Router();

const orderController = require('../controllers/order.controller');

routes.get('/orders', auth,  orderController.getAllOrder);

routes.post('/order', auth,  orderController.postOrder);
routes.get('/order/:id', auth,  orderController.getOrder);
routes.put('/order', auth,  orderController.putOrder);
routes.delete('/order/:id', auth,  orderController.deleteOrder);

module.exports = routes;