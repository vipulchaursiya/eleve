require('dotenv').config();
const express = require('express');
const app = express(); //set up express server
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('./mongodb.js'); //set up database connection
app.use(bodyParser.json());

app.use(morgan('dev'));

const reviewRoute = require('./routes/review.route');

app.use('/api/reviews', reviewRoute);

const port = process.env.PORT;
app.listen(4000, () => console.log(`Backend app listening on port ${port}!`));
