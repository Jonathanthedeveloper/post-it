const userService = require("../services/userService");
const AppError = require("../utils/AppErrorUtil");







class UserController {
    // getting a user 
    async getAUser(req, res, next) {
        try {
            const foundUser = await userService.findOne({ handle: req.params.handle });

            if (!foundUser) return next(new AppError(`User with that handle does not exist`, 404));


            res.status(200).json({ status: "success", data: { user: foundUser } })
        } catch (error) {
            next(error);
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await userService.findAll({});
            if (users.length < 1) return next(new AppError(`no user found`, 404));

            res.status(200).json({ status: "success", result: users.length, data: { users } })

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();