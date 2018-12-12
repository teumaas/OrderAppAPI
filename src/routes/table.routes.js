const express = require('express');
const jwt = require('express-jwt');
const key = require('../config/config');
const auth = jwt(key);

const routes = express.Router();

const tableController = require('../controllers/table.controller');

routes.get('/tables', auth,  tableController.getAllTable);

routes.post('/table', auth,  tableController.postTable);
routes.get('/table/:id', auth,  tableController.getTable);
routes.put('/table', auth,  tableController.putTable);
routes.delete('/table/:id', auth,  tableController.deleteTable);

routes.post('/table/user', auth,  tableController.checkInUser);
routes.delete('/table/user', auth,  tableController.checkOutUser);

module.exports = routes;