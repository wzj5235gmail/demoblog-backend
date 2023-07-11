const asyncHander = require('express-async-handler');
const Comment = require('../models/commentModel');
const Article = require('../models/articleModel');



//@desc     Create a comment
//@route    POST /api/comments/
//@accesss  Private
const createComment = asyncHander(async (req, res) => {
  const { content, articleId, isReply, replyToId } = req.body;
  const authorId = req.user.id;
  const comment = await Comment.create({
    content,
    author: authorId,
    article: articleId,
    isReply,
    replyTo: replyToId
  });
  res.status(201).json({ comment });
})



//@desc     Delete a comment
//@route    DELETE /api/comments/:commentId
//@accesss  Private
const deleteComment = asyncHander(async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    res.status(404).json({ error: 'Comment not found' });
    throw new Error('Comment not found');
  }
  if (!req.user.isAdmin && req.user.id !== comment.author.toString()) {
    res.status(401).json({ message: "Cannot delete other user's comment!" });
    throw new Error("Cannot delete other user's comment!");
  }
  await Comment.findByIdAndDelete(commentId);
  res.json({ message: 'Comment deleted' });
});


//@desc     Get all comments of article
//@route    GET /api/comments/
//@accesss  Public
const getComments = asyncHander(async (req, res) => {
  const { articleId } = req.query;
  const article = await Comment.findOne({ article: articleId });
  if (!article) {
    res.status(404).json({ error: 'Article not found' });
    throw new Error('Article not found');
  }
  const comments = await Comment.find({ article: articleId });
  res.json({ comments });
})



module.exports = {
  createComment,
  deleteComment,
  getComments
}