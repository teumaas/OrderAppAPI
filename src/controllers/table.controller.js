const Table = require('../database/models/table.model');
const User = require('../database/models/user.model');

module.exports = {

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    getAllTable(req, res, next) {
        Table.find()
            .then(table => res.send(table))
            .catch(next);
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    postTable(req, res, next) {
        const tableBody = req.body;

        Table.create(tableBody)
            .then(table => res.send(table))
            .catch(next);
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    getTable(req, res, next) {
        const tableID = req.body._id;

        Table.findOne({ _id: tableID })
            .then(table => res.send(table))
            .catch(next);
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    putTable(req, res, next) {
        const tableID = req.body._id;
        const tableBody = req.body;

        Table.findOneAndUpdate({ _id: tableID }, tableBody)
            .then(() => Table.findById({ _id: tableID }))
            .then(table => res.send(table))
            .catch(next);
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    deleteTable(req, res, next) {
        const tableID = req.body._id;

        Table.findByIdAndDelete({ _id: tableID })
            .then(res.status(200).json({"message": "Successfully removed!"}))
            .catch(next);
    },
    
    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    checkInUser(req, res, next) {
        const tableID = req.body._id;
        const userID = req.body.userId;

        Table.findOneAndUpdate({ _id: tableID }, { $addToSet: { user:  userID } })
            .then(() => Table.findById({ _id: tableID }))
            .then(table => res.send(table))
            .catch(next);
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    checkOutUser(req, res, next) {
        const tableID = req.body._id;
        const userID = req.body.userId;

        Table.findOneAndUpdate({ _id: tableID }, { $pull: { user: userID }})
            .then(() => Table.findById({ _id: tableID }))
            .then(table => res.send(table))
            .catch(next);
    }
};