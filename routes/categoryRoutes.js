const express = require('express');
const validateToken = require('../middlewares/validateTokenHandler');
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getAllCategories,
} = require('../controllers/categoryController')

const router = express.Router();

router.route('/').get(getAllCategories).post(validateToken, createCategory);
router.route('/:categoryId').get(getCategoryById).put(validateToken, updateCategory).delete(validateToken, deleteCategory);

module.exports = router;