const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel'); // Replace the path with the actual path to your category model



// @desc    Create a new article category
// @route   POST /api/categories
// @access  Private
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const author = req.user.id;
  const category = await Category.create({ name, author });
  res.status(201).json({ category });
});



// @desc    Update an article category
// @route   PUT /api/categories/:categoryId
// @access  Private
const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;
  const userId = req.user.id;
  const category = await Category.findById(categoryId);
  if (!category) {
    res.status(404).json({ error: 'Category not found' });
  } else if (category.author.toString() !== userId) {
    res.status(401).json({ error: 'Unauthorized to update this category' });
  } else {
    category.name = name;
    await category.save();
    res.json({ category });
  }
});



// @desc    Delete an article category
// @route   DELETE /api/categories/:categoryId
// @access  Private
const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const userId = req.user.id;
  const category = await Category.findById(categoryId);
  if (!category) {
    res.status(404).json({ error: 'Category not found' });
  } else if (category.author.toString() !== userId) {
    res.status(401).json({ error: 'Unauthorized to delete this category' });
  } else {
    await Category.findByIdAndDelete(categoryId);
    res.json({ message: 'Category deleted successfully' });
  }
});



// @desc    Get an article category by ID
// @route   GET /api/categories/:categoryId
// @access  Private
const getCategoryById = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const userId = req.user.id;
  const category = await Category.findById(categoryId);
  if (!category) {
    res.status(404).json({ error: 'Category not found' });
  } else if (category.author.toString() !== userId) {
    res.status(401).json({ error: 'Unauthorized to access this category' });
  } else {
    res.json({ category });
  }
});



// @desc    Get all article categories
// @route   GET /api/categories
// @access  Private
const getAllCategories = asyncHandler(async (req, res) => {
  // const userId = req.user;
  // const categories = await Category.find({ author: userId });
  const categories = await Category.find();
  res.json({ categories });
});



module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getAllCategories,
};
