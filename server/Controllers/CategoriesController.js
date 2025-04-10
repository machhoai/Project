const Categories = require("../Models/CategoriesModel");
const asyncHandler = require("express-async-handler");

// ******** PUBLIC CONTROLLER ********

// lấy tất cả categories
// GET /api/categories/
const getAllCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Categories.find({});
        res.status(201).json(categories);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ******** ADMIN CONTROLLER ********

// tạo categories
// POST /api/categories
const createCategory = asyncHandler(async (req, res) => {
    try {
        const { title } = req.body;
        const category = new Categories({
            title,
        })
        const createdCategory = await category.save();
        res.status(201).json(createdCategory);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

// update categories
// PUT /api/categories/:id
const updateCategory = asyncHandler(async (req, res) => {
    try {
        const category = await Categories.findById(req.params.id);
        if (category) {
            category.title = req.body.title || category.title
            const updatedCategory = await category.save();
            res.json(updatedCategory);
        } else {
            res.status(404);
            throw new Error({ message: "Category not found" })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

// delete categories
// DELETE /api/categories/:id
const deleteCategory = asyncHandler(async (req, res) => {
    try {
        const category = await Categories.findById(req.params.id);
        if (category) {
            await category.deleteOne();
            res.status(201).json("Removed category complete")
        } else {
            res.status(404).json("Category not found");
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory }