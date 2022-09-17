const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const Company = require('../models/Company');
const CompanyLogin = require('../models/CompanyLogin');
const bcrypt = require('bcryptjs');

const createCompany = async (req, res) => {
    // Creating the company
    const company = await Company.create({ ...req.body });
    // Creating company login credentials
    const login = await CompanyLogin.create({
        ...req.body,
        company_id: company._id,
    });
    res.json({ company, credentials: login });
};

const getSingleCompany = async (req, res) => {
    const company_id = req.params.id;
    const company = await Company.findOne({ _id: company_id });
    res.status(StatusCodes.OK).json({ company });
};

const getAllCompanies = async (req, res) => {
    const { name, sort } = req.query;
    const queryObject = {};
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' };
    }
    let result = Company.find(queryObject);
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const companies = await result;
    res.status(StatusCodes.OK).json({ companies });
};

const updateCompany = async (req, res) => {
    const company_id = req.user.company_id || req.body.company_id;
    if (!company_id) {
        throw new BadRequestError('company id not provided');
    }

    const company = await Company.findOneAndUpdate(
        { _id: company_id },
        req.body,
        { new: true, runValidators: true }
    );
    if (!company) {
        throw new NotFoundError(`No company found with id ${company_id}`);
    }
    res.status(StatusCodes.OK).json({ company });
};

const updatePassword = async (req, res) => {
    const company_id = req.user.company_id || req.body.company_id;
    if (!company_id) {
        throw new BadRequestError('company id not provided');
    }

    const { oldPassword, newPassword } = req.body;
    let user = await CompanyLogin.findOne({ company_id });
    console.log('user =>', user);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (isMatch) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        console.log('matched, hashedpass: ' + hashedPassword);
        user = await CompanyLogin.findOneAndUpdate(
            { company_id },
            { password: hashedPassword }
        );
        return res.status(StatusCodes.OK).json({ user });
    } else {
        return res.status(StatusCodes.UNAUTHORIZED).json({ user });
    }
};

const deleteCompany = async (req, res) => {
    const company_id =
        req.user.company_id || req.body.company_id || req.params.company_id;
    if (!company_id) {
        throw new BadRequestError('company id not provided');
    }

    const company = await Company.deleteOne({
        _id: company_id,
    });
    const companyLogin = await CompanyLogin.deleteOne({
        company_id,
    });

    if (!company) {
        throw new NotFoundError(`No company found with id ${company_id}`);
    }
    if (!companyLogin) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: 'there has been an error please contact us to solve it',
            error: 'company deleted but not from login collection',
        });
    }
    res.status(StatusCodes.OK).send();
};

module.exports = {
    getSingleCompany,
    getAllCompanies,
    updateCompany,
    createCompany,
    deleteCompany,
    updatePassword,
};
