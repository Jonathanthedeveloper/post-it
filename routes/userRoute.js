const express = require('express');
const router = express.Router();

const { getAUser, getAllUsers, editAUser, deleteUser } = require('../controllers/userController');


router.get('/:handle', getAUser)
router.put('/:handle', editAUser);
router.delete('/:handle', deleteUser);
router.get('/', getAllUsers)

module.exports = router;