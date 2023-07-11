const express = require('express');
const validateToken = require('../middlewares/validateTokenHandler');
const {
  subscribeAuthor,
  unsubscribeAuthor
} = require('../controllers/subscriptionController');


const router = express.Router();
router.use(validateToken);
router.route('/:authorId').post(subscribeAuthor).delete(unsubscribeAuthor);

module.exports = router;
