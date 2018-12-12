const mongoose = require('mongoose');
const app = require('../server');

before(done => {
    // MongoDB test DB connection
    mongoose.connect('mongodb://localhost/orderapp-test', { useNewUrlParser: true, useFindAndModify: false });
    mongoose.connection
        .once('open', () => done())
        .on('error', err => {
            console.warn('Warning', error)
        });
});

beforeEach(done => {
    // Drops all the data from the test database.
    mongoose.connection.db.dropDatabase(done);
});