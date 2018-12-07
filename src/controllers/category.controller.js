const Category = require('../database/models/category.model');
const Product = require('../database/models/product.model');

module.exports = {

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    getAllCategory(req, res, next) {
        Category.find()
            .then(category => res.send(category))
            .catch(next);
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    postCategory(req, res, next) {
        const categoryBody = req.body;

        Category.create(categoryBody)
            .then(category => res.send(category))
            .catch(next);
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    getCategory(req, res, next) {
        const categoryID = req.body._id;

        Category.findOne({ _id: categoryID })
            .then(category => res.send(category))
            .catch(next);
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    putCategory(req, res, next) {
        const categoryID = req.body._id;
        const categoryBody = req.body;

        Category.findOneAndUpdate({ _id: categoryID }, categoryBody)
            .then(() => Category.findById({ _id: categoryID }))
            .then(category => res.send(category))
            .catch(next);
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    deleteCategory(req, res, next) {
        const categoryID = req.body._id;

        Category.findByIdAndDelete({ _id: categoryID })
            .then(res.status(200).json({"message": "Successfully removed!"}))
            .catch(next);
    },
    
    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    addProductToCategory(req, res, next) {
        const categoryID = req.body._id;
        const productID = req.body.productID;

        Category.findOneAndUpdate({ _id: categoryID }, { $addToSet: { product:  productID } })
            .then(() => Category.findById({ _id: categoryID }))
            .then(category => res.send(category))
            .catch(next);
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    removeProductToCategory(req, res, next) {
        const categoryID = req.body._id;
        const productID = req.body.userId;

        Category.findOneAndUpdate({ _id: categoryID }, { $pull: { product: productID }})
            .then(() => Category.findById({ _id: categoryID }))
            .then(category => res.send(category))
            .catch(next);
    }
};