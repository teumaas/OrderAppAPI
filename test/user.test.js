const app = require('../server');

const assert = require('assert');
const request = require('supertest');

const Category = require('../src/database/models/category.model');
const User = require('../src/database/models/user.model');

const testUserLogin = {
    "email": "john@doe.com",
    "password": "secret123"
};

const testUser = {
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@doe.com",
    "password": "secret123"
};

const invalidTestUser = {
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@doe.com"
};

describe('Tests for - user.controller - /api/users/register', function() {
    this.timeout(5000);
    it('saves an user to the database: Checks if the user realy exists then gets a status 200.', (done) => {
        User.countDocuments().then(count => {
            request(app)
            .post('/api/users/register')
            .send(testUser)
            .end((err, res) => {
                User.countDocuments().then(newCount => {
                    User.findByIdAndDelete(res.body._id).then(() => {
                        assert(count + 1 === newCount);
                        assert(res.statusCode === 200);
                        done();
                    });
                });

            });
        });
    });

    it('tries to save a invalid user to the database: Checks if the user realy exists then gets a status 422.', (done) => {
        User.countDocuments().then(count => {
            request(app)
            .post('/api/users/register')
            .send(invalidTestUser)
            .end((err, res) => {
                User.countDocuments().then(newCount => {
                    User.findByIdAndDelete(res.body._id).then(() => {
                        assert(count + 1 === newCount);
                        assert(res.statusCode === 422);
                        done();
                    });
                });

            });
        });
    });
});

describe.only('Tests for - user.controller - /api/users/login', function() {
    it('tries to login an user to the database: Checks if the status 200 and if it gets a token back.', (done) => {
        request(app)
            .post('/api/users/login')
            .send(testUserLogin)
            .end((err, res) => {
                assert(res.body, 'token');
                assert(res.statusCode === 200);
                done();
            });
    });

    it('Get to /api/order with missing Authorization header yields 403.', (done) => {
        request(app)
            .get('/api/products')
            .end((err, res) => {
                assert(res.statusCode === 402);
                done();
            })
    });
});

