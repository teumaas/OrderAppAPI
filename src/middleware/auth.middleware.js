const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const ApiError = require('../utilities/APIError.utility');

const User = require('../database/models/user.model');

passport.use('register', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, 

  async (email, password, done) => {
      try {
        const user = await User.create({ email, password });
        return done(null, user);
      } catch (error) {
        error = new ApiError('An Error occured', 404);
        return done(error);
      }
  }));

passport.use('login', new localStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },

    async(email, password, done) => {
        try {
            const user = await User.findOne({
                email
            });
            if (!user) {
                return done(null, false, {
                    message: 'User not found'
                });
            }

            const validate = await user.isValidPassword(password);
            if (!validate) {
                return done(null, false, {
                    message: 'Wrong Password'
                });
            }

            return done(null, user, {
                message: 'Logged in Successfully'
            });
        } catch (error) {
            return done(error);
        }
    })
);

passport.use(new JWTStrategy({
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'cafd5b5b8c31ceb6ccf6b9ed578fa001'
  }, async (token, done) => {
    try {
      return done(null, token.user);
    } catch (error) {
      done(error);
    }
  }
));