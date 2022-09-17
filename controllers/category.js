const { StatusCodes } = require('http-status-codes');
const Category = require('../models/Category');

const createCategory = async (req, res) => {
    const category = await Category.create({ ...req.body });
    res.status(StatusCodes.CREATED).json({ category });
};

const getAllCategories = async (req, res) => {
    const categories = await Category.find({}, { name: 1, _id: 1 });
    res.status(StatusCodes.OK).json({ categories });
};

const updateCategory = async (req, res) => {
    const id = req.params.id;
    const category = await Category.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true, runValidators: true }
    );
    res.status(StatusCodes.OK).json({ category });
};

const deleteCategory = async (req, res) => {
    const id = req.params.id;
    const deletedCat = await Category.findByIdAndDelete(id);
    req.status(StatusCodes.OK).json({ deletedCat });
};

module.exports = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
};
