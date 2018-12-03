// node_modules import.
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// custom made modules.
const ApiError = require('./src/utilities/APIError.utility');

// Use express.
const app = express();

// Port initialization.
const port = process.env.PORT || 8080;

// Setup test database.
mongoose.Promise = global.Promise;
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect('mongodb://localhost/orderapp', { useNewUrlParser: true, useFindAndModify: false });
}

// Base URL of API.
app.use('/api', express.static('public'));

// bodyParser initialization.
app.use(bodyParser.json());

// Morgan initialization.
app.use(morgan('dev'));

app.use('*', function(req, res, next){
	next();
});

//Routes defined start.

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