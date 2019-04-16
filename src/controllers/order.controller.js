const ApiError = require('../utilities/APIError.utility');
const Order = require('../database/models/order.model');
const Product = require('../database/models/product.model');
const Table = require('../database/models/table.model');

module.exports = {

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    getAllOrder(req, res, next) {
        Order.find()
            .populate({ path: 'table', model: 'Table' })
            .populate({ path: 'product', model: 'Product' })
            .then(order => res.send(order))
            .catch(next);
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    postOrder(req, res, next) {
        const orderBody = req.body;

        Order.create(orderBody)
            .then(order => {
                if(order !== null){
                    res.send(order);
                } else {
                    next(new ApiError("Order doesn't exist!", 422));
                }
            })
            .catch(next);
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    getOrder(req, res, next) {
        const orderID = req.params.id;

        Order.findOne({ _id: orderID })
            .populate({ path: 'product', model: 'Product' })
            .populate({ path: 'table', model: 'Table' })
            .then(order => {
                if(order !== null){
                    res.send(order);
                } else {
                    next(new ApiError("Order doesn't exist!", 422));
                }
            })
            .catch(next);
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    putOrder(req, res, next) {
        const orderID = req.body._id;
        const orderProduct = req.body.product;

        Order.findOneAndUpdate({ _id: orderID }, { $push: { product: orderProduct } })
            .populate({ path: 'product', model: 'Product' })
            .populate({ path: 'table', model: 'Table' })
            .then(() => Order.findById({ _id: orderID }))
            .then(order => {
                if(order !== null){
                    res.send(order);
                } else {
                    next(new ApiError("Order doesn't exist!", 422));
                }
            })
            .catch(next);
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    deleteOrder(req, res, next) {
        const orderID = req.params.id;

        Order.findByIdAndDelete({ _id: orderID })
            .then(order => {
                if(order !== null){
                    res.status(200).json({"message": "Successfully removed!"})
                } else {
                    next(new ApiError("Order doesn't exist!", 422));
                }
            })
            .catch(next);
    }
};