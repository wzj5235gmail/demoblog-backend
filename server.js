const express = require('express');
const dotenv = require('dotenv').config();
const connectDb = require("./config/dbConnection.js");
const path = require('path');
const cors = require('cors');


connectDb();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/users', require('./routes/userRoutes.js'));
app.use('/api/articles', require('./routes/articleRoutes.js'));
app.use('/api/categories', require('./routes/categoryRoutes.js'));
app.use('/api/tags', require('./routes/tagRoutes.js'));
app.use('/api/comments', require('./routes/commentRoutes.js'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes.js'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});