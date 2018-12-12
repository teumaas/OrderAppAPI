const ApiError = require('../utilities/APIError.utility');
const passport = require('passport');
const User = require('../database/models/user.model');
const assert = require('assert');

module.exports = {

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    userLogin(req, res, next) {
        passport.authenticate('local', function(err, user, info){
            let token;
 
            if (err) {
              res.status(404).json(err);
              return;
            }
            if(user){
              token = user.generateJwt();
              res.status(200);
              res.json({
                "token" : token,
                "firstname" : user.firstname,
                "lastname" : user.lastname,
                "email" : user.email
              });
            } else {
              res.status(401).json(info);
            }
        })(req, res);
    },

    /**
     * @param {*} req The incoming request.
     * @param {*} res The resource.
     * @param {*} next ApiError when id is invalid.
     */

    userRegister(req, res, next) {
        const user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email
        });
        
        user.setPassword(req.body.password);

        user.save()
        .then(user => res.status(200).send({"token" : user.generateJwt()}))
        .catch(next);
    },

    userLoggedIn(req, res, next) {
        if (!req.payload._id) {
            res.status(401).json({
              "message" : "UnauthorizedError: private profile"
            });
          } else {
            User
              .findById(req.payload._id)
              .exec(function(err, user) {
                res.status(200).json(user);
              });
        }
    }
};