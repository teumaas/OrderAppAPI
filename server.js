// node_modules import.
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');

// Setup test database.
mongoose.Promise = global.Promise;
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect('mongodb://localhost/orderapp', { useNewUrlParser: true, useFindAndModify: false });
}

// Middleware import.
require('./src/middleware/passport.middleware');

// routes import
const categoryRoutes = require('./src/routes/category.routes');
const menuRoutes = require('./src/routes/menu.routes');
const orderRoutes = require('./src/routes/order.routes');
const productRoutes = require('./src/routes/product.routes');
const tableRoutes = require('./src/routes/table.routes');
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
app.use(cors());

// bodyParser initialization.
app.use(bodyParser.json());

// Morgan initialization.
app.use(morgan('dev'));

app.use('*', function(req, res, next){
	next();
});

//Routes defined start.
app.use('/api', categoryRoutes);
app.use('/api', menuRoutes);
app.use('/api', orderRoutes);
app.use('/api', productRoutes);
app.use('/api', tableRoutes);
app.use('/api', userRoutes);
//Routes defined end.

//Endpoint error handeling.
app.use('*', function (req, res, next) {
	const error = new ApiError("This endpoint does not exist.", 404);
	next(error);
});

//This is the error handler which handles errors that were passed through next()
app.use((err, req, res, next) => {
    res.status(422).send({ error: err.message });
});

//Server run log.
app.listen(port, () => {
	console.log(`Server running on port *:${port}`);
});

module.exports = app;