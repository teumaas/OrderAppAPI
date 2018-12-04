const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fistname: {
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
    password: {
        type: String,
        required: true,
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;