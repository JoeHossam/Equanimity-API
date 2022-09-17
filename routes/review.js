const express = require('express');
const {
    getReviews,
    createReview,
    updateReview,
    deleteReview,
    getUserReview,
    getAllReviews,
} = require('../controllers/review');
const {
    authenticationMiddleware,
    adminAuthenticated,
} = require('../middlwares/authentication');
const router = express.Router();

router.get('/:id', getReviews);
router.get('/user/:id', getUserReview);

// USER PROTECTED
router.post('/:id', authenticationMiddleware, createReview);
router.patch('/:id', authenticationMiddleware, updateReview);
router.delete('/:id', authenticationMiddleware, deleteReview);

// ADMIN PROTECTED
router.get('/', adminAuthenticated, getAllReviews);

module.exports = router;
