const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required.']
    },
    brand: {
        type: String,
        required: [true, 'Brand is required.']
    },
    description: {
        type: String,
        required: [true, 'Description is required.']
    },
    imagePath: {
        type: String,
        required: false
    },
    alcoholPercentage: {
        type: Number,
        required: false
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: false
    },
    price: {
        type: Number,
        required: [true, 'Price is required.']
    }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;