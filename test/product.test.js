const app = require('../server');

const Category = require('../src/database/models/category.model');
const Product = require('../src/database/models/product.model');
const mongoose = require('mongoose');

const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');

chai.should();
chai.use(chaiHttp);

const testUserToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2IxZjE4YTI5YzcyZDZjODhjZTU2NDYiLCJsYXN0bmFtZSI6IkRvZSIsImVtYWlsIjoiam9obkBkb2UuY29tIiwiZXhwIjoxNTU1NzcwMzc4LCJpYXQiOjE1NTUxNjU1Nzh9.6Iq6OKFYuYEQKZGa8LbzLHNRia7nN0tYKDH-6DvGJQo';


describe('Tests for - product.controller - /api/products GET', function() {
    it('tries to create two products then tries to gets a list of array items with all the product and a 200 status also checks on if its a array and the response with properties.', (done) => {
        const productOne = new Product({
            name: 'Name product one.',
            brand: 'Brand product one.',
            description: 'description product one.',
            price: 1.00,
        });

        const productTwo = new Product({
            name: 'Name product two.',
            brand: 'Brand product two.',
            description: 'description product two.',
            price: 2.00,
        });

        productOne.save()
        .then(() => productTwo.save())
        .then(() => { 
            chai.request(app)
            .get('/api/products')
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .then((res, err) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                
                res.body[0].should.have.property('name').equals('Name product one.');
                res.body[0].should.have.property('brand').equals('Brand product one.');
                res.body[0].should.have.property('description').equals('description product one.');
                res.body[0].should.have.property('price').equals(1.00);
                
                res.body[1].should.have.property('name').equals('Name product two.');
                res.body[1].should.have.property('brand').equals('Brand product two.');
                res.body[1].should.have.property('description').equals('description product two.');
                res.body[1].should.have.property('price').equals(2.00);
                done(err);
            })
            .catch(err => {
                done(err);
            });
        });
    });
});

describe('Tests for - product.controller - /api/product POST', function() {
    it('tries to create a category then post a new product with the same category id as product. Status 200 check and properties.', (done) => {
        const category = new Category({
            title: 'Name product one.',
        });

        category.save()
            .then(() => { 
                Product.countDocuments().then(count => {
                chai.request(app)
                .post('/api/product')
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .send({
                    name: 'Name product one.',
                    brand: 'Brand product one.',
                    description: 'description product one.',
                    category: category._id,
                    price: 1.00,
                })
                .then((res, err) => {
                    Product.countDocuments().then(newCount => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('name').equals('Name product one.');
                        res.body.should.have.property('brand').equals('Brand product one.');
                        res.body.should.have.property('description').equals('description product one.');
                        res.body.should.have.property('price').equals(1.00);
                        assert(count + 1 === newCount);
                        done(err);
                    });
                })
                .catch(err => {
                    done(err);
                });
            });
        });
    });

    it('tries to create a category then post a new product with no body the same category id as product. Status 422 check and error message.', (done) => {
        const category = new Category({
            title: 'Name product one.',
        });

        category.save()
        .then(() => { 
            chai.request(app)
            .post('/api/product')
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .then((res, err) => {
                res.should.have.status(422);
                res.body.should.be.a('object');
                res.body.should.have.property('error', "Product validation failed: price: Price is required., description: Description is required., brand: Brand is required., name: Name is required.");
                done(err);
            });
        })
        .catch(err => {
            done(err);
        });
    });

    it('tries to create a category then post a new product with invaild body properties, status 422 check and error message', (done) => {
        const category = new Category({
            title: 'Name product one.',
        });

        category.save()
            .then(() => { 
            chai.request(app)
            .post('/api/product')
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .send({
                name: 1.00,
                brand: 1.00,
                description: 1.00,
                category: category._id,
                price: "Test",
            })
            .then((res, err) => {
                res.should.have.status(422);
                res.body.should.be.a('object');
                res.body.should.have.property('error').equals('Product validation failed: price: Cast to Number failed for value "Test" at path "price"');
                done(err);
            })
            .catch(err => {
                done(err);
            });
        });
    });
});

describe('Tests for - product.controller - /api/product GET', function() {
    it('Creates a category then a product finally gets the product with the same id on status code 200 with properties of the response.', (done) => {
        const category = new Category({
            title: 'Name product one.',
        });
        category.save()
        .then(() => {
            const product = new Product({
                name: 'Name product.',
                brand: 'Brand product.',
                description: 'description product.',
                price: 1.00,
                category: category._id
            });

            product.save();

            chai.request(app)
            .get(`/api/product/${product._id}`)
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .then((res, err) => {
                res.should.have.status(200);
                res.body.should.be.a('object');

                res.body.should.have.property('name').equals('Name product.');
                res.body.should.have.property('brand').equals('Brand product.');
                res.body.should.have.property('description').equals('description product.');
                res.body.should.have.property('price').equals(1.00);
                done(err);
            })
            .catch(err => {
                done(err);
            });
        });
    });

    it('Tries to get a product with a invaild id status code 422 and properties check.', (done) => {
        chai.request(app)
        .get(`/api/product/${mongoose.Types.ObjectId()}`)
        .set('Authorization' ,`Bearer ${testUserToken}`)
        .then((res, err) => {
            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error').equals("Product doesn't exist!");
            done(err);
        })
        .catch(err => {
            done(err);
        });
    });

    it('Tries to get a product with a invaild format id status code 422 and properties check.', (done) => {
        chai.request(app)
        .get(`/api/product/fjiSHFESHFIHESUFH`)
        .set('Authorization' ,`Bearer ${testUserToken}`)
        .then((res, err) => {
            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error').equals('Cast to ObjectId failed for value "fjiSHFESHFIHESUFH" at path "_id" for model "Product"');
            done(err);
        })
        .catch(err => {
            done(err);
        });
    });
});

