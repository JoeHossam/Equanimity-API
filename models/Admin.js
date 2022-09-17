const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    username: String,
    password: String,
    provider: {
        type: String,
        default: 'admin',
    },
});

module.exports = mongoose.model('Admin', AdminSchema);
