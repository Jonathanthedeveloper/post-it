const express = require('express');
const router = express.Router();

const { createUser, loginUser, getMyProfile, logoutUser, resetPassword, forgotPassword } = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');
const { validate, schemas: { register, login, email, password, userId, resetPasswordSchema }, validateParams } = require('../middlewares/validator');


router.post('/register', validate(register), createUser)
router.post('/login', validate(login), loginUser)
router.get('/logout', logoutUser)
router.get('/me', authenticate, getMyProfile)
router.post('/forgot-password', validate(email), forgotPassword)
router.post('/reset-password/:userId/:resetPassword', validate(password), resetPassword)

// router.post('/reset-password/:userId/:resetPassword', validateParams(userId), validateParams(resetPasswordSchema), validate(password), resetPassword)




module.exports = router