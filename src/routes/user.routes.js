const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const routes = express.Router();

const userController = require('../controllers/user.controller');


module.exports = routes;