const express = require("express");
const { protect, admin } = require("../middleware/Auth");
const { getAllCategories, createCategory, updateCategory, deleteCategory } = require("../Controllers/CategoriesController");
const router = express.Router();

// ******** PUBLIC ROUTES ********

router.get("/", getAllCategories);

// ******** ADMIN ROUTES ********
router.post("/", protect, admin, createCategory);
router.put("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;
