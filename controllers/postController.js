const postService = require("../services/postService");
const userService = require("../services/userService");

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

}

module.exports = new PostController();