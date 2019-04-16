const app = require('../server');

const Table = require('../src/database/models/table.model');
const User = require('../src/database/models/user.model');

const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
const mongoose = require('mongoose');

chai.should();
chai.use(chaiHttp);

const testUserToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2IxZjE4YTI5YzcyZDZjODhjZTU2NDYiLCJsYXN0bmFtZSI6IkRvZSIsImVtYWlsIjoiam9obkBkb2UuY29tIiwiZXhwIjoxNTU1NzcwMzc4LCJpYXQiOjE1NTUxNjU1Nzh9.6Iq6OKFYuYEQKZGa8LbzLHNRia7nN0tYKDH-6DvGJQo';

describe('Tests for - table.controller - /api/tables GET', function() {
    it('tries to create two tables then tries to get list of array with all tables and a 200 status.', (done) => {
        const tableOne = new Table({
            number: 1
        });

        const tableTwo = new Table({
            number: 2
        });

        tableOne.save()
        .then(() => tableTwo.save())
        .then(() => { 
            chai.request(app)
            .get('/api/tables')
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .then((res, err) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.have.property('number').equals(1);
                res.body[1].should.have.property('number').equals(2);
                done(err);
            })
            .catch(err => {
                done(err);
            });
        });
    });
});

describe('Tests for - table.controller - /api/table POST', function() {
    it('tries to create table as result it should give a status 200 then checks if the response is the same as te given number from the table.', (done) => {
        Table.countDocuments().then(count => {
            chai.request(app)
            .post('/api/table')
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .send({ "number": 1 })
            .then((res, err) => {
                Table.countDocuments().then(newCount => {
                    assert(count + 1 === newCount);
                    res.should.have.status(200);
                    res.body.should.have.property('number', 1);
                    res.body.should.have.property('_id', res.body._id);
                    done(err);
                });
            })
            .catch(err => {
                done(err);
            });
        });
    });

    it('tries to create table with a invaild format then checks if its a 422 status code with a error message check.', (done) => {
        chai.request(app)
            .post('/api/table')
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .send({ "number": "one" })
            .then((res, err) => {
                res.should.have.status(422);
                res.body.should.have.property('error', 'Table validation failed: number: Cast to Number failed for value "one" at path "number"');
                done(err);
            })
            .catch(err => {
                done(err);
            });
    });

    it('tries to create table without a body then checks if its a 422 status code with a error message check.', (done) => {
        chai.request(app)
            .post('/api/table')
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .then((res, err) => {
                res.should.have.status(422);
                res.body.should.have.property('error', 'Table validation failed: number: TableNumber is required.');
                done(err);
            })
            .catch(err => {
                done(err);
            });
    });
});

describe('Tests for - table.controller - /api/table PUT', function() {
    it('tries to create table as result then tries to do a PUT request with a new body and checks on 200 status also the response body.', (done) => {
        const table = new Table({
            number: 1
        });

        table.save()
        .then(() => {
            chai.request(app)
            .put('/api/table')
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .send({
                "_id": table._id,
                "number": 2, 
            })
            .then((res, err) => {
                res.should.have.status(200);
                res.body.should.have.property('number', 2);
                res.body.should.have.property('_id', res.body._id);
                done(err);
            })
            .catch(err => {
                done(err);
            });
        });
    });

    it('create a valid table then tries to put a table with invaild body and checks on 422 status also the response body error message.', (done) => {
        const table = new Table({
            number: 1
        });

        table.save()
        .then(() => {
            chai.request(app)
            .put('/api/table')
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .send({
                "number": 2
            })
            .then((res, err) => {
                res.should.have.status(422);
                res.body.should.have.property('error', 'Cast to ObjectId failed for value "{ _id: undefined }" at path "_id" for model "Table"');
                done(err);
            })
            .catch(err => {
                done(err);
            });
        });
    });

    it('create a valid table then tries to put a table with invaild format of table number and checks on 422 status also the response body error message.', (done) => {
        const table = new Table({
            number: 1
        });

        table.save()
        .then(() => {
            chai.request(app)
            .put('/api/table')
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .send({
                "_id": table._id,
                "number": "one"
            })
            .then((res, err) => {
                res.should.have.status(422);
                res.body.should.have.property('error', 'Cast to number failed for value "one" at path "number"');
                done(err);
            })
            .catch(err => {
                done(err);
            });
        });
    });

    it('create a valid table then tries to put a table with invaild body then checks on 422 status also the response body error message.', (done) => {
        const table = new Table({
            number: 1
        });

        table.save()
        .then(() => {
            chai.request(app)
            .put('/api/table')
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .then((res, err) => {
                res.should.have.status(422);
                res.body.should.have.property('error', 'Cast to ObjectId failed for value "{ _id: undefined }" at path "_id" for model "Table"');
                done(err);
            })
            .catch(err => {
                done(err);
            });
        });
    });
});

