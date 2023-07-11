const express = require('express');
const validateToken = require('../middlewares/validateTokenHandler');
const { userInfo, userLogin, userSignup } = require('../controllers/userController');

const router = express.Router();
router.post('/signup', userSignup);
router.post('/login', userLogin);
router.get('/info', validateToken, userInfo);

module.exports = router; 