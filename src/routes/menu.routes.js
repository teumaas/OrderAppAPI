const express = require('express');
const jwt = require('express-jwt');
const key = require('../config/config');
const auth = jwt(key);

const routes = express.Router();

const menuController = require('../controllers/menu.controller');

routes.get('/menus', auth,  menuController.getAllMenu);

routes.post('/menu', auth,  menuController.postMenu);
routes.get('/menu', auth,  menuController.getMenu);
routes.put('/menu', auth,  menuController.putMenu);
routes.delete('/menu', auth,  menuController.deleteMenu);

routes.post('/menu/category', auth,  menuController.addCategoryToMenu);
routes.delete('/menu/category', auth,  menuController.removeCategoryToMenu);

module.exports = routes;