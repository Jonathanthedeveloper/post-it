const express = require('express');
const router = express.Router();

const { createPost, getAllPosts, getAPost, likePost, unlikePost, editAPost, deletePost } = require('../controllers/postController');
const { createComment, getAllComments, getAComment, likeComment, unlikeComment, editComment, deleteComment } = require('../controllers/commentController');


// POST IT
router.post('/', createPost)
router.get('/', getAllPosts)
router.get('/:postId', getAPost)
router.put('/:postId', editAPost)
router.delete('/:postId', deletePost)


// like and unlike a post
router.post('/:postId/like', likePost)
router.post('/:postId/unlike', unlikePost)


// COMMENTS ON A POST
router.post('/:postId/comments', createComment)
router.get('/:postId/comments', getAllComments)
router.get('/:postId/comments/:commentId', getAComment)
router.put('/:postId/comments/:commentId', editComment)
router.delete('/:postId/comments/:commentId', deleteComment)

// like and unlike a comment
router.post('/:postId/comments/:commentId/like', likeComment)
router.post('/:postId/comments/:commentId/unlike', unlikeComment)

module.exports = router;