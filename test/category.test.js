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

describe('Tests for - menu.controller - /api/categories GET', function() {
    it.only('tries to create a product then creates two categories with the product id of before created prodict, then tries to get all the new created categories and checks on status 200 and if its a response with array also the properies will be checked.', (done) => {
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