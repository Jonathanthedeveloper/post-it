const bcrypt = require("bcrypt");

const userService = require("../services/userService");
const APIFeatures = require("../utils/APIFeaturesUtil");
const AppError = require("../utils/AppErrorUtil");
const User = require('../models/UserModel')






/**
 * @class UserController
 * @description this class handles all the user related routes
 */
class UserController {
    /**
     * 
     * @param { Request } req 
     * @param {Response } res 
     * @param {NextFunction} next 
     * @returns 
     */
    async getAUser(req, res, next) {
        try {
            const foundUser = await userService.findOne({ handle: req.params.handle });

            if (!foundUser) return next(new AppError(`User with that handle does not exist`, 404));


            res.status(200).json({ status: "success", data: { user: foundUser } })
        } catch (error) {
            next(error);
        }
    }


    /**
     * 
     * @param { Request } req 
     * @param {Response } res 
     * @param {NextFunction} next 
     * @description this method gets all users from the database
     * @returns {json} returns a json object with the status, result and data
     */
    async getAllUsers(req, res, next) {
        try {

            const query = new APIFeatures(User.find({}), req.query).limitFields().sort().paginate();

            const users = await query.query;

            res.status(200).json({ status: "success", result: users.length, data: { users } })

        } catch (error) {
            next(error);
        }
    }


    async editAUser(req, res, next) {
        try {

            console.log(req.params.handle, "SPACE", req.user.handle)

            if (req.params.handle !== req.user.handle)
                return next(new AppError("You cannot edit another user's profile", 403));

            const user = await userService.findOne({ handle: req.params.handle });
            if (!user)
                return next(new AppError(`User with handle @${req.params.handle} does not exist`, 404));

            if (req.body.password || req.body.email)
                return next(new AppError("You cannot change security information from this route", 403));

            if (req.body.handle) {
                const userExists = await userService.findOne({ handle: req.body.handle })

                if (userExists)
                    return next(new AppError(`User with handle @${req.body.handle} already exists`, 400));
            }

            const updateData = {
                handle: req.body.handle || user.handle,
                bio: req.body.bio || user.bio
            }

            const updatedUser = await userService.update({ handle: req.params.handle }, updateData);


            res.status(200).json({ status: "success", data: { user: updatedUser } })


        } catch (error) {
            next(error);
        }
    }


    async deleteUser(req, res, next) {
        try {
            if (req.user.handle !== req.params.handle)
                return next(new AppError("You cannot delete another user's account", 403));


            const user = await userService.findOne({ handle: req.params.handle });
            if (!user)
                return next(new AppError(`User with handle @${req.params.handle} does not exist`, 404));

            if (!req.body.password)
                return next(new AppError("Please provide your password", 400));

            const passwordIsValid = await bcrypt.compare(req.body.password, user.password);
            if (!passwordIsValid)
                return next(new AppError("Invalid password", 400));

            await userService.update({ handle: req.params.handle }, { isDeleted: true, deletedAt: Date.now() });


            res
                .status(204)
                .clearCookie("token")
                .json({ status: "success", message: "account deleted successfully", data: null })

        } catch (error) {
            next(error)
        }
    }
}


/**
 * @exports UserController
 * @description this exports the UserController class
 * @type {class}
 * @example const UserController = require("../controllers/userController");
 */
module.exports = new UserController();