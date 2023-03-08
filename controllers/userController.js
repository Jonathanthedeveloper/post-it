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
}


/**
 * @exports UserController
 * @description this exports the UserController class
 * @type {class}
 * @example const UserController = require("../controllers/userController");
 */
module.exports = new UserController();