const Post = require("../models/PostModel");
const User = require("../models/UserModel");
const APIFeatures = require("../utils/APIFeaturesUtil");
const AppError = require("../utils/AppErrorUtil");

class SearchController {


    /**
     * finds a post that matches the query 
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     * 
     * ALGORITHM
     * check if the qurery is empty
     * add pagination using our previously created api class
     * return results
     */
    async findPost(req, res, next) {
        try {
            // check if the query is empty
            if (!req.query.q) {
                // return an error
                return next(new AppError("your request doesn't contain a query", 400))
            }


            // build a regex from the query
            const regex = new RegExp(req.query.q, "i")

            // add pagination field limiting to the query
            const filter = new APIFeatures(Post.find({ content: { $regex: regex } }), req.query).sort().limitFields().paginate()

            // await our results
            const posts = await filter.query

            // send to client
            res.status(200).json({ status: "success", message: "posts found sucessfully", results: posts.length, data: { posts } })
        } catch (error) {
            next(error)
        }


    }


    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     * ALGORITHM
     * check if the qurery is empty
     * add pagination using our previously created api class
     * return results
     */
    async findUser(req, res, next) {
        try {

            // checking if the qery is empty
            if (!req.query.q) {
                return next(new AppError("your request doesn't contain a query", 400))
            }

            // build a regex from the query
            const regex = new RegExp(req.query.q, "i");

            const filter = new APIFeatures(User.find({ $or: [{ handle: { $regex: regex } }, { name: { $regex: regex } }] }), req.query)
                .sort().limitFields().paginate()

            const users = await filter.query

            res.status(200).json({ status: "success", message: "users found sucessfully", results: users.length, data: { users } })
        } catch (error) {
            next(error)
        }
    }


    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     * 
     * ALGORITHM
     * check if the qurery is empty
     * if it is empty return an error
     * FIND USERS
     * FIND POSTS
     * add pagination using our previously created api class
     * return results {POST, USERS}
     */
    async findAll(req, res, next) {
        try {
            if (!req.query.q) {
                return next(new AppError("your request doesn't contain a query", 400))
            }

            // build a regex from the query
            const regex = new RegExp(req.query.q, "i")

            const userFilter = new APIFeatures(User.find({ $or: [{ handle: { $regex: regex } }, { name: { $regex: regex } }] }), req.query)
                .sort().limitFields().paginate()

            const postFilter = new APIFeatures(Post.find({ content: { $regex: regex } }), req.query).sort().limitFields().paginate()

            const users = await userFilter.query
            const posts = await postFilter.query

            res.status(200).json({ status: "success", message: "uquery processed sucessfully", results: users.length + posts.length, data: { users, posts } })

        } catch (error) {
            next(error)
        }
    }
}
module.exports = new SearchController();