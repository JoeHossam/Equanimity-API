const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        subject: String,
        msg: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model('Contact', ContactSchema);
