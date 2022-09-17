const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            refPath: 'user_type',
            required: [true, 'please provide user id'],
        },
        insuranceId: {
            type: mongoose.Types.ObjectId,
            ref: 'Insurance',
            required: [true, 'please provide insurance id'],
        },
        companyId: {
            type: mongoose.Types.ObjectId,
            ref: 'Company',
            required: [true, 'please provide insurance id'],
        },
        companyName: String,
        insuranceName: String,
        phone: Number,
        features: {
            type: [{ name: String, price: Number }],
        },
        totalPrice: {
            type: Number,
            required: [true, 'please provide total price'],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Payment', PaymentSchema);
