const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required.']
    },
    Product: [{
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: false
    }],
    imagePath: {
        type: String,
        required: false
    }
});

const Category = mongoose.model('category', CategorySchema);

module.exports = Category;