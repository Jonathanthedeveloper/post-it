const express = require('express');
const router = express.Router();

const { getAUser, getAllUsers } = require('../controllers/userController');


router.get('/:handle', getAUser)
router.get('/', getAllUsers)

module.exports = router;