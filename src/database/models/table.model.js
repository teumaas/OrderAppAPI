const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TableSchema = new Schema({
    tableNumber: {
        type: Number,
        required: [true, 'TableNumber is required.']
    },
    user: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: false
    }],
});

const Table = mongoose.model('Table', TableSchema);

module.exports = Table;