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
     * 
     * ALGORITHM:
     * check if the post exists
     * create a reply
     * push it's objectId it to the post replys array
     */
    async createReply(req, res, next) {
        try {

            const post = await postService.findOne({ _id: req.params.postId });
            if (!post)
                return next(new AppError("post not found", 404));

            const replyData = {
                content: req.body.content,
                user: req.user.id
            }
            const newReply = await replyService.create(replyData)


            await postService.update({ _id: req.params.postId }, { $push: { replies: newReply._id } });

            res.status(200).json({ status: "success", message: "user successfully replied", data: { reply: newReply } })
        } catch (error) {
            next(error);
        }
    }

    async getAReply(req, res, next) {
        try {
            // const reply = await replyService.fetchOne({ _id: req.params.replyId });
            const post = await Post.findById(req.params.postId).select('replies -_id');
            const replies = post?.replies;
            if (!replies)
                return next(new AppError("post not found", 404))

            const reply = await replyService.fetchOne({ _id: req.params.replyId })


            console.log(replies);
            console.log(reply?._id);

            if (!replies.some(rply => rply.toString() === reply?._id.toString()))
                return next(new AppError("reply not found", 404));


            res.status(200).json({ status: "success", message: 'reply successfully retrieved', data: { reply } })
        } catch (error) {
            next(error);
        }
    }

    async getAllReplies(req, res, next) {


        try {


            // console.log(req.params.postId)

            // const post = await postService.findOne({ _id: req.params.postId });

            // const replies = await Post.aggregate([
            //     {
            //         $match: {
            //             _id: req.params.postId
            //         }
            //     }
            // ])
            // checking if the post exists
            const post = await postService.findOne({ _id: req.params.postId });
            if (!post)
                return next(new AppError("post not found", 404));

            const { replies } = post

            // const { replies } = post

            res.status(200).json({ status: "success", message: 'replies successfully retrieved', results: replies?.length, data: { replies } })
        } catch (error) {
            next(error)
        }
    }

    async likeReply(req, res, next) {
        try {

            const reply = await replyService.fetchOne({ _id: req.params.replyId });
            if (!reply)
                return next(new AppError("reply not found", 404));
            console.log(reply.likes)
            if (reply.likes.some(like => like._id.toString() === req.user.id))
                return next(new AppError("you already liked this reply", 400));

            const likedReply = await replyService.update({ _id: req.params.replyId }, { $push: { likes: req.user.id } });
            res.status(200).json({ status: "success", message: "reply successfully liked", data: { reply: likedReply } })
        } catch (error) {
            next(error)
        }
    }
    async unlikeReply(req, res, next) {
        try {
            const reply = await replyService.fetchOne({ _id: req.params.replyId });
            if (!reply)
                return next(new AppError("reply not found", 404));

            if (!reply.likes.some(like => like._id.toString() === req.user.id))
                return next(new AppError("you don't this reply", 400));

            const unlikedReply = await replyService.update({ _id: req.params.replyId }, { $pull: { likes: req.user.id } });

            res.status(200).json({ status: "success", message: "reply successfully unliked", data: { reply: unlikedReply } })
        } catch (error) {
            next(error)
        }
    }

    async editReply(req, res, next) {
        try {
            const reply = await replyService.fetchOne({ _id: req.params.replyId });

            if (!reply)
                return next(new AppError("reply not found", 404));

            if (reply.user._id.toString() !== req.user.id)
                return next(new AppError("you cannot edit this reply", 403));

            const updatedReply = await replyService.update({ _id: req.params.replyId }, { content: req.body.content });

            res.status(200).json({ status: "success", message: "reply successfully updated", data: { reply: updatedReply } })
        } catch (error) {
            next(error)
        }
    }

    async deleteReply(req, res, next) {
        try {
            const reply = await replyService.fetchOne({ _id: req.params.replyId });
            if (!reply)
                return next(new AppError("reply not found", 404));

            if (reply.user._id.toString() !== req.user.id)
                return next(new AppError("you cannot delete this reply", 403));

            const deleted = await replyService.update({ _id: req.params.replyId }, { isDeleted: true, deletedAt: Date.now() });

            res.status(204).json({ status: "success", message: "reply successfully deleted", data: deleted })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new ReplyController;