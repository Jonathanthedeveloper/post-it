const express = require('express');
const router = express.Router();

const authRoute = require('./authRoute');
const userRoute = require('./userRoute');
const postRoute = require('./postRoute');
const searchRoute = require('./searchRoute');
const authenticate = require('../middlewares/authenticate');
const healthRoute = require('./healthRoute');

router.use('/auth', authRoute)
router.use('/users', userRoute)
router.use('/posts', postRoute)
router.use('/search', authenticate, searchRoute)
router.use('/health', healthRoute)

module.exports = router