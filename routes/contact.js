const express = require('express');
const { StatusCodes } = require('http-status-codes');
const { adminAuthenticated } = require('../middlwares/authentication');
const Contact = require('../models/Contact');

const router = express.Router();

// ADMIN PROTECTED
router.get('/', adminAuthenticated, async (req, res) => {
    const contacts = await Contact.find({}).sort('-createdAt');
    res.status(StatusCodes.OK).json({ contacts });
});

// PUBLIC ROUTE
router.post('/', async (req, res) => {
    const contact = await Contact.create(req.body);
    res.status(StatusCodes.OK).json({ contact });
});

module.exports = router;
