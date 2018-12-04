const ApiError = require('../utilities/APIError.utility');
const User = require('../database/models/user.model');

module.exports = {

    //CRUD Thread - Start

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    userLogin(req, res, next) { 
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    userRegister (req, res, next) {
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    userCurrent(req, res, next) {

    }
};