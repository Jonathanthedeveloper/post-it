const express = require('express');
const router = express.Router();

const { findPost, findUser, findAll } = require('../controllers/searchController');
const authenticate = require('../middlewares/authenticate');
const { validateQuery, schemas: { query } } = require('../middlewares/validator');


router.get('/', validateQuery(query), authenticate, findAll)
router.get('/users', validateQuery(query), authenticate, findUser)
router.get('/posts', validateQuery(query), authenticate, findPost)


module.exports = router;