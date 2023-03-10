const express = require('express');
const router = express.Router();

const { findPost, findUser, findAll } = require('../controllers/searchController');


router.get('/', findAll)
router.get('/users', findUser)
router.get('/posts', findPost)


module.exports = router;