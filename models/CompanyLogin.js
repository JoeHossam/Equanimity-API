const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const CompanyLoginSchema = new mongoose.Schema({
    username: String,
    password: String,
    company_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Please provide company_id'],
    },
});

CompanyLoginSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('CompanyLogin', CompanyLoginSchema);
