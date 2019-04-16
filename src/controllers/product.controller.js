const ApiError = require('../utilities/APIError.utility');
const Product = require('../database/models/product.model');
const Category = require('../database/models/category.model');

module.exports = {

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    getAllProduct(req, res, next) {
        Product.find()
            .populate({ path: 'category', model: 'Category', select: { '_id': 1, 'title': 1, 'imagePath': 1} })
            .then(product => res.send(product))
            .catch(next);
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    postProduct(req, res, next) {
        const productBody = req.body;

        Product.create(productBody)
            .then(product => {
                if(product !== null){
                    res.send(product);
                } else {
                    next(new ApiError("Product doesn't exist!", 422));
                }
            })
            .catch(next);
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    getProduct(req, res, next) {
        const productID = req.params.id;

        Product.findOne({ _id: productID })
            .populate({ path: 'category', model: 'Category', select: { '_id': 1, 'title': 1, 'imagePath': 1} })
            .then(product => {
                if(product !== null){
                    res.send(product);
                } else {
                    next(new ApiError("Product doesn't exist!", 422));
                }
            })
            .catch(next);
    },


    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    putProduct(req, res, next) {
        const productID = req.body._id;
        const productBody = req.body;

        Product.findOneAndUpdate({ _id: productID }, productBody)
            .populate({ path: 'category', model: 'Category', select: { '_id': 1, 'title': 1, 'imagePath': 1} })
            .then(() => Product.findById({ _id: productID }))
            .then(product => {
                if(product !== null){
                    res.send(product);
                } else {
                    next(new ApiError("Product doesn't exist!", 422));
                }
            })
            .catch(next);
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    deleteProduct(req, res, next) {
        const productID = req.params.id;

        Product.findByIdAndDelete({ _id: productID })
            .then(product => {
                if(product !== null){
                    res.status(200).json({"message": "Successfully removed!"});
                } else {
                    next(new ApiError("Product doesn't exist!", 422));
                }
            })
            .catch(next);
    }
};