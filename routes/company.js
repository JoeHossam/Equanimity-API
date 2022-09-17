const express = require('express');
const {
    companyAuthenticated,
    adminAuthenticated,
} = require('../middlwares/authentication');

const router = express.Router();

const {
    getAllCompanies,
    getSingleCompany,
    updateCompany,
    createCompany,
    deleteCompany,
    updatePassword,
} = require('../controllers/company');

// PUBLIC ROUTES
router.get('/', getAllCompanies);
router.get('/:id', getSingleCompany);

// COMPANY PROTECTED
router.patch('/:id', companyAuthenticated, updateCompany);
router.patch('/:id/password', companyAuthenticated, updatePassword);
router.delete('/:id', companyAuthenticated, deleteCompany);

// ADMIN PROTECTED
router.post('/', adminAuthenticated, createCompany);

module.exports = router;
