const Subscription = require('../models/subscriptionModel');
const asyncHandler = require('express-async-handler');



//@desc     Subscribe an author
//@route    POST /api/subscriptions/:authorId
//@access   private
const subscribeAuthor = asyncHandler(async (req, res) => {
  const { authorId } = req.params;
  if (authorId === req.user.id) {
    const errMsg = "User and author can't be the same";
    res.status(403).json({ message: errMsg });
    throw new Error(errMsg);
  }
  let subscription = await Subscription.findOne({
    user: req.user.id,
    author: authorId
  });
  if (subscription) {
    const errMsg = 'Subscription already exists'
    res.status(403).json({ message: errMsg });
    throw new Error(errMsg);
  }
  subscription = await Subscription.create({
    user: req.user.id,
    author: authorId
  });
  res.status(201).json({ message: 'Subscribed' });
})



//@desc     Unsubscribe an author
//@route    DELETE /api/subscriptions/:authorId
//@access   private
const unsubscribeAuthor = asyncHandler(async (req, res) => {
  const { authorId } = req.params;
  const subscription = await Subscription.findOne({
    user: req.user.id,
    author: authorId
  });
  if (!subscription) {
    const errMsg = 'Subscription not found';
    res.status(404).json({ message: errMsg });
    throw new Error(errMsg);
  }
  await Subscription.findOneAndDelete({
    user: req.user.id,
    author: authorId
  })
  res.json({ message: 'Unsubscribed' });
})



module.exports = {
  subscribeAuthor,
  unsubscribeAuthor
}