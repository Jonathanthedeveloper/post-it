const Post = require("../models/PostModel");
const postService = require("../services/postService");
const userService = require("../services/userService");
const APIFeatures = require("../utils/ApiFeaturesUtil");
const AppError = require("../utils/AppErrorUtil");

class PostController {

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    async createPost(req, res, next) {
        try {
            const postData = {
                content: req.body.content,
                user: req.user.id
            }
            const newPost = await postService.create(postData);
            await userService.update({ _id: req.user.id }, { $push: { posts: newPost._id } });

            res.status(201).json({ "status": "success", data: { post: newPost } })

        } catch (error) {
            next(error)
        }
    }

    async getAPost(req, res, next) {
        try {

            const post = await postService.findOne({ _id: req.params.postId });

            if (!post)
                return next(new AppError("Post not found", 404));

            res.status(200).json({ "status": "success", data: { post } })

        } catch (error) {
            next(error)
        }
    }

    async getAllPosts(req, res, next) {
        try {
            const query = new APIFeatures(Post.find({}), req.query).limitFields().sort().paginate();
            const posts = await query.query.populate('user comments');
            res.status(200).json({ "status": "success", data: { posts } })
        } catch (error) {
            next(error)
        }
    }

    async likePost(req, res, next) {
        try {
            const post = await postService.findOne({ _id: req.params.postId });
            if (!post)
                return next(new AppError("Post not found", 404));

            if (post.likes.includes(req.user.id))
                return next(new AppError("Post already liked", 400));

            const likedPost = await postService.update({ _id: req.params.postId }, { $push: { likes: req.user.id } });

            res.status(200).json({ "status": "success", message: "post successfully liked", data: { post: likedPost } })
        } catch (error) {
            next(error)
        }
    }
    async unlikePost(req, res, next) {
        try {
            const post = await postService.findOne({ _id: req.params.postId });
            if (!post)
                return next(new AppError("Post not found", 404));

            if (!post.likes.includes(req.user.id))
                return next(new AppError("Post not liked already", 400));

            const unlikedPost = await postService.update({ _id: req.params.postId }, { $pull: { likes: req.user.id } });

            res.status(200).json({ "status": "success", message: "post unliked succesfully", data: { post: unlikedPost } })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new PostController();