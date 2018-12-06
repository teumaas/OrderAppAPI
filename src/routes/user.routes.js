const express = require('express');
const jwt = require('express-jwt');
const key = require('../config/config');
const auth = jwt(key);

const routes = express.Router();

const userController = require('../controllers/user.controller');

routes.get('/users/profile', auth,  userController.userCurrent);
routes.post('/users/register',  userController.userRegister);
routes.post('/users/login', userController.userLogin);

module.exports = routes;