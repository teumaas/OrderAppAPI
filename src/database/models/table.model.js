const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TableSchema = new Schema({
    number: {
        type: Number,
        required: [true, 'TableNumber is required.']
    },
    user: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: false
    }],
}, { versionKey: false });

const Table = mongoose.model('Table', TableSchema);

module.exports = Table;