const express = require('express');
const router = express.Router();

const { createPost, getAllPosts, getAPost } = require('../controllers/postController');
const { createComment, getAllComments, getAComment } = require('../controllers/commentController');

router.post('/', createPost)
router.get('/', getAllPosts)
router.get('/:id', getAPost)

router.post('/:id/comments', createComment)
router.get('/:id/comments', getAllComments)
router.get('/:id/comments/:id', getAComment)

module.exports = router;