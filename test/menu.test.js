const app = require('../server');

const Menu = require('../src/database/models/menu.model');
const Category = require('../src/database/models/category.model');

const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
const mongoose = require('mongoose');

chai.should();
chai.use(chaiHttp);

const testUserToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2IxZjE4YTI5YzcyZDZjODhjZTU2NDYiLCJsYXN0bmFtZSI6IkRvZSIsImVtYWlsIjoiam9obkBkb2UuY29tIiwiZXhwIjoxNTU1NzcwMzc4LCJpYXQiOjE1NTUxNjU1Nzh9.6Iq6OKFYuYEQKZGa8LbzLHNRia7nN0tYKDH-6DvGJQo';

describe('Tests for - menu.controller - /api/menus GET', function() {
    it('tries to create a category then creates two menu with the category id of before created category, then tries to get all the new created menus and checks on status 200 and if its a response with array also the properies will be checked.', (done) => {
        const category = new Category({
            title: "Test category."
        });

        category.save()
        .then(() => { 
            const menuOne = new Menu({
                title: "Test Menu One.",
                category: category._id
            });

            const menuTwo = new Menu({
                title: "Test Menu Two.",
                category: category._id
            });
    
            menuOne.save();
            menuTwo.save();
       
                chai.request(app)
                .get('/api/menus')
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .then((res, err) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');

                        res.body[0].should.have.property('_id').equals(menuOne._id.toString());
                        res.body[0].should.have.property('title').equals(menuOne.title.toString());
                        res.body[0].category[0].should.have.property('title').contain(category.title.toString());
                        res.body[0].category[0].should.have.property('_id').contain(category._id.toString());

                        res.body[1].should.have.property('_id').equals(menuTwo._id.toString());
                        res.body[1].should.have.property('title').equals(menuTwo.title.toString());
                        res.body[1].category[0].should.have.property('_id').contain(category._id.toString());
                        res.body[1].category[0].should.have.property('title').contain(category.title.toString());
                 
                        done(err);
                })
                .catch(err => {
                    done(err);
                });
        });
    });
});

