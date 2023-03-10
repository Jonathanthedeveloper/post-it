const replyService = require('../services/ReplyService');
const userService = require('../services/userService');
const postService = require('../services/postService');
const Reply = require('../models/ReplyModel');
const APIFeatures = require('../utils/APIFeaturesUtil');
const AppError = require('../utils/AppErrorUtil');
const Post = require('../models/PostModel');

/**
 * @class ReplyController
 * @description CRUD operations on replies
 */
class ReplyController {

    /**
     * creates a reply
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     * ALGORITHM:
     * check if the post exists
     * create a reply
     * push it's objectId it to the post replys array
     */
    async createReply(req, res, next) {
        try {
            // does the post even exist?
            const post = await postService.findOne({ _id: req.params.postId });
            if (!post)
                return next(new AppError("post not found", 404));

            // get the reply payload fron the request body
            const replyData = {
                content: req.body.content,
                user: req.user.id
            }

            // no stress create the reply 
            const newReply = await replyService.create(replyData)

            //removing unnecessary data from the reply
            newReply.isDeleted = undefined;

            // now we gotta let the post know of this reply
            await postService.update({ _id: req.params.postId }, { $push: { replies: newReply._id } });

            res.status(200).json({ status: "success", message: "user successfully replied", data: { reply: newReply } })
        } catch (error) {
            next(error);
        }
    }

    /**
     * returns a requested reply in a post
     * @param {Request} req 
     * @param {Response} res 
     * @param {import('express').NextFunction} next 
     * @returns 
     * ALGORITHM:
     * check if the post exists
     * check if the reply exist
     * check if the reply exists on the found post
     * return response to client
     */
    async getAReply(req, res, next) {
        try {
            // getting the requested post resource
            const post = await Post.findById(req.params.postId).select('replies -_id');

            // does it exist ? 
            if (!post) {
                return next(new AppError("post not found", 404))
            }

            // are there replies on the post ? 
            const { replies } = post;
            if (!replies)
                return next(new AppError("no replies found for the requested post", 404))

            // getting the requested reply resource
            const reply = await replyService.fetchOne({ _id: req.params.replyId })

            // checking if the reply exists on the requested post resource
            if (!replies.some(rply => rply.toString() === reply?._id.toString()))
                return next(new AppError("reply not found", 404));

            //removing unnecessary data from the reply
            reply.user.password = undefined;
            reply.user.isDeleted = undefined;
            reply.isDeleted = undefined;

            // returning response to client
            res.status(200).json({ status: "success", message: 'reply successfully retrieved', data: { reply } })
        } catch (error) {
            next(error);
        }
    }

    /**
     * returns all replies in a requested post resource
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     * @returns 
     * ALGORITHM:
     * check if the post exists
     * get all replies
     * send all replies to client
     */
    async getAllReplies(req, res, next) {
        try {
            // checking if the post exists
            const post = await postService.findOne({ _id: req.params.postId });
            if (!post)
                return next(new AppError("post not found", 404));

            // getting the replies from the post
            const { replies } = post

            // returning the replies to the client
            res
                .status(200)
                .json({ status: "success", message: 'replies successfully retrieved', results: replies?.length, data: { replies } })
        } catch (error) {
            next(error)
        }
    }


    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {import('express').NextFunction} next 
     * @returns {Response | import('express').NextFunction}
     * ALGORITHM:
     * check if the post exists
     * check if the reply exists on the found post
     * check if the user already liked the reply
     * update the reply
     */
    async likeReply(req, res, next) {
        try {

            const reply = await replyService.fetchOne({ _id: req.params.replyId });
            if (!reply) {
                return next(new AppError("reply not found", 404));
            }

            // checking if user already liked the reply
            if (reply.likes.some(like => like._id.toString() === req.user.id)) {
                return next(new AppError("you already liked this reply", 400));
            }

            // updating the reply with the id of the user who liked it
            const likedReply = await replyService.update({ _id: req.params.replyId }, { $push: { likes: req.user.id } });


            //sending the response to the client
            res.status(200).json({ status: "success", message: "reply successfully liked", data: { reply: likedReply } })
        } catch (error) {
            next(error)
        }
    }

