const express = require('express');
const validateToken = require('../middlewares/validateTokenHandler');
const {
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  getArticles,
  incrementLikes
} = require('../controllers/articleController')

const router = express.Router();
router.route('/').post(validateToken, createArticle).get(getArticles);
router.route('/:articleId').get(getArticleById).put(validateToken, updateArticle).delete(validateToken, deleteArticle);
router.post('/:articleId/like', incrementLikes);

module.exports = router;
