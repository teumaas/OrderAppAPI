const mongoose = require('mongoose');
const app = require('../server');

before(done => {
    // MongoDB test DB connection
    mongoose.connect('mongodb://teumaas:ditiseengeheim123@ds249372.mlab.com:49372/orderapp-test', { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });
    mongoose.connection
        .once('open', () => done())
        .on('error', err => {
            console.warn('Warning', err);
        });
});

beforeEach(done => {
    // Drops all the data from the test database.
    mongoose.connection.db.dropDatabase(done);
});    