describe('Tests for - product.controller - /api/product PUT', function() {
    it('Creates a category then a product finally updates the product with a new body then checks on status code 200 with properties of the response.', (done) => {
        const category = new Category({
            title: 'Name product one.',
        });
        category.save()
        .then(() => {
            const product = new Product({
                name: 'Name product.',
                brand: 'Brand product.',
                description: 'description product.',
                price: 1.00,
                category: category._id
            });

            product.save();

            chai.request(app)
            .put('/api/product')
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .send({
                _id: product._id,
                name: 'Name product edit.',
                brand: 'Brand product edit.',
                description: 'description product edit.',
                price: 2.00,
            })
            .then((res, err) => {
                res.should.have.status(200);
                res.body.should.be.a('object');

                res.body.should.have.property('name').equals('Name product edit.');
                res.body.should.have.property('brand').equals('Brand product edit.');
                res.body.should.have.property('description').equals('description product edit.');
                res.body.should.have.property('price').equals(2.00);
                done(err);
            })
            .catch(err => {
                done(err);
            });
        });
    });

    it('Creates a category then a product finally updates the product with a invalid body then checks on status code 422 with properties of the response.', (done) => {
        const category = new Category({
            title: 'Name product one.',
        });
        category.save()
        .then(() => {
            const product = new Product({
                name: 'Name product.',
                brand: 'Brand product.',
                description: 'description product.',
                price: 1.00,
                category: category._id
            });

            product.save();

            chai.request(app)
            .put('/api/product')
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .then((res, err) => {
                res.should.have.status(422);
                res.body.should.be.a('object');
                res.body.should.have.property('error').equals('Cast to ObjectId failed for value "{ _id: undefined }" at path "_id" for model "Product"');
                done(err);
            })
            .catch(err => {
                done(err);
            });
        });
    });

    it('Creates a category then a product finally updates the product with a invaild format body then checks on status code 422 with properties of the response.', (done) => {
        const category = new Category({
            title: 'Name product one.',
        });
        category.save()
        .then(() => {
            const product = new Product({
                name: 'Name product.',
                brand: 'Brand product.',
                description: 'description product.',
                price: 1.00,
                category: category._id
            });

            product.save();

            chai.request(app)
            .put('/api/product')
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .send({
                _id: product._id,
                name: 4,
                brand: 1,
                description: 7,
                price: 'Two dot zero',
            })
            .then((res, err) => {
                res.should.have.status(422);
                res.body.should.be.a('object');
                res.body.should.have.property('error').equals('Cast to number failed for value "Two dot zero" at path "price"');
                done(err);
            })
            .catch(err => {
                done(err);
            });
        });
    });
});

describe('Tests for - product.controller - /api/product DELETE', function() {
    it('Creates a category then a product finally removes the product with the same id on status code 200 with properties of the response.', (done) => {
        const category = new Category({
            title: 'Name product one.',
        });
        category.save()
        .then(() => {
            const product = new Product({
                name: 'Name product.',
                brand: 'Brand product.',
                description: 'description product.',
                price: 1.00,
                category: category._id
            });

            product.save();

            chai.request(app)
            .delete(`/api/product/${product._id}`)
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .then((res, err) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').equals('Successfully removed!');
                done(err);
            })
            .catch(err => {
                done(err);
            });
        });
    });

    it('Creates a category then a product finally tries to delete the product with invaild id, status code 422 with properties of the response.', (done) => {
        const category = new Category({
            title: 'Name product one.',
        });
        category.save()
        .then(() => {
            const product = new Product({
                name: 'Name product.',
                brand: 'Brand product.',
                description: 'description product.',
                price: 1.00,
                category: category._id
            });

            product.save();

            chai.request(app)
            .delete(`/api/product/${mongoose.Types.ObjectId()}`)
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .then((res, err) => {
                res.should.have.status(422);
                res.body.should.be.a('object');
                res.body.should.have.property('error').equals("Product doesn't exist!");
                done(err);
            })
            .catch(err => {
                done(err);
            });
        });
    });

    it('Creates a category then a product finally tries to delete the product with a invaild format id, status code 200 with properties of the response.', (done) => {
        const category = new Category({
            title: 'Name product one.',
        });
        category.save()
        .then(() => {
            const product = new Product({
                name: 'Name product.',
                brand: 'Brand product.',
                description: 'description product.',
                price: 1.00,
                category: category._id
            });

            product.save();

            chai.request(app)
            .delete(`/api/product/dajdiasjdias`)
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .then((res, err) => {
                res.should.have.status(422);
                res.body.should.be.a('object');
                res.body.should.have.property('error').equals("Product doesn't exist!");
                done(err);
            })
            .catch(err => {
                done(err);
            });
        });
    });
});