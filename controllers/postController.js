const Post = require("../models/PostModel");
const postService = require("../services/postService");
const userService = require("../services/userService");
const APIFeatures = require("../utils/ApiFeaturesUtil");

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

            const post = await postService.findOne({ _id: req.params.id });

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

}

module.exports = new PostController();