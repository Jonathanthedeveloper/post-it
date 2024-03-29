const crypto = require('crypto');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userService = require("../services/userService");
const { JWT_EXPIRES_IN, PASSWORD_RESET_EXPIRES_IN } = require('../config');
const AppError = require('../utils/AppErrorUtil');
const generateRandomAvatar = require('../utils/profilePictureUtil');
const Email = require('../utils/EmailUtil');


/**
 * Handles request on the auth route
 * @class AuthController
 */
class AuthController {


    /**
     * creates a user and returns the user alongside it's response to it's client
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next 
     * @returns 
     * 
     * ALGORITHM:
     * get the user's data from the request body
     * check if the user with that email already exists
     * if user exists, return an error
     * else generate random salts and hash the user's password
     * create the user
     * sign user using json web tokens
     * send the token along side data for client to store
     */
    async createUser(req, res, next) {
        try {

            // checking if the user alreddy exists in the database
            const userExists = await userService.findOne({ email: req.body.email });

            // sending an error if user exists
            if (userExists)
                return next(new AppError(`User with that email already exists`, 409));

            // Generating random salts and hashing users password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt)

            // generating a random profile picture for the user
            const imageUrl = await generateRandomAvatar(req.body.email);


            // getting the user's data and adding the hashed password to it
            const userData = {
                email: req.body.email,
                handle: req.body.handle,
                password: hash,
                profilePicture: `<img src="${imageUrl}" alt="${req.body.handle} autogenerated profile picture" />`
            }


            const createdUser = await userService.create(userData);

            // send email to welcome the user
            await new Email(createdUser, `${req.protocol}://${req.get("host")}/api/v1/posts`).sendWelcome();


            // sign user using json web tokens
            const token = jwt.sign({ email: createdUser.email, id: createdUser._id, handle: createdUser.handle }, process.env.JWT_SECRET_TOKEN, { expiresIn: JWT_EXPIRES_IN });

            // setting the token in the request header
            req.header('Authorization', token)

            // send the token along side data for client to store 
            res
                .cookie('token', token)
                .status(201)
                .json({ status: "success", message: "user created successfully", token, data: { user: { email: createdUser.email, handle: createdUser.handle } } })

        } catch (error) {
            next(error);
        }
    }



    /**
     * signs in a user and returns the user alongside it's response to it's client
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     * @returns 
     * 
     * ALGORITHM:
     * check if the user exists in the database
     * if user does not exist, return an error
     * else compare the user's password with the returned password from the database
     * if password is not valid, return an error
     * else sign the user
     * send an email to the user
     * send the token along side data for client to store
     */
    async loginUser(req, res, next) {
        try {
            const userData = { ...req.body };


            // checking if the user exists in the database
            const foundUser = await userService.findOne({ $or: [{ email: userData.email }, { handle: userData.handle }] });
            if (!foundUser)
                return next(new AppError(`Invalid email or password`, 404))


            // Comparing User's password with the returned password from the database
            const passwordIsValid = await bcrypt.compare(userData.password, foundUser.password);

            // throwing an error if password is not valid
            if (!passwordIsValid)
                return next(new AppError(`Invalid email or password`, 404));

            // signing the user if their password is correct
            const token = jwt.sign({ email: foundUser.email, id: foundUser._id, handle: foundUser.handle }, process.env.JWT_SECRET_TOKEN, { expiresIn: JWT_EXPIRES_IN });


            // sending a welome back email to the user
            await new Email(foundUser).sendWelcomeBack();


            //setting the token in the request header
            req.header('Authorization', token)


            // returning the token along side the response for client to store
            res
                .cookie('token', token)
                .status(200)
                .json({ status: "success", message: "user logged in successfully", token })

        } catch (error) {
            next(error);;
        }
    }


    /**
     * gets details of currently authenticated user
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     * 
     * ALGORITHM:
     * get the user's data from the request body
     * check if the userexists
     * if user does not exist, return an error
     * else return the user's data
     */
    async getMyProfile(req, res, next) {

        try {


            // gettting the user from the database
            const currentUser = await userService.findOne(
                {
                    $or: [{ $and: [{ _id: req.user.id }, { email: req.user.email }] },
                    { $and: [{ _id: req.user.id }, { handle: req.user.handle }] }]
                },
                { password: 0, isDeleted: 0, __v: 0 }
            );

            // no user! then man ain't logged in you know
            if (!currentUser) {
                return next(new AppError(`you are not logged in`, 401));
            }

            // send response to client
            res.status(200).json({ status: "success", message: "profile fetched successfully", data: { user: currentUser } })
        } catch (error) {
            next(error)
        }

    }

    /**
     * logs user out by deleting the token from the client's cookie
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     */
    async logoutUser(req, res, next) {
        try {
            res
                .clearCookie('token')
                .status(200)
                .json({ status: "success", message: "user logged out successfully" })
        } catch (error) {
            next(error)
        }
    }

    /**
     * resets a user's password 
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next
     * 
     * ALGORITHM:
     * get the user's data from the request body
     * check if the userexists
     * if user does not exist, return an error
     * else generate a random password
     * hash the password
     * update the user's password
     * send an email to the user with a reset password link
 
     */
    async forgotPassword(req, res, next) {
        try {
            const userData = { ...req.body };

            // checking if the user exists in the database
            const foundUser = await userService.findOne({ $or: [{ email: userData.email }, { handle: userData.handle }] });
            if (!foundUser)
                return next(new AppError(`User with that email does not exist`, 404))

            // generating a random password
            const randomPassword = crypto.randomBytes(37).toString("hex");


            // hashing the password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(randomPassword, salt)

            // updating the user's password
            const updatedUser = await userService.update({ _id: foundUser._id }, { resetPassword: hash, resetPasswordExpires: Date.now() + PASSWORD_RESET_EXPIRES_IN });

            // sending an email to the user with a reset password link
            const resetLink = `${req.protocol}://${req.get("host")}/api/v1/auth/reset-password/${updatedUser._id}/${randomPassword}`;
            new Email(updatedUser, resetLink, randomPassword).sendPasswordReset();

            // send response to client
            res.status(200).json({ status: "success", message: "password reset link sent successfully", randomPassword })
        } catch (error) {
            next(error)
        }
    }

    /**
     * resets a user's password
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     */
    async resetPassword(req, res, next) {
        try {
            const { resetPassword, userId } = req.params;

            // finding the user
            const user = await userService.findOne({ _id: userId, resetPasswordExpires: { $gt: Date.now() } });
            if (!user) {
                return next(new AppError("password reset token is invalid or has expired", 400));
            }

            // checking if the reset password is correct
            const isValidResetPassword = await bcrypt.compare(resetPassword, user.resetPassword);

            // throwing an error if password is not valid
            if (!isValidResetPassword) {
                return next(new AppError("password reset token is invalid or has expired", 400));
            }

            // hashing the password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt)

            // updating the user's password
            user.password = hash;
            user.resetPassword = undefined;
            user.resetPasswordExpires = undefined;
            const updatedUser = await user.save();

            // this didn't work
            // const updatedUser = await userService.update({ _id: userId }, { password: hash, resetPassword: undefined, resetPasswordExpires: undefined });

            // notifying the user of a password reset on their account just in case
            new Email(updatedUser).sendPasswordChanged();

            res
                .status(200)
                .json({ status: "success", message: "password reset successfully", data: null })



        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AuthController()