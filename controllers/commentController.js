const commentService = require('../services/commentService');
const userService = require('../services/userService');
const postService = require('../services/postService');
const Comment = require('../models/CommentModel');
const APIFeatures = require('../utils/APIFeaturesUtil');

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


            await postService.update({ _id: req.params.id }, { $push: { comments: newComment._id } });

            res.status(200).json({ status: "success", message: "user successfully commented", data: { comment: newComment } })
        } catch (error) {
            next(error);
        }
    }

    async getAComment(req, res, next) {
        try {
            const comment = await commentService.fetchOne({ _id: req.params.id });

            if (!comment)
                return next(new AppError(404, "fail", "comment not found"));

            res.status(200).json({ status: "success", message: 'comment successfully retrieved', data: { comment } })
        } catch (error) {
            next(error);
        }
    }

    async getAllComments(req, res, next) {
        try {

            const query = new APIFeatures(Comment.find(), req.query).limitFields().sort().paginate();

            const comments = await query.query.populate('user likes')

            res.status(200).json({ status: "success", message: 'comments successfully retrieved', results: comments.length, data: { comments } })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new CommentController;