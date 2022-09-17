const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user_type: {
        type: String,
        required: true,
    },
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
    rating: {
        type: Number,
        required: [true, 'please provide a valid rating'],
        min: 0,
        max: 5,
    },
    comment: {
        type: String,
        min: 4,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

ReviewSchema.index({ userId: 1, insuranceId: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
