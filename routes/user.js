const express = require('express');
const {
    authenticationMiddleware,
    adminAuthenticated,
} = require('../middlwares/authentication');
const {
    updateUser,
    deleteUser,
    getAllUsers,
    getSingleUser,
    isFavourite,
    toggleFavourite,
    updatePassword,
    getFavourite,
} = require('../controllers/user');
const router = express.Router();

//PUBLIC ROUTES
router.get('/:provider/:id', getSingleUser);
router.get('/isfavourite', isFavourite);
// USER PROTECTED
router.post('/favourite/toggle', authenticationMiddleware, toggleFavourite);
router.get('/favourite', authenticationMiddleware, getFavourite);
router.patch('/', authenticationMiddleware, updateUser);
router.patch('/password', authenticationMiddleware, updatePassword);
router.delete('/', authenticationMiddleware, deleteUser);

// ADMIN PROTECTED
router.get('/', adminAuthenticated, getAllUsers);

module.exports = router;
