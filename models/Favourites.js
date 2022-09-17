const mongoose = require('mongoose');

const FavouritesSchema = new mongoose.Schema({
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
});

FavouritesSchema.index({ userId: 1, insuranceId: 1 }, { unique: true });

module.exports = mongoose.model('Favourites', FavouritesSchema);
