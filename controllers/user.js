const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../errors');
const Favourites = require('../models/Favourites');
const OAuthUser = require('../models/OAuthUser');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const updateUser = async (req, res) => {
    const userId = req.user.id;
    let user, model;
    if (req.user.provider === 'facebook' || req.user.provider === 'google') {
        model = OAuthUser;
    } else if (req.user.provider === 'local') {
        model = User;
    }

    user = await model.findById(userId);
    if (!user) {
        throw new NotFoundError(`no user with id ${userId}`);
    }

    const newUser = await model.findByIdAndUpdate(
        userId,
        { ...req.body },
        { new: true, runValidators: true }
    );

    res.status(StatusCodes.OK).json({ newUser });
};
const updatePassword = async (req, res) => {
    const userId = req.user.id;

    const { oldPassword, newPassword } = req.body;
    let user = await User.findById(userId);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (isMatch) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        console.log('matched, hashedpass: ' + hashedPassword);
        user = await User.findOneAndUpdate(
            { _id: userId },
            { password: hashedPassword }
        );
        return res.status(StatusCodes.OK).json({ user });
    } else {
        return res.status(StatusCodes.UNAUTHORIZED).json({ user });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.user.id;
    let user, model;
    if (req.user.provider === 'facebook' || req.user.provider === 'google') {
        model = OAuthUser;
    } else if (req.user.provider === 'local') {
        model = User;
    }

    user = await model.findById(userId);
    if (!user) {
        throw new NotFoundError(`no user with id ${userId}`);
    }

    const deletedUser = await model.deleteOne({ _id: userId });
    res.status(StatusCodes.OK).json({ deletedUser });
};

const getAllUsers = async (req, res) => {
    const users = await User.find({});
    const authUsers = await OAuthUser.find({});
    res.status(StatusCodes.OK).json({ users, authUsers });
};

const getSingleUser = async (req, res) => {
    const userId = req.params.id;

    const model = req.params.provider === 'User' ? User : OAuthUser;
    const user = await model.findById(userId);

    res.status(StatusCodes.OK).json({ user });
};

const isFavourite = async (req, res) => {
    const { insurance } = req.query;
    const count = await Favourites.find({ insuranceId: insurance });

    if (!req.user) {
        return res.status(StatusCodes.OK).json({ count: count.length });
    }
    const user = req.user._id;

    const result = await Favourites.findOne({
        userId: user,
        insuranceId: insurance,
    }).lean();
    if (result) {
        return res
            .status(StatusCodes.OK)
            .json({ isFavourite: true, count: count.length });
    } else {
        return res
            .status(StatusCodes.OK)
            .json({ isFavourite: false, count: count.length });
    }
};

const toggleFavourite = async (req, res) => {
    const { user, insurance, favouriting, userType } = req.body;
    console.log(user, insurance, favouriting, userType);
    if (favouriting) {
        await Favourites.create({
            userId: user,
            insuranceId: insurance,
            user_type: userType,
        });
        console.log(user, insurance, favouriting, userType);
    } else {
        await Favourites.findOneAndDelete({
            userId: user,
            insuranceId: insurance,
        });
    }

    res.status(StatusCodes.OK).json({ msg: favouriting });
};

const getFavourite = async (req, res) => {
    const { id } = req.user;
    const favourites = await Favourites.find({
        userId: id,
    }).lean();
    res.status(StatusCodes.OK).json({ favourites });
};

module.exports = {
    updateUser,
    deleteUser,
    getAllUsers,
    getSingleUser,
    isFavourite,
    toggleFavourite,
    updatePassword,
    getFavourite,
};
