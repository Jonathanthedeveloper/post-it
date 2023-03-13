const express = require('express');
const router = express.Router();


const authenticate = require('../middlewares/authenticate');
const { validate, validateParams, schemas: { post, postId, replyId, reply } } = require('../middlewares/validator');
const { createPost, getAllPosts, getAPost, likePost, unlikePost, editAPost, deletePost } = require('../controllers/postController');
const { createReply, getAllReplies, getAReply, likeReply, unlikeReply, editReply, deleteReply } = require('../controllers/replyController');


// POST IT
router.post('/', validate(post), authenticate, createPost)
router.get('/', authenticate, getAllPosts)
router.get('/:postId', validateParams(postId), authenticate, getAPost)
router.put('/:postId', validateParams(postId), authenticate, editAPost)
router.delete('/:postId', validateParams(postId), authenticate, deletePost)


// like and unlike a post
router.post('/:postId/like', validateParams(postId), authenticate, likePost)
router.post('/:postId/unlike', validateParams(postId), authenticate, unlikePost)


// REPLIES ON A POST
router.post('/:postId/replies', validateParams(postId), authenticate, createReply)
router.get('/:postId/replies', validateParams(postId), authenticate, getAllReplies)
router.get('/:postId/replies/:replyId', validateParams(postId), validateParams(replyId), authenticate, getAReply)
router.put('/:postId/replies/:replyId', validateParams(postId), validateParams(replyId), validate(reply), authenticate, editReply)
router.delete('/:postId/replies/:replyId', validateParams(postId), validateParams(replyId), authenticate, deleteReply)

// like and unlike a Reply
router.post('/:postId/replies/:replyId/like', validateParams(postId), validateParams(replyId), authenticate, likeReply)
router.post('/:postId/replies/:replyId/unlike', validateParams(postId), validateParams(replyId), authenticate, unlikeReply)

module.exports = router;