const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required!']
    },
    password: {
      type: String,
      required: [true, 'Password is required!']
    },
    email: {
      type: String,
      required: [true, 'Email is required!'],
      unique: [true, "Email address is already taken!"]
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);