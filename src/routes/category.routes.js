const express = require('express');
const jwt = require('express-jwt');
const key = require('../config/config');
const auth = jwt(key);

const routes = express.Router();

const categoryController = require('../controllers/category.controller');

routes.get('/categories', auth,  categoryController.getAllCategory);

routes.post('/category', auth,  categoryController.postCategory);
routes.get('/category/:id', auth,  categoryController.getCategory);
routes.put('/category', auth,  categoryController.putCategory);
routes.delete('/category/:id', auth,  categoryController.deleteCategory);

routes.post('/category/product', auth,  categoryController.addProductToCategory);
routes.delete('/category/product', auth,  categoryController.removeProductToCategory);

module.exports = routes;