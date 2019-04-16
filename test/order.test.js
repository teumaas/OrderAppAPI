const app = require('../server');

const Table = require('../src/database/models/table.model');
const Product = require('../src/database/models/product.model');
const Order = require('../src/database/models/order.model');
const mongoose = require('mongoose');

const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');

chai.should();
chai.use(chaiHttp);

const testUserToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2IxZjE4YTI5YzcyZDZjODhjZTU2NDYiLCJsYXN0bmFtZSI6IkRvZSIsImVtYWlsIjoiam9obkBkb2UuY29tIiwiZXhwIjoxNTU1NzcwMzc4LCJpYXQiOjE1NTUxNjU1Nzh9.6Iq6OKFYuYEQKZGa8LbzLHNRia7nN0tYKDH-6DvGJQo';


describe('Tests for - orders.controller - /api/orders GET', function() {
    it('tries to create two products, two tables and two orders then checks on status 200 and the respones properties of all arrays', (done) => {
        const productOne = new Product({
            name: 'Name product one.',
            brand: 'Brand product one.',
            description: 'Description product one.',
            price: 1.00,
        });

        const productTwo = new Product({
            name: 'Name product two.',
            brand: 'Brand product two.',
            description: 'Description product two.',
            price: 2.00,
        });

        productOne.save();
        productTwo.save();

        const tableOne = new Table({
            number: 1,
            user: mongoose.Types.ObjectId()
        });
        
        const tableTwo = new Table({
            number: 2,
            user: mongoose.Types.ObjectId()
        });
        
        tableOne.save();
        tableTwo.save().then(() => { 
            const orderOne = new Order({
                product: productOne._id,
                table: tableOne._id
            });

            const orderTwo = new Order({
                product: productTwo._id,
                table: tableTwo._id
            });

            orderOne.save();
            orderTwo.save();

            chai.request(app)
            .get('/api/orders')
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .then((res, err) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                
                res.body[0].product[0].should.have.property('name').equals('Name product one.');
                res.body[0].product[0].should.have.property('brand').equals('Brand product one.');
                res.body[0].product[0].should.have.property('description').equals('Description product one.');
                res.body[0].product[0].should.have.property('price').equals(1.0);

                res.body[0].should.have.property('_id').equals(orderOne._id.toString());

                res.body[0].table.should.have.property('_id').equals(orderOne.table._id.toString());    
                res.body[0].table.should.have.property('number').equals(tableOne.number);

                res.body[1].product[0].should.have.property('name').equals('Name product two.');
                res.body[1].product[0].should.have.property('brand').equals('Brand product two.');
                res.body[1].product[0].should.have.property('description').equals('Description product two.');
                res.body[1].product[0].should.have.property('price').equals(2.0);

                res.body[1].should.have.property('_id').equals(orderTwo._id.toString());
                
                res.body[1].table.should.have.property('_id').equals(orderTwo.table._id.toString());    
                res.body[1].table.should.have.property('number').equals(tableTwo.number);
                done(err);
            })
            .catch(err => {
                done(err);
            });
        });
    });
});

