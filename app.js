require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');


const rootRoute = require('./routes/indexRoute')
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/AppErrorUtil');


const app = express();


// Setting Up server configurations and middlewares
app.use(express.json()); // tells express to use json
// app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'));  // some development stuff 
app.use(cookieParser()); // cookie parser
app.use('/api/v1', rootRoute)


// handling unhandled routes
app.all('*', function (req, res, next) {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

// Error handling middleware
app.use(globalErrorHandler);


module.exports = app;