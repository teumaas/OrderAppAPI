const mongoose = require('mongoose');
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
        required: [true, 'E-mail is required.']
    },
    password: {
        type: String,
        required: [true, 'Password is required.']
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;