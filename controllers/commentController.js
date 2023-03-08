const commentService = require('../services/commentService');
const userService = require('../services/userService');
const postService = require('../services/postService');
const Comment = require('../models/CommentModel');
const APIFeatures = require('../utils/APIFeaturesUtil');
const AppError = require('../utils/AppErrorUtil');
const Post = require('../models/PostModel');

/**
 * @class CommentController
 * @description CRUD operations on comments
 */
class CommentController {

    /**
     * creates a comment
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     * 
     * ALGORITHM:
     * create a comment
     * push it's objectId it to the post comments array
     */
    async createComment(req, res, next) {
        try {
            const commentData = {
                content: req.body.content,
                user: req.user.id
            }
            const newComment = await commentService.create(commentData)


            await postService.update({ _id: req.params.postId }, { $push: { comments: newComment._id } });

            res.status(200).json({ status: "success", message: "user successfully commented", data: { comment: newComment } })
        } catch (error) {
            next(error);
        }
    }

    async getAComment(req, res, next) {
        try {
            const comment = await commentService.fetchOne({ _id: req.params.commentId });

            if (!comment)
                return next(new AppError(404, "fail", "comment not found"));

            res.status(200).json({ status: "success", message: 'comment successfully retrieved', data: { comment } })
        } catch (error) {
            next(error);
        }
    }

    async getAllComments(req, res, next) {
        try {


            console.log(req.params.postId)

            // const post = await postService.findOne({ _id: req.params.postId });

            // const comments = await Post.aggregate([
            //     {
            //         $match: {
            //             _id: req.params.postId
            //         }
            //     }
            // ])

            const comments = await Post.findById(req.params.postId).populate('comments').select('comments -_id').populate('user')

            // const { comments } = post

            res.status(200).json({ status: "success", message: 'comments successfully retrieved', results: comments.length, data: { comments } })
        } catch (error) {
            next(error)
        }
    }

    async likeComment(req, res, next) {
        try {
            const comment = await commentService.fetchOne({ _id: req.params.commentId });
            if (!comment)
                return next(new AppError("comment not found", 404));

            if (comment.likes.includes(req.user.id))
                return next(new AppError("you already liked this comment", 400));

            const likedComment = await commentService.update({ _id: req.params.commentId }, { $push: { likes: req.user.id } });
            res.status(200).json({ status: "success", message: "comment successfully liked", data: { comment: likedComment } })
        } catch (error) {
            next(error)
        }
    }
    async unlikeComment(req, res, next) {
        try {
            const comment = await commentService.fetchOne({ _id: req.params.commentId });
            if (!comment)
                return next(new AppError("comment not found", 404));

            if (!comment.likes.includes(req.user.id))
                return next(new AppError("you don't this comment", 400));

            const unlikedComment = await commentService.update({ _id: req.params.commentId }, { $pull: { likes: req.user.id } });

            res.status(200).json({ status: "success", message: "comment successfully unliked", data: { comment: unlikedComment } })
        } catch (error) {
            next(error)
        }
    }

    async editComment(req, res, next) {
        try {
            const comment = await commentService.fetchOne({ _id: req.params.commentId });

            if (!comment)
                return next(new AppError("comment not found", 404));

            if (comment.user._id.toString() !== req.user.id)
                return next(new AppError("you cannot edit this comment", 403));

            const updatedComment = await commentService.update({ _id: req.params.commentId }, { content: req.body.content });

            res.status(200).json({ status: "success", message: "comment successfully updated", data: { comment: updatedComment } })
        } catch (error) {
            next(error)
        }
    }

    async deleteComment(req, res, next) {
        try {
            const comment = await commentService.fetchOne({ _id: req.params.commentId });
            if (!comment)
                return next(new AppError("comment not found", 404));

            if (comment.user._id.toString() !== req.user.id)
                return next(new AppError("you cannot delete this comment", 403));

            const deleted = await commentService.update({ _id: req.params.commentId }, { isDeleted: true, deletedAt: Date.now() });

            res.status(204).json({ status: "success", message: "comment successfully deleted", data: deleted })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new CommentController;