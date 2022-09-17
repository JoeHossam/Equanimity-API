const express = require('express');
const {
    authenticationMiddleware,
    adminAuthenticated,
    companyAuthenticated,
} = require('../middlwares/authentication');
const {
    addPayment,
    getUserPayment,
    getCompanyPayment,
    getAllPayment,
} = require('../controllers/payment');
const router = express.Router();

// USER PROTECTED
router.post('/', authenticationMiddleware, addPayment);
router.get('/user', authenticationMiddleware, getUserPayment);

// COMPANY PROTECTED
router.get('/company', companyAuthenticated, getCompanyPayment);

// ADMIN PROTECTED
router.get('/', adminAuthenticated, getAllPayment);

module.exports = router;
