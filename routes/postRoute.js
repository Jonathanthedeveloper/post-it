const express = require('express');
const router = express.Router();

const { createPost, getAllPosts, getAPost } = require('../controllers/postController');
const { createComment } = require('../controllers/commentController');
const commentRoute = require('./commentRoute');

router.post('/', createPost)
router.get('/', getAllPosts)
router.get('/:id', getAPost)

router.post('/:id/comments', createComment)

module.exports = router;