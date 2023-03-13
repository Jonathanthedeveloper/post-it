const bcrypt = require("bcrypt");

const userService = require("../services/userService");
const APIFeatures = require("../utils/APIFeaturesUtil");
const AppError = require("../utils/AppErrorUtil");
const User = require('../models/UserModel');
const Email = require("../utils/EmailUtil");






/**
 * @class UserController
 * @description this class handles all the user related routes
 */
class UserController {
    /**
     * get details of a specific user
     * @param { Request } req 
     * @param {Response } res 
     * @param {NextFunction} next 
     * @returns 
     */
    async getAUser(req, res, next) {
        try {
            const foundUser = await userService.findOne({ handle: req.params.handle }, { password: 0, isDeleted: 0, __v: 0, resetPassword: 0, resetPasswordExpires: 0 });

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
     * @param {import("express").NextFunction} next 
     * @description this method gets all users from the database
     * @returns {JSON} returns a json object with the status, result and data
     */
    async getAllUsers(req, res, next) {
        try {

            // limiting the fields to be returned using aggregation and also paginating the results
            const query = new APIFeatures(User.find({}), req.query).limitFields().sort().paginate();

            const users = await query.query;

            res.status(200).json({ status: "success", result: users.length, data: { users } })

        } catch (error) {
            next(error);
        }
    }


    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     * @returns 
     * @description this method edits a user's profile
     * ALGORITHM
     * 1. check if the user is trying to edit another user's profile
     * 2. check if the user exists
     * 3. check if the user is trying to change security information
     * 4. check if the user is trying to change their handle
     * 5. check if the new handle already exists
     * 6. update the user's profile
     * 7. return the updated user
     */
    async editAUser(req, res, next) {
        try {

            // check if the user is trying to edit another user's profile
            if (req.params.handle !== req.user.handle)
                return next(new AppError("You cannot edit another user's profile", 403));

            // check if the user exists
            const user = await userService.findOne({ handle: req.params.handle });
            if (!user)
                return next(new AppError(`User with handle @${req.params.handle} does not exist`, 404));

            // check if the user is trying to change security information
            if (req.body.password || req.body.email)
                return next(new AppError("You cannot change security information from this route", 403));

            // check if the user is trying to change their handle
            if (req.body.handle) {
                const userExists = await userService.findOne({ handle: req.body.handle })

                // check if the new handle already exists
                if (userExists)
                    return next(new AppError(`User with handle @${req.body.handle} already exists`, 400));
            }

            // update the user's profile
            const updateData = {
                handle: req.body.handle || user.handle,
                bio: req.body.bio || user.bio,
                name: req.body.name || user.name,
            }

            // update the user
            const updatedUser = await userService.update({ handle: req.params.handle }, updateData);
            updatedUser.password = undefined; // remove the password from the response
            updatedUser.isDeleted = undefined; // remove the isDeleted from the response


            //return the updated user
            res.status(200).clearCookie('token').json({ status: "success", data: { user: updatedUser } })


        } catch (error) {
            next(error);
        }
    }


    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     * @returns 
     * ALGORITHM
     * 1. check if the user is trying to delete another user's account
     * 2. check if the user exists
     * 3. check if the user provided their password
     * 4. check if the password is valid
     * 5. delete the user's account{isDeleted: true, deletedAt: Date.now()} 
     */
    async deleteUser(req, res, next) {
        try {

            // check if the user is trying to delete another user's account
            if (req.user.handle !== req.params.handle)
                return next(new AppError("You cannot delete another user's account", 403));

            // check if the user exists
            const user = await userService.findOne({ handle: req.params.handle });
            if (!user)
                return next(new AppError(`User with handle @${req.params.handle} does not exist`, 404));

            // check if the user provided their password
            if (!req.body.password)
                return next(new AppError("Please provide your password", 400));

            //check if the password is valid
            const passwordIsValid = await bcrypt.compare(req.body.password, user.password);
            if (!passwordIsValid)
                return next(new AppError("Invalid password", 400));

            //update the user's account set isDeleted to true and deletedAt to Date.now()
            await userService.update({ handle: req.params.handle }, { isDeleted: true, deletedAt: Date.now() });

            new Email(user).sendAccountDeletionEmail()

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
 * @description this exports the UserController cla
 * @example const UserController = require("../controllers/userController");
 */
module.exports = new UserController();