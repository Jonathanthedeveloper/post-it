const express = require('express');
const router = express.Router();

const { createPost, getAllPosts, getAPost, likePost, unlikePost, editAPost, deletePost } = require('../controllers/postController');
const { createReply, getAllReplies, getAReply, likeReply, unlikeReply, editReply, deleteReply } = require('../controllers/replyController');


// POST IT
router.post('/', createPost)
router.get('/', getAllPosts)
router.get('/:postId', getAPost)
router.put('/:postId', editAPost)
router.delete('/:postId', deletePost)


// like and unlike a post
router.post('/:postId/like', likePost)
router.post('/:postId/unlike', unlikePost)


// REPLIES ON A POST
router.post('/:postId/replies', createReply)
router.get('/:postId/replies', getAllReplies)
router.get('/:postId/replies/:replyId', getAReply)
router.put('/:postId/replies/:replyId', editReply)
router.delete('/:postId/replies/:replyId', deleteReply)

// like and unlike a Reply
router.post('/:postId/replies/:replyId/like', likeReply)
router.post('/:postId/replies/:replyId/unlike', unlikeReply)

module.exports = router;