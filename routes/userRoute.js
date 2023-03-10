const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/authenticate');
const { validateParams, schemas: { handle } } = require('../middlewares/validator');


const { getAUser, getAllUsers, editAUser, deleteUser } = require('../controllers/userController');


router.get('/:handle', validateParams(handle), authenticate, getAUser)
router.put('/:handle', validateParams(handle), authenticate, editAUser);
router.delete('/:handle', validateParams(handle), authenticate, deleteUser);
router.get('/', authenticate, getAllUsers)

module.exports = router;