describe('Tests for - orders.controller - /api/order POST', function() {
    it('tries to create one products, one tables and one orders then checks on status 200 and the respones properties', (done) => {
        const product = new Product({
            name: 'Name product one.',
            brand: 'Brand product one.',
            description: 'Description product one.',
            price: 1.00,
        });

        const table = new Table({
            number: 1,
            user: mongoose.Types.ObjectId()
        });

        product.save();
        table.save().then(() => { 
            Order.countDocuments().then(count => {
                chai.request(app)
                .post('/api/order')
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .send({
                    product: product._id,
                    table: table._id
                })
                .then((res, err) => {
                    Order.countDocuments().then(newCount => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');

                        res.body.should.have.property('product').contain(product._id.toString());
                        res.body.should.have.property('table').equals(table._id.toString());

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

    it('tries to create one products, one tables and one orders then checks on status 422 and the respones properties of the error.', (done) => {
        const product = new Product({
            name: 'Name product one.',
            brand: 'Brand product one.',
            description: 'Description product one.',
            price: 1.00,
        });

        const table = new Table({
            number: 1,
            user: mongoose.Types.ObjectId()
        });

        product.save();
        table.save().then(() => { 
            Order.countDocuments().then(count => {
                chai.request(app)
                .post('/api/order')
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .then((res, err) => {
                    Order.countDocuments().then(newCount => {
                        res.should.have.status(422);
                        res.body.should.be.a('object');

                        res.body.should.have.property('error').equals('Order validation failed: table: Table is required.');

                        assert(count === newCount);
                        done(err);
                    });
                })
                .catch(err => {
                    done(err);
                });
            });
        });
    });

    it('tries to create one products, one tables and one orders with wrong format of the body then checks on status 422 and the respones properties of the error.', (done) => {
        const product = new Product({
            name: 'Name product one.',
            brand: 'Brand product one.',
            description: 'Description product one.',
            price: 1.00,
        });

        const table = new Table({
            number: 1,
            user: mongoose.Types.ObjectId()
        });

        product.save();
        table.save().then(() => { 
            Order.countDocuments().then(count => {
                chai.request(app)
                .post('/api/order')
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .send({
                    product: 'Wrong body',
                    table: 'Wrong body',
                })
                .then((res, err) => {
                    Order.countDocuments().then(newCount => {
                        res.should.have.status(422);
                        res.body.should.be.a('object');

                        res.body.should.have.property('error').equals('Order validation failed: product: Cast to Array failed for value "Wrong body" at path "product", table: Cast to ObjectID failed for value "Wrong body" at path "table"');

                        assert(count === newCount);
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

describe('Tests for - orders.controller - /api/order GET', function() {
    it('tries to create one products, one tables and one orders then tries to get it by the same id checks status 200 and the respones properties', (done) => {
        const product = new Product({
            name: 'Name product.',
            brand: 'Brand product.',
            description: 'Description product.',
            price: 1.00,
        });

        const table = new Table({
            number: 1,
            user: mongoose.Types.ObjectId()
        });

        product.save();
        table.save().then(() => {

        const order = new Order({
            product: product._id,
            table: table._id
        });

        order.save();
        chai.request(app)
        .get(`/api/order/${order._id}`)
        .set('Authorization' ,`Bearer ${testUserToken}`)
            .then((res, err) => {
                res.should.have.status(200);
                res.body.should.be.a('object');

                res.body.product[0].should.have.property('_id').equals(product._id.toString());
                res.body.product[0].should.have.property('name').equals('Name product.');
                res.body.product[0].should.have.property('brand').equals('Brand product.');
                res.body.product[0].should.have.property('description').equals('Description product.');
                res.body.product[0].should.have.property('price').equals(1.0);

                res.body.should.have.property('_id').equals(order._id.toString());

                res.body.table.should.have.property('_id').equals(order.table._id.toString());    
                res.body.table.should.have.property('number').equals(table.number);

                done(err);
            })
            .catch(err => {
                done(err);
            });
        });
    });

    it('tries to get a non-existing order id, then check on status 422 and the respone properties.', (done) => {
        chai.request(app)
        .get(`/api/order/${mongoose.Types.ObjectId()}`)
        .set('Authorization' ,`Bearer ${testUserToken}`)
        .then((res, err) => {
            res.should.have.status(422);
            res.body.should.be.a('object');
            
            res.body.should.have.property('error').equals("Order doesn't exist!");

            done(err);
        })
        .catch(err => {
            done(err);
        });
    });

    it('tries to get a non-existing order id with wrong format, then check on status 422 and the respone properties.', (done) => {
        chai.request(app)
        .get(`/api/order/fjiSHFESHFIHESUFH`)
        .set('Authorization' ,`Bearer ${testUserToken}`)
        .then((res, err) => {
            res.should.have.status(422);
            res.body.should.be.a('object');
            
            res.body.should.have.property('error').equals('Cast to ObjectId failed for value "fjiSHFESHFIHESUFH" at path "_id" for model "Order"');

            done(err);
        })
        .catch(err => {
            done(err);
        });
    });
});

describe('Tests for - orders.controller - /api/order PUT', function() {
    it('tries to create one product, one tables and post a new order then makes a new product puts it to the order with a new product 200 and the respones properties.', (done) => {
        const product = new Product({
            name: 'Name product original.',
            brand: 'Brand product original.',
            description: 'Description product original.',
            price: 1.00,
        });

        const table = new Table({
            number: 1,
            user: mongoose.Types.ObjectId()
        });

        product.save();
        table.save().then(() => {
            Order.countDocuments().then(count => {
                chai.request(app)
                .post('/api/order')
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .send({
                    table: table._id,
                    product: product._id
                })
                .then((res, err) => {
                    Order.countDocuments().then(newCount => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
     
                        res.body.should.have.property('table').contain(table._id.toString());
                        res.body.should.have.property('product').contain(product._id.toString());
                        assert(count + 1 === newCount);

                        const productNew = new Product({
                            name: 'Name product new.',
                            brand: 'Brand product new.',
                            description: 'Description product new.',
                            price: 2.00,
                        });
    
                        productNew.save();
                        chai.request(app)
                        .put('/api/order')
                        .set('Authorization' ,`Bearer ${testUserToken}`)
                        .send({
                            _id: res.body._id,
                            product: productNew._id
                        })
                        .then((res, err) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');

                            res.body.should.have.property('_id').contain(res.body._id);
                            res.body.should.have.property('product').contain(product._id.toString());
                            res.body.should.have.property('product').contain(productNew._id.toString());

                            done(err);
                        })
                        .catch(err => {
                            done(err);
                        });
                    });
                })
                .catch(err => {
                    done(err);
                });
            });
        });
    });

    it('tries to create one product, one tables and post a new order then makes a new product puts it to the order with a invalid body 422 and the respones properties.', (done) => {
        const product = new Product({
            name: 'Name product original.',
            brand: 'Brand product original.',
            description: 'Description product original.',
            price: 1.00,
        });

        const table = new Table({
            number: 1,
            user: mongoose.Types.ObjectId()
        });

        product.save();
        table.save().then(() => {
            Order.countDocuments().then(count => {
                chai.request(app)
                .post('/api/order')
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .send({
                    table: table._id,
                    product: product._id
                })
                .then((res, err) => {
                    Order.countDocuments().then(newCount => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
     
                        res.body.should.have.property('table').contain(table._id.toString());
                        res.body.should.have.property('product').contain(product._id.toString());
                        assert(count + 1 === newCount);

                        const productNew = new Product({
                            name: 'Name product new.',
                            brand: 'Brand product new.',
                            description: 'Description product new.',
                            price: 2.00,
                        });
    
                        productNew.save();
                        chai.request(app)
                        .put('/api/order')
                        .set('Authorization' ,`Bearer ${testUserToken}`)
                        .then((res, err) => {
                            res.should.have.status(422);
                            res.body.should.be.a('object');

                            res.body.should.have.property('error').contain('Cast to ObjectId failed for value "{ _id: undefined }" at path "_id" for model "Order"');
                            
                            done(err);
                        })
                        .catch(err => {
                            done(err);
                        });
                    });
                })
                .catch(err => {
                    done(err);
                });
            });
        });
    });

    it('tries to create one product, one tables and post a new order then makes a new product puts it to the order with a wrong format of the product body 422 and the respones properties.', (done) => {
        const product = new Product({
            name: 'Name product original.',
            brand: 'Brand product original.',
            description: 'Description product original.',
            price: 1.00,
        });

        const table = new Table({
            number: 1,
            user: mongoose.Types.ObjectId()
        });

        product.save();
        table.save().then(() => {
            Order.countDocuments().then(count => {
                chai.request(app)
                .post('/api/order')
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .send({
                    table: table._id,
                    product: product._id
                })
                .then((res, err) => {
                    Order.countDocuments().then(newCount => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
     
                        res.body.should.have.property('table').contain(table._id.toString());
                        res.body.should.have.property('product').contain(product._id.toString());
                        assert(count + 1 === newCount);

                        const productNew = new Product({
                            name: 'Name product new.',
                            brand: 'Brand product new.',
                            description: 'Description product new.',
                            price: 2.00,
                        });
    
                        productNew.save();
                        chai.request(app)
                        .put('/api/order')
                        .set('Authorization' ,`Bearer ${testUserToken}`)
                        .send({
                            _id: 'wrong',
                            product: 'wrong'
                        })
                        .then((res, err) => {
                            res.should.have.status(422);
                            res.body.should.be.a('object');
                            
                            res.body.should.have.property('error').contain('Cast to ObjectId failed for value "wrong" at path "_id" for model "Order"');

                            done(err);
                        })
                        .catch(err => {
                            done(err);
                        });
                    });
                })
                .catch(err => {
                    done(err);
                });
            });
        });
    });
});

describe('Tests for - orders.controller - /api/order DELETE', function() {
    it('tries to create one product, one tables and post a new order then makes a new product deletes it to the order with a the id status 200 and the respones properties.', (done) => {
        const product = new Product({
            name: 'Name product original.',
            brand: 'Brand product original.',
            description: 'Description product original.',
            price: 1.00,
        });

        const table = new Table({
            number: 1,
            user: mongoose.Types.ObjectId()
        });

        product.save();
        table.save().then(() => {
            Order.countDocuments().then(countOrderOne => {
                chai.request(app)
                .post('/api/order')
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .send({
                    table: table._id,
                    product: product._id
                })
                .then((res, err) => {
                    Order.countDocuments().then(newCountOrderOne => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
     
                        res.body.should.have.property('table').contain(table._id.toString());
                        res.body.should.have.property('product').contain(product._id.toString());
                        assert(countOrderOne + 1 === newCountOrderOne);

                        Order.countDocuments().then(countOrderTwo => {
                            chai.request(app)
                            .delete(`/api/order/${res.body._id}`)
                            .set('Authorization' ,`Bearer ${testUserToken}`)
                            .then((res, err) => {
                                Order.countDocuments().then(newCountOrderTwo => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');
                                    assert(countOrderTwo - 1 === newCountOrderTwo);

                                    res.body.should.have.property('message').contain('Successfully removed!');
                                });
                                done(err);
                            })
                            .catch(err => {
                                done(err);
                            });
                        });
                    });
                })
                .catch(err => {
                    done(err);
                });
            });
        });
    });

    it('tries to create one product, one tables and post a new order then makes a new product deletes it to the order with a invalid id status 422 and the respones properties.', (done) => {
        const product = new Product({
            name: 'Name product original.',
            brand: 'Brand product original.',
            description: 'Description product original.',
            price: 1.00,
        });

        const table = new Table({
            number: 1,
            user: mongoose.Types.ObjectId()
        });

        product.save();
        table.save().then(() => {
            Order.countDocuments().then(countOrderOne => {
                chai.request(app)
                .post('/api/order')
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .send({
                    table: table._id,
                    product: product._id
                })
                .then((res, err) => {
                    Order.countDocuments().then(newCountOrderOne => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
     
                        res.body.should.have.property('table').contain(table._id.toString());
                        res.body.should.have.property('product').contain(product._id.toString());
                        assert(countOrderOne + 1 === newCountOrderOne);

                        chai.request(app)
                        .delete(`/api/order/${mongoose.Types.ObjectId()}`)
                        .set('Authorization' ,`Bearer ${testUserToken}`)
                        .then((res, err) => {
                            res.should.have.status(422);
                            res.body.should.be.a('object');

                            res.body.should.have.property('error').contain("Order doesn't exist!");
                            
                            done(err);
                        })
                        .catch(err => {
                            done(err);
                        });
                    });
                })
                .catch(err => {
                    done(err);
                });
            });
        });
    });

    
    it('tries to create one product, one tables and post a new order then makes a new product deletes it to the order with a invalid format of the id status 422 and the respones properties.', (done) => {
        const product = new Product({
            name: 'Name product original.',
            brand: 'Brand product original.',
            description: 'Description product original.',
            price: 1.00,
        });

        const table = new Table({
            number: 1,
            user: mongoose.Types.ObjectId()
        });

        product.save();
        table.save().then(() => {
            Order.countDocuments().then(countOrderOne => {
                chai.request(app)
                .post('/api/order')
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .send({
                    table: table._id,
                    product: product._id
                })
                .then((res, err) => {
                    Order.countDocuments().then(newCountOrderOne => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
     
                        res.body.should.have.property('table').contain(table._id.toString());
                        res.body.should.have.property('product').contain(product._id.toString());
                        assert(countOrderOne + 1 === newCountOrderOne);

                        chai.request(app)
                        .delete(`/api/order/faijfhaHHFUFIE`)
                        .set('Authorization' ,`Bearer ${testUserToken}`)
                        .then((res, err) => {
                            res.should.have.status(422);
                            res.body.should.be.a('object');

                            res.body.should.have.property('error').contain("Argument passed in must be a single String of 12 bytes or a string of 24 hex characters");
                            
                            done(err);
                        })
                        .catch(err => {
                            done(err);
                        });
                    });
                })
                .catch(err => {
                    done(err);
                });
            });
        });
    });
});