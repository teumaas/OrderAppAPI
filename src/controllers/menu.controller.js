const Menu = require('../database/models/menu.model');
const Category = require('../database/models/category.model');

module.exports = {

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    getAllMenu(req, res, next) {
        Menu.find()
            .then(menu => res.send(menu))
            .catch(next);
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    postMenu(req, res, next) {
        const menuBody = req.body;

        Menu.create(menuBody)
            .then(menu => res.send(menu))
            .catch(next);
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    getMenu(req, res, next) {
        const menuID = req.body._id;

        Menu.findOne({ _id: menuID })
            .then(menu => res.send(menu))
            .catch(next);
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    putMenu(req, res, next) {
        const menuID = req.body._id;
        const menuBody = req.body;

        Menu.findOneAndUpdate({ _id: menuID }, menuBody)
            .then(() => Menu.findById({ _id: menuID }))
            .then(menu => res.send(menu))
            .catch(next);
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    deleteMenu(req, res, next) {
        const menuID = req.body._id;

        Menu.findByIdAndDelete({ _id: menuID })
            .then(res.status(200).json({"message": "Successfully removed!"}))
            .catch(next);
    },
    
    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    addCategoryToMenu(req, res, next) {
        const menuID = req.body._id;
        const categoryID = req.body.categoryID;

        Menu.findOneAndUpdate({ _id: menuID }, { $addToSet: { category:  categoryID } })
            .then(() => Menu.findById({ _id: menuID }))
            .then(menu => res.send(menu))
            .catch(next);
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    removeCategoryToMenu(req, res, next) {
        const menuID = req.body._id;
        const categoryID = req.body.categoryID;

        Menu.findOneAndUpdate({ _id: menuID }, { $pull: { category: categoryID }})
            .then(() => Menu.findById({ _id: menuID }))
            .then(menu => res.send(menu))
            .catch(next);
    }
};