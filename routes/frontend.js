const express = require('express');
const { StatusCodes } = require('http-status-codes');
const Category = require('../models/Category');
const Company = require('../models/Company');
const Insurance = require('../models/Insurance');
const router = express.Router();

router.get('/home', async (req, res) => {
    const insurancesCount = await Insurance.count({
        status: 'approved',
        hidden: false,
    });
    const categoriesCount = await Category.count({});
    const companiesCount = await Company.count({});
    res.status(StatusCodes.OK).json({
        insurancesCount,
        categoriesCount,
        companiesCount,
    });
});

router.get('/companies', async (req, res) => {
    const companies = await Company.find({}, { name: 1, img: 1, _id: 1 });
    res.status(StatusCodes.OK).json({ companies });
});

module.exports = router;
