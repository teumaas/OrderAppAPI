const app = require('../server');

const Product = require('../src/database/models/product.model');
const Category = require('../src/database/models/category.model');

const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
const mongoose = require('mongoose');

chai.should();
chai.use(chaiHttp);

const testUserToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2IxZjE4YTI5YzcyZDZjODhjZTU2NDYiLCJsYXN0bmFtZSI6IkRvZSIsImVtYWlsIjoiam9obkBkb2UuY29tIiwiZXhwIjoxNTU1NzcwMzc4LCJpYXQiOjE1NTUxNjU1Nzh9.6Iq6OKFYuYEQKZGa8LbzLHNRia7nN0tYKDH-6DvGJQo';

describe('Tests for - category.controller - /api/categories GET', function() {
    it('tries to create a product then creates two categories with the product id of before created prodict, then tries to get all the new created categories and checks on status 200 and if its a response with array also the properies will be checked.', (done) => {
        const product = new Product({
            name: 'Name product',
            brand: 'Brand product',
            description: 'description product',
            price: 1.00,
        });

        product.save()
        .then(() => { 

            const categoryOne = new Category({
                title: "Test category one.",
                product: product._id.toString(),
            });

            const categoryTwo = new Category({
                title: "Test category two.",
                product: product._id.toString(),
            });
    
            categoryOne.save();
            categoryTwo.save();
                chai.request(app)
                .get('/api/categories')
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .then((res, err) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');

                        res.body[0].should.have.property('_id').equals(categoryOne._id.toString());
                        res.body[0].should.have.property('title').equals(categoryOne.title.toString());
                        res.body[0].product[0].should.have.property('name').contain(product.name.toString());
                        res.body[0].product[0].should.have.property('_id').contain(product._id.toString());

                        res.body[1].should.have.property('_id').equals(categoryTwo._id.toString());
                        res.body[1].should.have.property('title').equals(categoryTwo.title.toString());
                        res.body[1].product[0].should.have.property('_id').contain(product._id.toString());
                        res.body[1].product[0].should.have.property('name').contain(product.name.toString());
                 
                        done(err);
                })
                .catch(err => {
                    done(err);
                });
        });
    });
});

describe('Tests for - category.controller - /api/category POST', function() {
    it('tries to create a product then creates a category with the product id of before created product, then tries to get the category by category id status 200 and the respone properties will be checked.', (done) => {
        const product = new Product({
            name: 'Name product',
            brand: 'Brand product',
            description: 'description product',
            price: 1.00,
        });

        product.save();
        Category.countDocuments().then(count => {
            chai.request(app)
            .post(`/api/category/`)
            .send({
                title: "Test category.",
                product: product._id,
            })
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .then((res, err) => {
                Category.countDocuments().then(newCount => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');

                    res.body.should.have.property('title').equals("Test category.");
                    res.body.should.have.property('product').contain(product._id.toString());

                    assert(count + 1 === newCount);
                
                    done(err);
                });
            })
            .catch(err => {
                done(err);
            });
        });
    });

    it('tries to create a category with invalid body status 422 check and error property check.', (done) => {
        const product = new Product({
            name: 'Name product',
            brand: 'Brand product',
            description: 'description product',
            price: 1.00,
        });

        product.save();
        Category.countDocuments().then(count => {
            chai.request(app)
            .post(`/api/category/`)
            .send({
                product: product._id
            })
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .then((res, err) => {
                Category.countDocuments().then(newCount => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');

                    res.body.should.have.property('error').equals("Category validation failed: title: Title is required.");
                
                    done(err);
                });
            })
            .catch(err => {
                done(err);
            });
        });
    });
});

