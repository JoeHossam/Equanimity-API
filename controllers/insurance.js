const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/index');
const Insurance = require('../models/Insurance');

//CKECK FOR COMPANY ID HERE
const createInsurance = async (req, res) => {
    company_id = req.user.company_id || req.body.company_id;
    if (!company_id) {
        throw new BadRequestError('company id not provided');
    }
    console.log(req.body);
    const insurance = await Insurance.create({ ...req.body });
    res.status(StatusCodes.OK).json({ insurance });
};

// this function is mostly used for normal users
const getAllInsurance = async (req, res) => {
    const { title, company, category, numericFilters, sort, fields, limit } =
        req.query;
    const queryObject = {};
    queryObject.status = 'approved';
    queryObject.hidden = false;

    if (title) {
        queryObject.title = { $regex: title, $options: 'i' };
    }

    if (company) {
        queryObject.createdBy = { $in: company.split(',') };
    }

    if (category) {
        queryObject.category = { $in: category.split(',') };
    }

    //numericFilters=price<2000,rating>4
    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        );
        const options = ['basePrice', 'rating'];
        filters = filters.split(',').forEach((item) => {
            console.log(item);
            const [field, operator, value] = item.split('-');
            if (options.includes(field)) {
                if (queryObject[field]) {
                    const value2 = Object.values(queryObject).find(
                        (item) => item === queryObject[field]
                    );
                    queryObject[field] = {
                        ...value2,
                        [operator]: Number(value),
                    };
                } else {
                    queryObject[field] = { [operator]: Number(value) };
                }
            }
        });
    }

    let result = Insurance.find(queryObject);
    const count = await Insurance.count(queryObject);

    //sort
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('title');
    }

    if (fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList);
    }

    if (limit) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        result = result.skip(skip).limit(limit);
    }

    const insurances = await result;
    res.status(StatusCodes.OK).json({ insurances, count });
};

const getSingleInsurance = async (req, res) => {
    const insurnace_id = req.params.id;
    const insurance = await Insurance.findOne({
        _id: insurnace_id,
        status: 'approved',
        hidden: false,
    });
    res.status(StatusCodes.OK).json({ insurance });
};

// CHECK FOR COMPANY ID HERE
const updateInsurance = async (req, res) => {
    const {
        user: { company_id },
        params: { id: insurance_id },
    } = req;

    // company id should be stored on req.user if the request from a company and on req.body if it's admin
    if (!company_id) {
        throw new BadRequestError('company id not provided');
    }

    const insurnace = await Insurance.findOneAndUpdate(
        { _id: insurance_id, createdBy: company_id },
        { ...req.body, status: 'pending' },
        { new: true, runValidators: true }
    );
    if (!insurnace) {
        throw new NotFoundError(`No insurance found with id ${insurance_id}`);
    }
    res.status(StatusCodes.OK).json({ insurnace });
};

const toggleHideInsurance = async (req, res) => {
    const {
        user: { company_id },
        params: { id: insurance_id },
        body: { hidden },
    } = req;

    if (!company_id) {
        throw new BadRequestError('company id not provided');
    }

    const insurnace = await Insurance.findOneAndUpdate(
        { _id: insurance_id, createdBy: company_id },
        { hidden },
        { new: true, runValidators: true }
    );

    if (!insurnace) {
        throw new NotFoundError(`No insurance found with id ${insurance_id}`);
    }
    res.status(StatusCodes.OK).json({ insurnace });
};

// CHECK FOR COMPANY ID HERE
const deleteInsurance = async (req, res) => {
    const {
        params: { id: insuranceId },
    } = req;

    const company_id = req.user.company_id || req.body.company_id;

    if (!company_id) {
        throw new BadRequestError('company id not provided');
    }

    const insurance = await Insurance.deleteOne({
        _id: insuranceId,
        createdBy: company_id,
    });

    if (!insurance) {
        throw new NotFoundError(`No Insurance found with id ${insuranceId}`);
    }
    res.status(StatusCodes.OK).send();
};

const getCompanyInsurances = async (req, res) => {
    const company_id = req.params.id;
    if (!company_id) {
        throw new BadRequestError('company id not provided');
    }
    const queryObject = { createdBy: company_id };

    // Extra level of security to prevent companies from viewing other companies' (hidden-pending) insurances
    if (req.user.company_id != company_id) {
        console.log('not the same company bro');
        queryObject.status = 'approved';
        queryObject.hidden = false;
    }
    const insurances = await Insurance.find(queryObject);
    res.status(StatusCodes.OK).json({ insurances });
};

const getUnapprovedInsurances = async (req, res) => {
    const insurances = await Insurance.find({ status: 'pending' });
    res.status(StatusCodes.OK).json({ insurances });
};
const approveInsurance = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new BadRequestError('company id not provided');
    }
    const newInsurance = await Insurance.findOneAndUpdate(
        { _id: id },
        { status: 'approved' },
        { new: true, runValidators: true }
    );

    res.status(StatusCodes.OK).json({ newInsurance });
};

const suspendInsurance = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new BadRequestError('company id not provided');
    }
    const newInsurance = await Insurance.findOneAndUpdate(
        { _id: id },
        { status: 'suspended' },
        { new: true, runValidators: true }
    );
    res.status(StatusCodes.OK).json({ newInsurance });
};

const unsuspendInsurance = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new BadRequestError('company id not provided');
    }
    const newInsurance = await Insurance.findOneAndUpdate(
        { _id: id },
        { status: 'approved' },
        { new: true, runValidators: true }
    );
    res.status(StatusCodes.OK).json({ newInsurance });
};

const getAdminInsurances = async (req, res) => {
    const insurances = await Insurance.find({});
    res.status(StatusCodes.OK).json({ insurances });
};

module.exports = {
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
};
