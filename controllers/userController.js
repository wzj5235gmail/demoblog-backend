const User = require('../models/userModel');
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { constants } = require('../constants')

//@desc Sign up new user
//@route POST /api/users/signup
//@public
const userSignup = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    res.status(constants.VALIDATION_ERROR);
    throw new Error('All fields are mandatory!');
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(constants.VALIDATION_ERROR);
    throw new Error('Email address is already taken!');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword
  });
  if (user) {
    res.status(201).json({
      _id: user.id,
      email: user.email
    });
  }
  else {
    res.status(constants.VALIDATION_ERROR);
    throw new Error('All fields are mandatory!');
  }
});

//@desc Log in user
//@route POST /api/users/login
//@public
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(constants.VALIDATION_ERROR);
    throw new Error('All fields are mandatory!');
  }
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
          isAdmin: user.isAdmin,
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    return res.json({
      accessToken,
      username: user.username,
    });
  }
  else {
    res.status(constants.UNAUTHORIZED);
    throw new Error('Email or password is not valid!');
  }
})



//@desc Show current user info
//@route POST /api/users/info
//@public

const userInfo = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
})

module.exports = { userSignup, userLogin, userInfo };