describe('Tests for - category.controller - /api/category GET', function() {
    it('tries to create a product then creates a category with the product id of before created product, then tries to get the category by category id status 200 and the respone properties will be checked.', (done) => {
        const product = new Product({
            name: 'Name product',
            brand: 'Brand product',
            description: 'description product',
            price: 1.00,
        });

        product.save()
        .then(() => { 
            const category = new Category({
                title: "Test category.",
                product: product._id.toString(),
            });
    
            category.save();
            Category.countDocuments().then(count => {
                chai.request(app)
                .get(`/api/category/${category._id.toString()}`)
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .then((res, err) => {
                    Category.countDocuments().then(newCount => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
    
                        res.body.should.have.property('_id').equals(category._id.toString());
                        res.body.should.have.property('title').equals(category.title.toString());
                        res.body.product[0].should.have.property('name').contain(product.name.toString());
                        res.body.product[0].should.have.property('_id').contain(product._id.toString());

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

    it('tries to get a category by a non-existing category id checks on 422 status and error property message.', (done) => {
        chai.request(app)
        .get(`/api/category/${mongoose.Types.ObjectId()}`)
        .set('Authorization' ,`Bearer ${testUserToken}`)
        .then((res, err) => {
            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error').equals("Category doesn't exist!");

            done(err);
        })
        .catch(err => {
            done(err);
        });
    });


    it('tries to get a category by a non-existing and invaild category id checks on 422 status and error property message.', (done) => {
        chai.request(app)
        .get(`/api/category/dkadjasadDSDDSjdask`)
        .set('Authorization' ,`Bearer ${testUserToken}`)
        .then((res, err) => {
            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error').equals('Cast to ObjectId failed for value "dkadjasadDSDDSjdask" at path "_id" for model "Category"');

            done(err);
        })
        .catch(err => {
            done(err);
        });
    });
});

describe('Tests for - category.controller - /api/category PUT', function() {
    it('tries to create a product then creates a category with the product id of before created product, tries to update the category with new properties checks on status 200 and property check.', (done) => {
        const product = new Product({
            name: 'Name product',
            brand: 'Brand product',
            description: 'description product',
            price: 1.00,
        });

        product.save()
        .then(() => { 

            const category = new Category({
                title: "Test category.",
                product: product._id
            });
    
            category.save();
       
                chai.request(app)
                .put(`/api/category`)
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .send({
                    _id: category._id,
                    title: "Test Category edit.",
                    product: "5cb5faa08a6a283d085d8644"
                })
                .then((res, err) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');

                        res.body.should.have.property('title').equals("Test Category edit.");
                        res.body.should.have.property('product').contain("5cb5faa08a6a283d085d8644");
                 
                        done(err);
                })
                .catch(err => {
                    done(err);
                });
        });
    });

    it('tries to create a product then creates a category with the product id of before created product, tries to update the category with invalid body checks on status 422 and the error property check.', (done) => {
        const product = new Product({
            name: 'Name product',
            brand: 'Brand product',
            description: 'description product',
            price: 1.00,
        });

        product.save()
        .then(() => { 
            const category = new Category({
                title: "Test category.",
                product: product._id
            });
    
            category.save();
       
                chai.request(app)
                .put(`/api/category`)
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .then((res, err) => {
                        res.should.have.status(422);
                        res.body.should.be.a('object');

                        res.body.should.have.property('error').equals('Cast to ObjectId failed for value "{ _id: undefined }" at path "_id" for model "Category"');
                        
                        done(err);
                })
                .catch(err => {
                    done(err);
                });
        });
    });
});

describe('Tests for - category.controller - /api/category DELETE', function() {
    it('tries to create a product then creates a category with the product id of before created product, then tries to delete the category by category id status 200 and the respone properties will be checked.', (done) => {
        const product = new Product({
            name: 'Name product',
            brand: 'Brand product',
            description: 'description product',
            price: 1.00,
        });

        const category = new Category({
            title: "Test category.",
            product: product._id
        });

        product.save();
        category.save().then(() => { 
            Category.countDocuments().then(count => {
                chai.request(app)
                .delete(`/api/category/${category._id.toString()}`)
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .then((res, err) => {
                    Category.countDocuments().then(newCount => {
                        assert(count-1 === newCount);

                        res.should.have.status(200);
                        res.body.should.be.a('object');
    
                        res.body.should.have.property('message').equals("Successfully removed!");
                    
                        done(err);
                    });
                })
                .catch(err => {
                    done(err);
                });
            });
        });
    });

    it('tries to create a product then creates a category with the product id of before created product, then tries to delete the categort by invaild category id status 422 and the respone properties will be checked.', (done) => {
        const product = new Product({
            name: 'Name product',
            brand: 'Brand product',
            description: 'description product',
            price: 1.00,
        });

        const category = new Category({
            title: "Test category.",
            product: product._id
        });

        product.save();
        category.save().then(() => { 
            Category.countDocuments().then(count => {
                chai.request(app)
                .delete(`/api/category/${mongoose.Types.ObjectId()}`)
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .then((res, err) => {
                    Category.countDocuments().then(newCount => {
                        res.should.have.status(422);
                        res.body.should.be.a('object');

                        res.body.should.have.property('error').equals("Category doesn't exist!");
                    
                        done(err);
                    });
                })
                .catch(err => {
                    done(err);
                });
            });
        });
    });

    it('tries to create a product then creates a category with the product id of before created product, then tries to delete the category by invalid format category id status 422 and the respone properties will be checked.', (done) => {
        const product = new Product({
            name: 'Name product',
            brand: 'Brand product',
            description: 'description product',
            price: 1.00,
        });

        const category = new Category({
            title: "Test category.",
            product: product._id
        });

        product.save();
        category.save().then(() => { 
            Category.countDocuments().then(count => {
                chai.request(app)
                .delete(`/api/category/JIjijddDDSwwwIJJIG`)
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .then((res, err) => {
                    Category.countDocuments().then(newCount => {
                        res.should.have.status(422);
                        res.body.should.be.a('object');

                        res.body.should.have.property('error').equals("Argument passed in must be a single String of 12 bytes or a string of 24 hex characters");
                    
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

describe('Tests for - category.controller - api/category/product POST', function() {
    it('tries to add a product to a category by id of product and id of category checks on status 200 and response properties.', (done) => {
        const product = new Product({
            name: 'Name product',
            brand: 'Brand product',
            description: 'description product',
            price: 1.00,
        });

        const category = new Category({
            title: "Test category.",
            product: product._id
        });

        product.save();
        category.save();
        chai.request(app)
        .post(`/api/category/product/`)
        .send({
            _id: category._id,
            productID: product._id
        })
        .set('Authorization' ,`Bearer ${testUserToken}`)
        .then((res, err) => {
            res.should.have.status(200);
            res.body.should.be.a('object');

            res.body.should.have.property('product').contain(product._id.toString());
            res.body.should.have.property('title').equals("Test category.");
            
            done(err);
        })
        .catch(err => {
            done(err);
        });
    });

    it('tries to add a product to a category by with missing body checks on status 422 and response property.', (done) => {
        const product = new Product({
            name: 'Name product',
            brand: 'Brand product',
            description: 'description product',
            price: 1.00,
        });

        const category = new Category({
            title: "Test category.",
            product: product._id
        });

        product.save();
        category.save();
        chai.request(app)
        .post(`/api/category/product/`)
        .set('Authorization' ,`Bearer ${testUserToken}`)
        .then((res, err) => {
            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error').equals('Cast to ObjectId failed for value "{ _id: undefined }" at path "_id" for model "Category"');
            
            done(err);
        })
        .catch(err => {
            done(err);
        });
    });

    it('tries to add a category to a product by invalid body checks on status 422 and response properties.', (done) => {
        const product = new Product({
            name: 'Name product',
            brand: 'Brand product',
            description: 'description product',
            price: 1.00,
        });

        const category = new Category({
            title: "Test category.",
            product: product._id
        });

        product.save();
        category.save();
        chai.request(app)
        .post(`/api/category/product/`)
        .send({
            product: product._id,
            category: category._id
        })
        .set('Authorization' ,`Bearer ${testUserToken}`)
        .then((res, err) => {
            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error').equals('Cast to ObjectId failed for value "{ _id: undefined }" at path "_id" for model "Category"');
            
            done(err);
        })
        .catch(err => {
            done(err);
        });
    });
});