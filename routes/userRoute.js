const express = require('express');
const router = express.Router();

const { getAUser, getAllUsers, editAUser } = require('../controllers/userController');


router.get('/:handle', getAUser)
router.put('/:handle', editAUser);
router.get('/', getAllUsers)

module.exports = router;