describe('Tests for - menu.controller - /api/menu POST', function() {
    it('tries to create a category then creates a menu with the category id of before created category, then tries to get the menu by menu id status 200 and the respone properties will be checked.', (done) => {
        const category = new Category({
            title: "Test category."
        });

    category.save();
        Menu.countDocuments().then(count => {
            chai.request(app)
            .post(`/api/menu/`)
            .send({
                title: "Test Menu One.",
                category: category._id
            })
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .then((res, err) => {
                Menu.countDocuments().then(newCount => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');

                    res.body.should.have.property('title').equals("Test Menu One.");
                    res.body.should.have.property('category').contain(category._id.toString());

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
        const category = new Category({
            title: "Test category."
        });

    category.save();
        Menu.countDocuments().then(count => {
            chai.request(app)
            .post(`/api/menu/`)
            .send({
                category: category._id
            })
            .set('Authorization' ,`Bearer ${testUserToken}`)
            .then((res, err) => {
                Menu.countDocuments().then(newCount => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');

                    res.body.should.have.property('error').equals("Menu validation failed: title: Name is required.");
                
                    done(err);
                });
            })
            .catch(err => {
                done(err);
            });
        });
    });
});

describe('Tests for - menu.controller - /api/menu GET', function() {
    it('tries to create a category then creates a menu with the category id of before created category, then tries to get the menu by menu id status 200 and the respone properties will be checked.', (done) => {
        const category = new Category({
            title: "Test category."
        });

        category.save()
        .then(() => { 
            const menu = new Menu({
                title: "Test Menu One.",
                category: category._id
            });
    
            menu.save();
            Menu.countDocuments().then(count => {
                chai.request(app)
                .get(`/api/menu/${menu._id.toString()}`)
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .then((res, err) => {
                    Menu.countDocuments().then(newCount => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
    
                        res.body.should.have.property('_id').equals(menu._id.toString());
                        res.body.should.have.property('title').equals(menu.title.toString());
                        res.body.category[0].should.have.property('title').contain(category.title.toString());
                        res.body.category[0].should.have.property('_id').contain(category._id.toString());

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

    it('tries to get a menu by a non-existing menu id checks on 422 status and error property message.', (done) => {
        chai.request(app)
        .get(`/api/menu/${mongoose.Types.ObjectId()}`)
        .set('Authorization' ,`Bearer ${testUserToken}`)
        .then((res, err) => {
            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error').equals("Menu doesn't exist!");

            done(err);
        })
        .catch(err => {
            done(err);
        });
    });


    it('tries to get a menu by a non-existing and invaild menu id checks on 422 status and error property message.', (done) => {
        chai.request(app)
        .get(`/api/menu/dkadjasadDSDDSjdask`)
        .set('Authorization' ,`Bearer ${testUserToken}`)
        .then((res, err) => {
            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error').equals('Cast to ObjectId failed for value "dkadjasadDSDDSjdask" at path "_id" for model "Menu"');

            done(err);
        })
        .catch(err => {
            done(err);
        });
    });
});

describe('Tests for - menu.controller - /api/menus PUT', function() {
    it('tries to create a category then creates a menu with the category id of before created category, tries to update the menu with new properties checks on status 200 and property check.', (done) => {
        const category = new Category({
            title: "Test category."
        });

        category.save()
        .then(() => { 
            const menu = new Menu({
                title: "Test Menu.",
                category: category._id
            });
    
            menu.save();
       
                chai.request(app)
                .put(`/api/menu`)
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .send({
                    _id: menu._id,
                    title: "Test Menu edit.",
                    category: "5cb5faa08a6a283d085d8644"
                })
                .then((res, err) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');

                        res.body.should.have.property('title').equals("Test Menu edit.");
                        res.body.should.have.property('category').contain("5cb5faa08a6a283d085d8644");
                 
                        done(err);
                })
                .catch(err => {
                    done(err);
                });
        });
    });

    it('tries to create a category then creates a menu with the category id of before created category, tries to update the menu with invalid body checks on status 422 and the error property check.', (done) => {
        const category = new Category({
            title: "Test category."
        });

        category.save()
        .then(() => { 
            const menu = new Menu({
                title: "Test Menu.",
                category: category._id
            });
    
            menu.save();
       
                chai.request(app)
                .put(`/api/menu`)
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .then((res, err) => {
                        res.should.have.status(422);
                        res.body.should.be.a('object');

                        res.body.should.have.property('error').equals('Cast to ObjectId failed for value "{ _id: undefined }" at path "_id" for model "Menu"');
                        
                        done(err);
                })
                .catch(err => {
                    done(err);
                });
        });
    });
});

describe('Tests for - menu.controller - /api/menu DELETE', function() {
    it('tries to create a category then creates a menu with the category id of before created category, then tries to delete the menu by menu id status 200 and the respone properties will be checked.', (done) => {
        const category = new Category({
            title: "Test category."
        });

        const menu = new Menu({
            title: "Test Menu One.",
            category: category._id
        });

        category.save();
        menu.save().then(() => { 
            Menu.countDocuments().then(count => {
                chai.request(app)
                .delete(`/api/menu/${menu._id.toString()}`)
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .then((res, err) => {
                    Menu.countDocuments().then(newCount => {
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

    it('tries to create a category then creates a menu with the category id of before created category, then tries to delete the menu by invaild menu id status 422 and the respone properties will be checked.', (done) => {
        const category = new Category({
            title: "Test category."
        });

        const menu = new Menu({
            title: "Test Menu One.",
            category: category._id
        });

        category.save();
        menu.save().then(() => { 
            Menu.countDocuments().then(count => {
                chai.request(app)
                .delete(`/api/menu/${mongoose.Types.ObjectId()}`)
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .then((res, err) => {
                    Menu.countDocuments().then(newCount => {
                        res.should.have.status(422);
                        res.body.should.be.a('object');

                        res.body.should.have.property('error').equals("Menu doesn't exist!");
                    
                        done(err);
                    });
                })
                .catch(err => {
                    done(err);
                });
            });
        });
    });

    it('tries to create a category then creates a menu with the category id of before created category, then tries to delete the menu by invalid format menu id status 422 and the respone properties will be checked.', (done) => {
        const category = new Category({
            title: "Test category."
        });

        const menu = new Menu({
            title: "Test Menu One.",
            category: category._id
        });

        category.save();
        menu.save().then(() => { 
            Menu.countDocuments().then(count => {
                chai.request(app)
                .delete(`/api/menu/JIjijddDDSwwwIJJIG`)
                .set('Authorization' ,`Bearer ${testUserToken}`)
                .then((res, err) => {
                    Menu.countDocuments().then(newCount => {
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

describe('Tests for - menu.controller - api/menu/category POST', function() {
    it('tries to add a menu to a category by id of menu and id of category checks on status 200 and response properties.', (done) => {
        const category = new Category({
            title: "Test category."
        });

        const menu = new Menu({
            title: "Test Menu.",
            category: category._id
        });

    category.save();
    menu.save();
        chai.request(app)
        .post(`/api/menu/category/`)
        .send({
            _id: menu._id,
            categoryID: category._id
        })
        .set('Authorization' ,`Bearer ${testUserToken}`)
        .then((res, err) => {
            res.should.have.status(200);
            res.body.should.be.a('object');

            res.body.should.have.property('category').contain(category._id.toString());
            res.body.should.have.property('title').equals("Test Menu.");
            
            done(err);
        })
        .catch(err => {
            done(err);
        });
    });

    it('tries to add a menu to a category by with missing body checks on status 422 and response property.', (done) => {
        const category = new Category({
            title: "Test category."
        });

        const menu = new Menu({
            title: "Test Menu.",
            category: category._id
        });

    category.save();
    menu.save();
        chai.request(app)
        .post(`/api/menu/category/`)
        .set('Authorization' ,`Bearer ${testUserToken}`)
        .then((res, err) => {
            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error').equals('Cast to ObjectId failed for value "{ _id: undefined }" at path "_id" for model "Menu"');
            
            done(err);
        })
        .catch(err => {
            done(err);
        });
    });

    it('tries to add a menu to a category by invalid body checks on status 422 and response properties.', (done) => {
        const category = new Category({
            title: "Test category."
        });

        const menu = new Menu({
            title: "Test Menu.",
            category: category._id
        });

    category.save();
    menu.save();
        chai.request(app)
        .post(`/api/menu/category/`)
        .send({
            product: menu._id,
            category: category._id
        })
        .set('Authorization' ,`Bearer ${testUserToken}`)
        .then((res, err) => {
            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error').equals('Cast to ObjectId failed for value "{ _id: undefined }" at path "_id" for model "Menu"');
            
            done(err);
        })
        .catch(err => {
            done(err);
        });
    });
});