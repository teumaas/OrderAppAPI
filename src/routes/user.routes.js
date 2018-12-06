const express = require('express');
const passport = require('passport');

const userController = require('../controllers/user.controller');

const routes = express.Router();

routes.get('/users/profile', passport.authenticate('jwt', { session : false }),  userController.userCurrent);
routes.post('/users/register', passport.authenticate('register', { session : false }),  userController.userRegister);
routes.post('/users/login', userController.userLogin);
  
module.exports = routes;