require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');


const rootRoute = require('./routes/indexRoute')
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/AppErrorUtil');


const app = express();

// configuring rate limiter
const limiter = rateLimit({
    max: 3,
    windowMs: 5000,
    message: 'Too many requests from this IP, please try again in 5 seconds'
})


// Setting Up server configurations and middlewares
app.use(helmet()); // helmet
app.use(cors()); // cors
app.use(express.urlencoded({ extended: true }))
app.use(express.json()); // tells express to use json
app.use(morgan('dev'));  // some development stuff 
app.use(cookieParser()); // cookie parser
app.set('view engine', 'ejs'); // setting up view engine for emails
app.use('/', limiter); // rate limiter
app.use('/api/v1', rootRoute)


// handling unhandled routes
app.all('*', function (req, res, next) {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

// Error handling middleware
app.use(globalErrorHandler);


module.exports = app;