const express = require('express');
const router = express.Router();

const { createUser, loginUser, getMyProfile } = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');
const { validate, schemas: { register, login } } = require('../middlewares/validator');


router.post('/register', validate(register), createUser)
router.post('/login', validate(login), loginUser)
router.get('/me', authenticate, getMyProfile)



module.exports = router