describe('Tests for - table.controller - /api/table/:id DELETE', function() {
    it('tries to create table then removes the table by the just created :id', (done) => {
        const table = new Table({
            number: 1
        });

        table.save()
        .then(() => {
            Table.countDocuments().then(count => {
                chai.request(app)
                .delete(`/api/table/${table._id}`)
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .then((res, err) => {
                    Table.countDocuments().then(newCount => {
                        assert(count - 1 === newCount);
                        res.should.have.status(200);
                        res.body.should.have.property('message', 'Successfully removed!');
                        done(err);
                    });
                })
                .catch(err => {
                    done(err);
                });
            });
        });
    });

    it('tries to create table then removes the table by a non existing :id', (done) => {
        const table = new Table({
            number: 1
        });

        table.save()
        .then(() => {
            chai.request(app)
            .delete(`/api/table/${mongoose.Types.ObjectId()}`)
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .then((res, err) => {
                res.should.have.status(422);
                res.body.should.have.property('error', "Table doesn't exist!");
                done(err);
            })
            .catch(err => {
                done(err);
            });
        });
    });
});

describe('Tests for - table.controller - /api/table/:id GET', function() {
    it('tries to create table then gets the table by the just created :id', (done) => {
        const table = new Table({
            number: 1
        });

        table.save()
        .then(() => {
            chai.request(app)
            .get(`/api/table/${table._id}`)
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .then((res, err) => {
                res.should.have.status(200);
                res.body.should.have.property('_id', `${table._id}`);
                res.body.should.have.property('number', table.number);
                done(err);
            })
            .catch(err => {
                done(err);
            });
        });
    });

    it('tries to create table then gets the table by a non existing :id', (done) => {
        const table = new Table({
            number: 1
        });

        table.save()
        .then(() => {
            chai.request(app)
            .get(`/api/table/${mongoose.Types.ObjectId()}`)
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .then((res, err) => {
                res.should.have.status(422);
                res.body.should.have.property('error', "Table doesn't exist!");
                done(err);
            })
            .catch(err => {
                done(err);
            });
        });
    });
});

describe('Tests for - table.controller - /api/table/user POST', function() {
    it('tries to create table then puts a fake user id and adds it to the table. Also checks on status 200 and the response.', (done) => {
        const table = new Table({
            number: 1
        });
    
        table.save()
        .then(() => {
            chai.request(app)
            .post(`/api/table/user`)
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .send({ 
                "_id": `${table._id}`,
                "userID": `${mongoose.Types.ObjectId()}`
            })
            .then((res, err) => {
                res.should.have.status(200);
                res.body.should.have.property('_id', `${table._id}`);
                res.body.should.have.property('number', table.number);
                done(err);
            })
            .catch(err => {
                done(err);
            });
        });
    });


    it('tries to create table then puts a fake user id and real table id and tries to add it. Also checks on status 422 and the response.', (done) => {
        const table = new Table({
            number: 1
        });
    
        table.save()
        .then(() => {
            chai.request(app)
            .post(`/api/table/user`)
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .send({ 
                "_id": `${mongoose.Types.ObjectId()}`,
                "userID": `${mongoose.Types.ObjectId()}`
            })
            .then((res, err) => {
                res.should.have.status(422);
                res.body.should.have.property('error', "Table doesn't exist!");
                done(err);
            })
            .catch(err => {
                done(err);
            });
        });
    });

    it('tries to create table then tries to remove a user from a existing table. Checks on status 200 and response.', (done) => {
        const table = new Table({
            number: 1
        });

        table.save()
        .then(() => {
            Table.countDocuments().then(count => {
                chai.request(app)
                .delete(`/api/table/${table._id}`)
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .then((res, err) => {
                    Table.countDocuments().then(newCount => {
                        res.should.have.status(200);
                        res.body.should.have.property('message', "Successfully removed!");
                        done(err);
                    });
                })
                .catch(err => {
                    done(err);
                });
            });
        });
    });

    it('tries to create table then tries to remove a user from a non existing table. Checks on status 422 and response.', (done) => {
        const table = new Table({
            number: 1
        });

        table.save()
        .then(() => {
            Table.countDocuments().then(count => {
                chai.request(app)
                .delete(`/api/table/${mongoose.Types.ObjectId()}`)
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .then((res, err) => {
                    Table.countDocuments().then(newCount => {
                        res.should.have.status(422);
                        res.body.should.have.property('error', "Table doesn't exist!");
                        done(err);
                    });
                })
                .catch(err => {
                    done(err);
                });
            });
        });
    });
});