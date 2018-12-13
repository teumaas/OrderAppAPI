// const app = require('../server');

// const chai = require('chai');
// const chaiHttp = require('chai-http');

// chai.use(chaiHttp);

// const Category = require('../src/database/models/category.model');
// const User = require('../src/database/models/user.model');
// const expect = chai.expect;
// const assert = chai.assert;

// const dummyUser = {
//     firstname: "John",
//     lastname: "Doe",
//     email: "john@doe.com",
//     password: "secret123"
// };

// const testJWT = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzExNjdlZDY1ZjMzZjM1N2NhMDZiYzgiLCJsYXN0bmFtZSI6IlNtaXRzIiwiZW1haWwiOiJ0bXNtaXRzQGdtYWlsLmNvbSIsImV4cCI6MTU0NTI0OTM4OSwiaWF0IjoxNTQ0NjQ0NTg5fQ.yPuDbLJqVtVR1Aycos1r_P4s511MgUK7Furjk-isESM';
// const invalidTestJWT = 'Bearer eyWefGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTQ0NjIxMzAzLCJleHAiOjE1NzYxNTczMDN9.taqaX6EPam5gKF6duW7fliYHJfaUP2I2sPor6eOcKG8';

// describe('Category controller', function() {
//     this.timeout(5000);

//     it('Gets all /api/catergories retrieves array and returns 200.', (done) => {
//         request(app)
//             .get('/api/categories')
//             .end((err, res) => {
//                 assert(res.statusCode === 200);
//                 done();
//             })
//     });

//     it('Post to /api/category with valid Category posts test category and returns 200.', done => {
//         const testCategory = new Category({
//             title: 'TestCategory',
//             product: '5bfe91fa286cf6587cb3d8b4',
//             imagePath: 'http://www.test.nl/test.jpg'
//         });
    
//         request(app)
//             .post('/api/category')
//             .set('Authorization', testJWT)
//             .send(testCategory)
//             .end((err, res) => {
//                 assert(res.body.title === 'TestCategory');
//                 assert(res.body.product === '5bfe91fa286cf6587cb3d8b4');
//                 assert(res.body.imagePath === 'http://www.test.nl/test.jpg');
//                 assert(res.statusCode === 200);
//                 done();
//             })
//     });

//     it('Post to /api/category with missing parameter returns 422.', done => {
//         const testCategory = new Category({
//             product: '5bfe91fa286cf6587cb3d8b4',
//             imagePath: 'http://www.test.nl/test.jpg'
//         });

//         request(app)
//             .post('/api/category')
//             .set('Authorization',testJWT)
//             .send(testCategory)
//             .end((err, res) => {
//                 assert(res.statusCode === 422);
//                 done();
//             })
//     });

//     it('Put to /api/artist/ with valid Artist edits existing test artist and returns 200.', done => {
//         const testCategory = new Category({
//             title: 'TestCategory',
//             product: '5bfe91fa286cf6587cb3d8b4',
//             imagePath: 'http://www.test.nl/test.jpg'
//         });

//         const testEditCategory = new Category({
//             title: 'TestCategoryEdit',
//             product: '5bfe91fa286cf6587cb3d8b4',
//             imagePath: 'http://www.test.nl/test.jpg'
//         });

//         testCategory.save().then(() => {
//             request(app)
//                 .put('/api/category/')
//                 .set('Authorization',testJWT)
//                 .set('name',testCategory.title)
//                 .send(testEditCategory)
//                 .end((err, res) => {
//                     assert(res.body.title === 'TestCategory');
//                     assert(res.body.product === '5bfe91fa286cf6587cb3d8b4');
//                     assert(res.body.imagePath === 'http://www.test.nl/test.jpg');
//                     assert(res.statusCode === 200);
//                     done();
//                 })
//         });
//     });
// });

