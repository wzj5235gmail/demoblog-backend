const asyncHandler = require('express-async-handler');
const Tag = require('../models/tagModel');



// @desc    Get all tags
// @route   GET /tags
// @access  Public
const getAllTags = asyncHandler(async (req, res) => {
  const tags = await Tag.find();
  res.status(200).json(tags);
});



// @desc    Get a single tag
// @route   GET /tags/:id
// @access  Public
const getTagById = asyncHandler(async (req, res) => {
  const tag = await Tag.findById(req.params.id);
  if (tag) {
    res.status(200).json(tag);
  } else {
    res.status(404).json({ message: 'Tag not found' });
    throw new Error('Tag not found');
  }
});



// @desc    Create a tag
// @route   POST /tags
// @access  Public
const createTag = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const tag = await Tag.findOne({ name });
  if (tag) {
    res.status(400).json({ message: 'Tag already exists' });
    throw new Error('Tag already exists');
  } else {
    const newTag = await Tag.create({ name });
    res.status(201).json({ newTag });
  }
});



module.exports = {
  getAllTags,
  getTagById,
  createTag
};
