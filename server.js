// node_modules import.
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

// Setup test database.
mongoose.Promise = global.Promise;
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect('mongodb://localhost/orderapp', { useNewUrlParser: true, useFindAndModify: false });
}

// routes import
const userRoutes = require('./src/routes/user.routes');

// custom made modules.
const ApiError = require('./src/utilities/APIError.utility');

// Use express.
const app = express();

// Port initialization.
const port = process.env.PORT || 8080;

// Base URL of API.
app.use('/api', express.static('public'));

// Acces-Control
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    // Pass to next layer of middleware
    next();
});

// bodyParser initialization.
app.use(bodyParser.json());

// Morgan initialization.
app.use(morgan('dev'));

app.use('*', function(req, res, next){
	next();
});

//Routes defined start.

app.use('/users', userRoutes);

//Routes defined end.

//Endpoint error handeling.
app.use('*', function (req, res, next) {
	const error = new ApiError("This endpoint does not exist.", 404);
	next(error);
});

app.use((err, req, res, next) => {
	res.status((err.code || 404)).json(err).end();
});

//Server run log.
app.listen(port, () => {
	console.log(`Server running on port *:${port}`);
});

module.exports = app;