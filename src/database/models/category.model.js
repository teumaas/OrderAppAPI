const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required.']
    },
    product: [{
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: false
    }],
    imagePath: {
        type: String,
        required: false
    }
}, { versionKey: false });

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;