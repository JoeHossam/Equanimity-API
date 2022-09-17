const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide category name'],
    },
});

module.exports = mongoose.model('Category', CategorySchema);
