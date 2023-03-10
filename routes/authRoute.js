const express = require('express');
const router = express.Router();

const { createUser, loginUser, getMyProfile } = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');


router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/me', authenticate, getMyProfile)


module.exports = router