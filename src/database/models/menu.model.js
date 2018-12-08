const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MenuSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Name is required.']
    },
    category: [{
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: false
    }],
}, { versionKey: false });

const Menu = mongoose.model('Menu', MenuSchema);

module.exports = Menu;