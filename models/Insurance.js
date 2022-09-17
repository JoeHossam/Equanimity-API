const mongoose = require('mongoose');
const Category = require('./Category');
const Review = require('./Review');
const Favourites = require('./Favourites');
const InsuranceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'please provide insurance title'],
        },
        category: {
            type: String,
            validate: async (v) => {
                let categories = await Category.find({}, { name: 1, _id: 0 });
                categories = categories.map((item) => item.name);
                return categories.includes(v);
            },
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'Company',
            required: [true, 'Please provide company'],
        },

        basePrice: {
            type: Number,
            required: [true, 'please provide a valid base price'],
        },
        baseFeatures: {
            type: [String],
        },
        features: {
            type: [{ name: String, price: Number }],
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'suspended'],
            default: 'pending',
        },
        hidden: {
            type: Boolean,
            default: false,
        },
        description: String,
    },
    { timestamps: true }
);

InsuranceSchema.post('deleteOne', async function () {
    await Review.deleteMany({
        insuranceId: this._conditions._id,
    });
    await Favourites.deleteMany({
        insuranceId: this._conditions._id,
    });
});

module.exports = mongoose.model('Insurance', InsuranceSchema);
