const { StatusCodes } = require('http-status-codes');
const Payment = require('../models/Payment');

const addPayment = async (req, res) => {
    const payment = await Payment.create({ ...req.body });
    res.status(StatusCodes.OK).json({ payment });
};
const getUserPayment = async (req, res) => {
    const userId = req.user.id;
    const payments = await Payment.find({ userId });
    res.status(StatusCodes.OK).json({ payments });
};
const getCompanyPayment = async (req, res) => {
    const companyId = req.user.company_id;
    const payments = await Payment.find({ companyId });
    res.status(StatusCodes.OK).json({ payments });
};
const getAllPayment = async (req, res) => {
    const payments = await Payment.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
                pipeline: [{ $project: { name: 1 } }],
            },
        },
        {
            $project: {
                _id: 1,
                insuranceId: 1,
                companyId: 1,
                insuranceName: 1,
                user: 1,
                companyName: 1,
                phone: 1,
                totalPrice: 1,
                createdAt: 1,
                features: 1,
            },
        },
    ]);
    console.log(payments);
    res.status(StatusCodes.OK).json({ payments });
};

module.exports = {
    addPayment,
    getUserPayment,
    getCompanyPayment,
    getAllPayment,
};
