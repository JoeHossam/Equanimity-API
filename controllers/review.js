const Review = require('../models/Review');
const Insurance = require('../models/Insurance');
const { BadRequestError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const updateInsuranceRatings = async (insuranceId) => {
    let updatedInsurance;
    let ratings = await Review.find({ insuranceId }, { rating: 1, _id: 0 });
    ratings = ratings.map((item) => item.rating);

    if (ratings.length === 0) {
        updatedInsurance = await Insurance.findByIdAndUpdate(
            insuranceId,
            {
                rating: 0,
                reviewCount: 0,
            },
            { new: true }
        );
    }

    const sum = ratings.reduce((a, b) => a + b, 0);
    const avg = sum / ratings.length || 0;

    try {
        updatedInsurance = await Insurance.findByIdAndUpdate(
            insuranceId,
            {
                rating: avg,
                reviewCount: ratings.length,
            },
            { new: true }
        );
    } catch (e) {
        return;
    }
    return updatedInsurance;
};

const getReviews = async (req, res) => {
    const insuranceId = req.params.id;
    const reviews = await Review.find({ insuranceId });
    res.status(StatusCodes.OK).json({ reviews });
};
const createReview = async (req, res) => {
    const userId = req.user.id;
    const insuranceId = req.params.id;
    const { rating, comment } = req.body;

    if (!userId || !insuranceId || !rating) {
        throw new BadRequestError(
            'Please provide userId, insuranceId and a valid rating'
        );
    }

    let user_type;

    if (req.user.provider === 'local') {
        user_type = 'User';
    } else if (
        req.user.provider === 'google' ||
        req.user.provider === 'facebook'
    ) {
        user_type = 'OAuthUser';
    }

    const review = await Review.create({
        user_type,
        userId,
        insuranceId,
        rating,
        comment,
    });

    const updatedInsurance = updateInsuranceRatings(insuranceId);

    res.status(StatusCodes.CREATED).json({ review, updatedInsurance });
};

const updateReview = async (req, res) => {
    const reviewId = req.params.id;
    console.log(req.body);
    const updatedReview = await Review.findOneAndUpdate(
        { _id: reviewId, userId: req.user.id },
        { ...req.body },
        { runValidators: true, new: true }
    );
    const updatedInsurance = updateInsuranceRatings(updatedReview.insuranceId);
    res.status(StatusCodes.OK).json({ updatedReview, updatedInsurance });
};

const deleteReview = async (req, res) => {
    const reviewId = req.params.id;
    const deletedReview = await Review.findOneAndDelete({
        _id: reviewId,
    });
    const updatedInsurance = updateInsuranceRatings(deletedReview.insuranceId);
    res.status(StatusCodes.OK).json({ deletedReview, updatedInsurance });
};

const getUserReview = async (req, res) => {
    const userId = req.params.id;
    const reviews = await Review.find({ userId });
    res.status(StatusCodes.OK).json({ reviews });
};

const getAllReviews = async (req, res) => {
    const reviews = await Review.find({}).sort('-createdAt');
    res.status(StatusCodes.OK).json({ reviews });
};

module.exports = {
    getReviews,
    createReview,
    updateReview,
    deleteReview,
    getUserReview,
    getAllReviews,
};
