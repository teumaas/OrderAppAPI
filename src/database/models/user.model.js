const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const key = require('../../config/config');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: {
        type: String,
        required: [true, 'Firstname is required.']
    },
    lastname: {
        type: String,
        required: [true, 'Lastname is required.']
    },
    email: {
        type: String,
        required: [true, 'E-mail is required.'],
        unique : true
    },
    hash: String,
    salt: String
});

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  };
  
UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJwt = function() {
var expiry = new Date();
expiry.setDate(expiry.getDate() + 7);

return jwt.sign({
    _id: this._id,
    fistname: this.fistname,
    lastname: this.lastname,
    email: this.email,
    exp: parseInt(expiry.getTime() / 1000), }, key.secret);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;