const express = require('express');
const validateToken = require('../middlewares/validateTokenHandler');

const {
  getAllTags,
  getTagById,
  createTag
} = require('../controllers/tagController')

const router = express.Router();

router.route('/').get(getAllTags).post(validateToken, createTag);
router.route('/:id').get(getTagById);

module.exports = router;