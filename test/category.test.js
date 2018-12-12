const assert = require('assert');
const request = require('supertest');
const app = require('../server');
const Category = require('../src/database/models/category.model');

const testJWT = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzBlOWQxZGZmMzZlNDViOGNhMzc0MGYiLCJsYXN0bmFtZSI6IkRvZSIsImVtYWlsIjoiam9obkBkb2UubmwiLCJleHAiOjE1NDUyMTQ3MjYsImlhdCI6MTU0NDYwOTkyNn0.TRdsv_Vp1oe8jf6WRurSeBkyQKW3El5vlttaYm6Wm2A';
const invalidTestJWT = 'Bearer eyWefGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTQ0NjIxMzAzLCJleHAiOjE1NzYxNTczMDN9.taqaX6EPam5gKF6duW7fliYHJfaUP2I2sPor6eOcKG8';

describe('Category controller', function() {
    this.timeout(5000);

    it.only('Post to /api/category with valid Category posts test category and returns 200.', done => {
        const testCategory = new Category({
            title: 'TestCategory',
            product: '',
            imagePath: 'http://www.test.nl/test.jpg'
        });
    
        request(app)
            .post('/api/category')
            .set('Authorization', testJWT)
            .send(testCategory)
            .end((err, res) => {
                assert(res.statusCode === 200);
                done();
            })
    });

});

