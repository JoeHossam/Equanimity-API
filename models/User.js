const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Review = require('./Review');
const Favourites = require('./Favourites');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        maxlength: [50, 'Name cannot be longer than 50 characters'],
        minlength: [3, 'Name cannot be shorter than 3 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: [6, 'Password must be at least six characters'],
    },
    img: {
        type: String,
    },
    provider: {
        type: String,
        default: 'local',
    },
    age: Number,
    phone: {
        type: Number,
        unique: true,
    },
});

UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.pre('deleteOne', async function () {
    const reviews = await Review.find({ userId: this._id });
    reviews.forEach(async (ins) => {
        await Review.deleteOne(ins);
    });
    const favs = await Favourites.find({ userId: this._id });
    favs.forEach(async (ins) => {
        await Favourites.deleteOne(ins);
    });
});

module.exports = mongoose.model('User', UserSchema);
