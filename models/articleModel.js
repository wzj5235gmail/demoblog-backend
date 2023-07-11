const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    required: true
  }],
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
},
  {
    timestamps: true
  });

articleSchema.plugin(mongoosePaginate);

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
