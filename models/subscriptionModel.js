const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},
  {
    timestamps: true
  }
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;