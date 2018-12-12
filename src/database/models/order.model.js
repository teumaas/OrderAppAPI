const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    product: [{
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: [true, 'Products is required.']
    }],
    table: {
        type: Schema.Types.ObjectId,
        ref: 'table',
        required: [true, 'Table is required.']
    }
}, { versionKey: false });

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;