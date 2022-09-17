const express = require('express');
const {
    companyAuthenticated,
    adminAuthenticated,
} = require('../middlwares/authentication');

const {
    createInsurance,
    getAllInsurance,
    getSingleInsurance,
    updateInsurance,
    toggleHideInsurance,
    deleteInsurance,
    getCompanyInsurances,
    getUnapprovedInsurances,
    approveInsurance,
    suspendInsurance,
    unsuspendInsurance,
    getAdminInsurances,
} = require('../controllers/insurance');

const router = express.Router();

// PUBLIC ROUTES
router.get('/', getAllInsurance);
router.get('/:id', getSingleInsurance);

// COMPANY PROTECTED
router.get('/company/:id', getCompanyInsurances); //show companies their pending, suspended insurances
router.post('/', companyAuthenticated, createInsurance);
router.patch('/:id', companyAuthenticated, updateInsurance);
router.patch('/:id/toggleHide', companyAuthenticated, toggleHideInsurance);
router.delete('/:id', companyAuthenticated, deleteInsurance);

// ADMIN PROTECTED
router.get('/admin/all', adminAuthenticated, getAdminInsurances);
router.get('/admin/unapproved', adminAuthenticated, getUnapprovedInsurances);
router.patch('/approve/:id', adminAuthenticated, approveInsurance);
router.patch('/suspend/:id', adminAuthenticated, suspendInsurance);
router.patch('/unsuspend/:id', adminAuthenticated, unsuspendInsurance);

module.exports = router;
