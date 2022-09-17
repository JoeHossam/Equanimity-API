const express = require('express');
const { adminAuthenticated } = require('../middlwares/authentication');
const {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
} = require('../controllers/category');
const router = express.Router();

// PUBLIC ROUTE
router.get('/', getAllCategories);

// ADMIN PROTECTED
router.post('/', adminAuthenticated, createCategory);
router.patch('/:id', adminAuthenticated, updateCategory);
router.delete('/:id', adminAuthenticated, deleteCategory);

module.exports = router;
