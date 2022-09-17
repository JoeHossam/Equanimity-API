const mongoose = require('mongoose');

const OAuthUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
    },
    authId: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    provider: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('OAuthUser', OAuthUserSchema);
