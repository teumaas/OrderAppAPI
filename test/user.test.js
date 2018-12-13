const app = require('../server');

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const Category = require('../src/database/models/category.model');
const User = require('../src/database/models/user.model');
const expect = chai.expect;
const assert = chai.assert;

const testUserLogin = {
    email: "john@doe.com",
    password: "secret123"
};

const testUser = {
    firstname: "John",
    lastname: "Doe",
    email: "john@doe.com",
    password: "secret123"
};

const invalidTestUser = {
    firstname: "John",
    lastname: "Doe",
    email: "john@doe.com"
};



describe('Tests for - user.controller - /api/users/register', function() {
    it('saves an user to the database: Checks if the user realy exists then gets a status 200.', (done) => {
        User.countDocuments().then(count => {
            chai.request(app)
            .post('/api/users/register')
            .send(testUser)
            .end((err, res) => {
                User.countDocuments().then(newCount => {
                    User.findByIdAndDelete(res.body._id).then(() => {
                        expect(count + 1).to.be.equal(newCount);
                        expect(res).to.have.status(200);
                        done(err);
                    });
                });
            });
        });
    });

    it('tries to save a invalid user to the database: Checks if the user realy exists then gets a status 200.', (done) => {
        User.countDocuments().then(count => {
            chai.request(app)
            .post('/api/users/register')
            .send(invalidTestUser)
            .end((err, res) => {
                User.countDocuments().then(newCount => {
                    User.findByIdAndDelete(res.body._id).then(() => {
                        expect(count + 1).to.be.not.equal(newCount);
                        expect(res).to.have.status(422);
                        done(err);
                    });
                });
            });
        });
    });   
});

describe.only('Tests for - user.controller - /api/users/login', function() { 


    // it('tries to login an user to the database: Checks if the status 200 and if it gets a token back.', (done) => {

    //     before(function() {
    //         chai.request(app)
    //         .post('/api/users/register')
    //         .send(testUser)
    //         .end(function(err, res){
    //         });
    //     });

    //     chai.request(app)
    //     .post('/api/users/login')
    //     .send(testUserLogin)
    //     .end(function(err, res){
    //         expect(res).to.have.status(200);
    
    //         assert.property(res.body, 'token');
    //         done();
    //     });
    // });
});

