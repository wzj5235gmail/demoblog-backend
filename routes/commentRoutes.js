const express = require('express');
const validateToken = require('../middlewares/validateTokenHandler');
const {
  createComment,
  deleteComment,
  getComments
} = require('../controllers/commentController');


const router = express.Router();
router.route('/').get(getComments).post(validateToken, createComment);
router.delete('/:commentId', validateToken, deleteComment);

module.exports = router;
