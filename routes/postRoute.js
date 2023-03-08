const express = require('express');
const router = express.Router();

const { createPost, getAllPosts, getAPost } = require('../controllers/postController');

router.post('/', createPost)
router.get('/', getAllPosts)
router.get('/:id', getAPost)

module.exports = router;