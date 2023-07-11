const Article = require('../models/articleModel');
const Comment = require('../models/commentModel');
const asyncHandler = require('express-async-handler');
const { constants } = require('../constants');



//@desc     Create a new article
//@route    POST /api/articles/
//@access   private
const createArticle = asyncHandler(async (req, res) => {
  const { title, content, categoryId, tagIds } = req.body;
  if (title === '' || content === '' || categoryId === '' || tagIds.length === 0) {
    res.status(constants.VALIDATION_ERROR).json({ error: 'All fields are mandatory!' });
    throw new Error('All fields are mandatory!');
  }
  const authorId = req.user.id;
  const article = await Article.create({
    title,
    content,
    author: authorId,
    category: categoryId,
    tags: tagIds
  });
  res.status(201).json({ article });
});



//@desc     Find an article by ID
//@route    GET /api/articles/:articleId
//@access   public
const getArticleById = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const article = await Article.findById(articleId)
    .populate('author', 'username')
    .populate('category', 'name')
    .populate('tags', 'name');
  if (!article) {
    res.status(404).json({ error: 'Article not found' });
    throw new Error('Article not found');
  }
  const comments = await Comment.find({ article: articleId })
    .populate('author', 'username');
  article.views++;
  await article.save();
  res.json({ article: {...article._doc, comments} });
});



//@desc     Update an article by ID
//@route    PUT /api/articles/:articleId
//@access   private
const updateArticle = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const { title, content, categoryId, tagIds } = req.body;
  if (title === '' || content === '' || categoryId === '' || tagIds.length === 0) {
    res.status(constants.VALIDATION_ERROR).json({ error: 'All fields are mandatory!' });
    throw new Error('All fields are mandatory!');
  }
  const article = await Article.findById(articleId);
  if (!article) {
    return res.status(constants.NOT_FOUND);
  }
  if (!req.user.isAdmin && req.user.id !== article.author.toString()) {
    res.status(401).json({ error: 'Unauthorized to update this article' });
    throw new Error("Cannot update other user's article!");
  }
  article.title = title;
  article.content = content;
  article.category = categoryId;
  article.tags = tagIds;
  await article.save();
  res.json({ article });
});



//@desc     Delete an article by ID
//@route    DELETE /api/articles/:articleId
//@access   private
const deleteArticle = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const article = await Article.findById(articleId);
  if (!article) {
    res.status(404).json({ error: 'Article not found' });
    throw new Error('Article not found');
  }
  if (!req.user.isAdmin && req.user.id !== article.author.toString()) {
    res.status(constants.UNAUTHORIZED);
    throw new Error("Cannot delete other user's article!");
  }
  await Article.findByIdAndDelete(articleId);
  res.json({ message: 'Article deleted successfully' });
});



//@desc     GET all articles
//@route    GET /api/articles/
//@access   public
const getArticles = asyncHandler(async (req, res) => {
  const { userId, tagId, categoryId, searchTerm, page, limit } = req.query;
  let articlesUserId = [];
  let articlesTagId = [];
  let articlesCategoryId = [];
  let articlesSearchTerm = [];
  let articles = [];

  // Define the pagination options
  const paginationOptions = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    sort: { createdAt: -1 },
    populate: { path: 'author', select: 'username' },
  };

  if (userId) {
    articlesUserId = await Article.paginate({ author: userId }, paginationOptions);
    articles = articles.concat(articlesUserId.docs);
  }
  if (categoryId) {
    articlesCategoryId = await Article.paginate({ category: categoryId }, paginationOptions);
    articles = articles.concat(articlesCategoryId.docs);
  }
  if (tagId) {
    articlesTagId = await Article.paginate({ tags: tagId }, paginationOptions);
    articles = articles.concat(articlesTagId.docs);
  }
  if (searchTerm) {
    articlesSearchTerm = await Article.paginate({ content: { $regex: new RegExp(`${searchTerm}`, 'i') } }, paginationOptions);
    articles = articles.concat(articlesSearchTerm.docs);
  }

  // If no query parameters provided, return all articles
  if (!userId && !categoryId && !tagId && !searchTerm) {
    const allArticles = await Article.paginate({}, paginationOptions);
    articles = allArticles.docs;
  }

  res.json(articles);
});



//@desc     Increment article likes
//@route    post /api/articles/:articleId/like
//@access   public
const incrementLikes = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const article = await Article.findById(articleId);
  if (!article) {
    res.status(404).json({ error: 'Article not found' });
    throw new Error('Article not found');
  }
  article.likes++;
  await article.save();
  res.json({ article });
})



module.exports = {
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  getArticles,
  incrementLikes
}