const express = require('express');
const router = express.Router();

const authRoute = require('./authRoute');
const userRoute = require('./userRoute');
const postRoute = require('./postRoute');
const searchRoute = require('./searchRoute');
const authenticate = require('../middlewares/authenticate');

router.use('/auth', authRoute)
router.use('/users', authenticate, userRoute)
router.use('/posts', authenticate, postRoute)
router.use('/search', authenticate, searchRoute)

module.exports = router