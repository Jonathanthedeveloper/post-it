const { default: mongoose } = require("mongoose");
const Post = require("../models/PostModel");
const postService = require("../services/postService");
const userService = require("../services/userService");
const APIFeatures = require("../utils/ApiFeaturesUtil");
const AppError = require("../utils/AppErrorUtil");


/**
 * Handles request on the post route
 * @class PostController
 */
class PostController {

    /**
     * creates a new post and returns the post alongside it's response to it's client
     * @param {Request} req 
     * @param {Response} res
     * @param {import("express").NextFunction} next
     */
    async createPost(req, res, next) {
        try {

            if (!req.body.content || req.body.content.trim() === "") {
                return next(new AppError("No post data provided", 400));
            }

            // get post content from the request body
            const postData = {
                content: req.body.content,
                user: req.user.id
            }

            // create that post
            const newPost = await postService.create(postData);

            // add the post to the user's posts array
            await userService.update({ _id: req.user.id }, { $push: { posts: newPost._id } });

            // send response to the client
            res.status(201).json({ "status": "success", data: { post: newPost } })

        } catch (error) {
            next(error)
        }
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next 
     * @returns 
     * ALGORITHM:
     * get the post id from the request params
     * find the post with that id
     * if the post is not found, return a 404 error
     * if the post is found, return the post
     */


    async getAPost(req, res, next) {
        try {

            // finding the requested post
            const post = await postService.findOne({ _id: req.params.postId });

            // no post 🤷‍♀️
            if (!post) {
                return next(new AppError("Post not found", 404));
            }

            //removing unnecessary fields
            post.user.password = undefined;
            post.user.isDeleted = undefined;

            // send response to client
            res.status(200).json({ "status": "success", data: { post } })

        } catch (error) {
            next(error)
        }
    }

    /**
     * returns all post from the database to the client
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next 
     */
    async getAllPosts(req, res, next) {
        try {
            const query = new APIFeatures(Post.find({}), req.query).limitFields().sort().paginate();
            const posts = await query.query.populate('replies');
            res.status(200).json({ "status": "success", data: { posts } })
        } catch (error) {
            next(error)
        }
    }


    /**
     * updates the like property of a post with the object id of the client
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     * @returns 
     * 
     * ALGORITHM:
     * find the post with the id in the request params
     * if the post is not found, return a 404 error
     * if the post is found, check if the user has already liked the post
     * if the user has already liked the post, return a 400 error
     * if the user has not liked the post, add the user's id to the likes array
     * return the updated post to the client
     */
    async likePost(req, res, next) {
        try {

            // getting the requested post resource
            const post = await postService.findOne({ _id: req.params.postId });

            // no post found just throw an error
            if (!post)
                return next(new AppError("Post not found", 404));

            // check if the user has already liked the post
            if (post.likes.some(like => like._id.toString() === req.user.id))
                return next(new AppError("Post already liked", 400));

            // update the post with the user's id
            const likedPost = await postService.update({ _id: req.params.postId }, { $push: { likes: req.user.id } });

            // remove unnecessary fields
            likedPost.isDeleted = undefined;

            //send response to the client
            res.status(200).json({ "status": "success", message: "post successfully liked", data: { post: likedPost } })
        } catch (error) {
            next(error)
        }
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next 
     * @returns 
     * ALGORITHM:
     * find the post with the id in the request params
     * if the post is not found, return a 404 error
     * if the post is found, check if the user has already liked the post
     * if the user has not liked the post, return a 400 error
     * if the user has liked the post, remove the user's id from the likes array
     * return the updated post to the client
     */
    async unlikePost(req, res, next) {
        try {

            // getting the requested post resource
            const post = await postService.findOne({ _id: req.params.postId });

            // no post found just throw an error
            if (!post)
                return next(new AppError("Post not found", 404));

            // check if the user already liked the post
            if (!post.likes.some(like => like._id.toString() === req.user.id))
                return next(new AppError("Post not liked already", 400));

            // update the post with the user's id
            const unlikedPost = await postService.update({ _id: req.params.postId }, { $pull: { likes: req.user.id } });

            // remove unnecessary fields
            unlikedPost.isDeleted = undefined;

            //send response to the client
            res.status(200).json({ "status": "success", message: "post unliked succesfully", data: { post: unlikedPost } })
        } catch (error) {
            next(error)
        }
    }


    /**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Next} next 
 *ALGORITHM:
 * check idf the post exists
 * if the post does not exist, return a 404 error
 * if the post exists, check if the user is the owner of the post
 * if the user is not the owner of the post, return a 403 error
 * if the user is the owner of the post, update the post with the new content
 * return the updated post to the client 
 */
    async editAPost(req, res, next) {
        try {

            // checking if the post exists
            const post = await postService.findOne({ _id: req.params.postId });
            if (!post)
                return next(new AppError("Post not found", 404));

            // checking if the user is the owner of the post
            if (req.user.id !== post.user._id.toString())
                return next(new AppError("you can't edit this post", 403));

            // if there is a content to update the post with
            if (!req.body.content)
                return next(new AppError("Content is required", 400));

            // updating the post
            const updatedPost = await postService.update({ _id: req.params.postId }, { content: req.body.content });
            updatedPost.isDeleted = undefined;

            // sending response to the client
            res.status(200).json({ "status": "success", message: "post updated successfully", data: { post: updatedPost } })
        } catch (error) {
            next(error)
        }
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     * @returns 
     * ALGORITHM:
     * find the post with the id in the request params
     * if the post is not found, return a 404 error
     * if the post is found, check if the user is the owner of the post
     * if the user is not the owner of the post, return a 403 error
     * if the user is the owner of the post, update the posts isDeleted to true and set the deletedAt to the current date
     */
    async deletePost(req, res, next) {
        try {

            // finding the requested post
            const post = await postService.findOne({ _id: req.params.postId });
            if (!post)
                next(new AppError("Post not found", 404));

            // checking if the user is the owner of the post
            if (req.user.id !== post.user._id.toString())
                return next(new AppError("you can't delete this post", 403));

            // updating the post, setting it's deleted property to true and setting the deletedAt property to the current date
            await postService.update({ _id: req.params.postId }, { isDeleted: true, deletedAt: Date.now() });

            // sending response to the client
            res
                .status(204)
                .json({ "status": "success", message: "post deleted successfully", data: null })

        } catch (error) {
            next(error)
        }
    }

}

module.exports = new PostController();