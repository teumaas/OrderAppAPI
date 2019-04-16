const app = require('../server');
const User = require('../src/database/models/user.model');

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

const testUserLogin = {
    "email": "john@doe.com",
    "password": "secret123"
};

const invalidLoginPassword = {
    "email": "john@doe.com",
    "password": "secret321"
};

const invalidLoginEmail = {
    "email": "doe@john.com",
    "password": "secret123"
};

const testUser = {
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@doe.com",
    "password": "secret123"
};

beforeEach(done => {
    const user = new User(testUser);
    user.setPassword(testUser.password);

    user.save(done);
});

describe('Tests for - user.controller - /api/users/login - User credentials', function() {
    it('tries to login an user to the database: Checks if the status 200 and if it gets a token back.', (done) => {
        chai.request(app)
            .post('/api/users/login')
            .send(testUserLogin)
            .then((res, err) => {
                res.should.have.status(200);
                res.body.should.have.property('token');
                done(err);
            })
            .catch(err => {
                done(err);
            });
    });

    it('tries to login with an invaild user password to the database: Checks if the status 401 and if it gets the message: Password is wrong.', (done) => {
        chai.request(app)
            .post('/api/users/login')
            .send(invalidLoginPassword)
            .then((res, err) => {
                res.should.have.status(401);
                res.body.should.have.property('message', 'Password is wrong');
                done(err);
            })
            .catch(err => {
                done(err);
            });
    });

    it('tries to login with an invaild user email to the database: Checks if the status 401 and if it gets the message: User not found.', (done) => {
        chai.request(app)
            .post('/api/users/login')
            .send(invalidLoginEmail)
            .then((res, err) => {
                res.should.have.status(401);
                res.body.should.have.property('message', 'User not found');
                done(err);
            })
            .catch(err => {
                done(err);
            });
    });    
});

describe('Tests for - user.controller - /api/users/login - Token', function() {
    it('tries to login with an valid email/password to the database: Checks if the status 200 and if it gets a token. Then tries to login with the previous response token checks if it gets status 200 and if it responses with the firstname and lastname, email of the user.', (done) => {
        chai.request(app)
            .post('/api/users/login')
            .send(testUserLogin)
            .then((res, err) => {
                res.body.should.have.property('token');
                res.should.have.status(200);
                chai.request(app)
                    .get('/api/users/login')
                    .set('Authorization' ,`Bearer ${res.body.token}`)
                    .then((res, err) => {
                        res.should.have.status(200);
                        res.body.should.have.property('firstname').equals(testUser.firstname);
                        res.body.should.have.property('lastname').equals(testUser.lastname);
                        res.body.should.have.property('email').equals(testUser.email);
                        done(err);
                    })
                    .catch(err => {
                        done(err);
                    });
            })
            .catch(err => {
                done(err);
            });
    });

    it('tries to login with no Bearer token.', (done) => {
        chai.request(app)
            .get('/api/users/login')
            .set('Authorization' ,`Bearer `)
            .then((res, err) => {
                res.should.have.status(422);
                res.body.should.have.property('error', 'No authorization token was found');
                done(err);
            })
            .catch(err => {
                done(err);
            });
    });

    it('tries to login with a wrong format.', (done) => {
        chai.request(app)
            .get('/api/users/login')
            .set('Authorization' ,`Bearer`)
            .then((res, err) => {
                res.should.have.status(422);
                res.body.should.have.property('error', 'Format is Authorization: Bearer [token]');
                done(err);
            })
            .catch(err => {
                done(err);
            });
    });

    it('tries to login with invaild format of a Bearer token.', (done) => {
        chai.request(app)
            .get('/api/users/login')
            .set('Authorization' ,`Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG`)
            .then((res, err) => {
                res.should.have.status(422);
                res.body.should.have.property('error', 'jwt malformed');
                done(err);
            })
            .catch(err => {
                done(err);
            });
    });

    it('tries to login with invaild signatured bearer token.', (done) => {
        chai.request(app)
            .get('/api/users/login')
            .set('Authorization' ,`Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImp0aSI6IjM0YjM5YmU1LWUwNWYtNDBiNC1hZTY1LWY3NjhjNzRiNDU5ZiIsImlhdCI6MTU1NTE1ODk5NSwiZXhwIjoxNTU1MTYyNTk2fQ.7HDXPLffMySCjAiITKxpXNI50yNGZcm3BeRKFcyYeak`)
            .then((res, err) => {
                res.should.have.status(422);
                res.body.should.have.property('error', 'invalid signature');
                done(err);
            })
            .catch(err => {
                done(err);
            });
    });
});