    /**
     * Unlike a reply
     * @param {Request} req 
     * @param {Response} res 
     * @param {import('express').NextFunction} next 
     * @returns {Response | NextFunction}
     * ALGORITHM:
     * check if the post exists
     * check if the reply exists on the found post
     * check if the user already liked the reply
     * unlike the reply
     */
    async unlikeReply(req, res, next) {
        try {

            // checking if the post exists
            const post = await postService.findOne({ _id: req.params.postId });
            if (!post) {
                return next(new AppError("post not found", 404));
            }

            // checking if the reply exists
            const reply = await replyService.fetchOne({ _id: req.params.replyId });
            if (!reply) {
                return next(new AppError("reply not found", 404));
            }

            // checking if reply exists on the found post
            if (!post.replies.some(rply => rply._id.toString() === reply._id.toString())) {
                return next(new AppError("reply not found on the requested post", 404));
            }

            // checking if the user already liked the reply
            if (!reply.likes.some(like => like._id.toString() === req.user.id)) {
                return next(new AppError("you don't this reply", 400));
            }

            const unlikedReply = await replyService.update({ _id: req.params.replyId }, { $pull: { likes: req.user.id } });

            res.status(200).json({ status: "success", message: "reply successfully unliked", data: { reply: unlikedReply } })
        } catch (error) {
            next(error)
        }
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     * @returns {Error | Void}
     * ALGORITHM:
     * check if the post exists
     * check if the reply exists
     * check if the user is the owner of the reply
     * update the reply
     */
    async editReply(req, res, next) {
        try {

            // checking if the post exists
            const post = await postService.findOne({ _id: req.params.postId });
            if (!post) {
                return next(new AppError("post not found", 404))
            }

            // checking if the reply exists
            const reply = await replyService.fetchOne({ _id: req.params.replyId });
            if (!reply)
                return next(new AppError("resquested reply not found in the requested post", 404));

            // checking if the user is the owner of the reply
            if (reply.user._id.toString() !== req.user.id)
                return next(new AppError("you cannot edit this reply", 403));

            // update the reply
            const updatedReply = await replyService.update({ _id: req.params.replyId }, { content: req.body.content });

            res.status(200).json({ status: "success", message: "reply successfully updated", data: { reply: updatedReply } })
        } catch (error) {
            next(error)
        }
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {import('express').NextFunction} next 
     * @returns 
     * ALGORITHM:
     * check if the post exists
     * check if the reply exists
     * check if the reply belongs to the post
     */
    async deleteReply(req, res, next) {
        try {

            // checking if the post exists
            const post = await postService.findOne({ _id: req.params.postId });
            if (!post) {
                return next(new AppError("post not found", 404));
            }

            // checking if the reply exists
            const reply = await replyService.fetchOne({ _id: req.params.replyId });
            if (!reply) {
                return next(new AppError("reply not found", 404));
            }

            // checking if the reply was posted by this user
            // you don't wan't other users to delete your violent reply 😂
            if (reply.user._id.toString() !== req.user.id) {
                return next(new AppError("you cannot delete this reply", 403));
            }


            // checking if the reply belongs to the post
            if (!post.replies.some(rply => rply._id.toString() === reply._id.toString())) {
                return next(new AppError("the requested reply does was not found in the requested post", 404));
            }

            // deleting the reply from the post
            // notice that i didn't delete the reply rather i updated it's isDeleted property to true
            // @ts-ignore
            await replyService.update({ _id: req.params.replyId }, { isDeleted: true, deletedAt: Date.now() });


            // sending a response to the user wtih the deleted reply
            // @ts-ignore
            res.status(204).json({ status: "success", message: "reply successfully deleted", data: null });
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new ReplyController;