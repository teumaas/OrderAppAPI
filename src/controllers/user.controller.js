const ApiError = require('../utilities/APIError.utility');
const User = require('../database/models/user.model');
const jwt = require('jsonwebtoken');
const passport = require('passport');

module.exports = {
    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    userLogin(req, res, next) {
        passport.authenticate('login', async (err, user, info) => {     
            try {
                if (err || !user) {
                    const error = new ApiError('An Error occured', 404)
                    return next(error);
                }

                req.login(user, { session : false }, async (error) => {
                    if(error) {
                        return next(error)
                    }
                    const body = { _id : user._id, email : user.email };
                    const token = jwt.sign({ user : body },'token');
                    
                    return res.json({ token });
                });

            } catch (error) {
            return next(error);
          }
        })(req, res, next);
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    async userRegister (req, res, next) {
        res.json({ 
            message : 'Register successful',
        });
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    userCurrent(req, res, next) {
        res.json({
            message : 'You made it to the secure route',
            user : req.user
          })
    }
};