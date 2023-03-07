require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();


// Setting Up server configurations and middlewares
app.use(express.json()); // tells express to use json
app.use(morgan('dev'));  // some development stuff 


module.exports = app;