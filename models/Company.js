const mongoose = require('mongoose');
const Insurance = require('./Insurance');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide company name'],
    },
    phone: Number,
    address: String,
    email: {
        type: String,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
    },
    img: String,
});

CompanySchema.post('deleteOne', async function () {
    const inusrances = await Insurance.find({
        createdBy: this._conditions._id,
    });
    inusrances.forEach(async (ins) => {
        await Insurance.deleteOne(ins);
    });
});

module.exports = mongoose.model('Company', CompanySchema);
