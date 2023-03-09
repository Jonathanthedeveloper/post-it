const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userService = require("../services/userService");
const { JWT_EXPIRES_IN } = require('../config');
const AppError = require('../utils/AppErrorUtil');
const AvatarGenerator = require('../utils/profilePictureUtil');



class AuthController {

    // create a new user
    // check if the user exists
    // if user already exists return error
    // else hash user's password
    // store in database
    // sign user using jwt
    async createUser(req, res, next) {
        try {

            // checking if the user with that email already exists
            const userExists = await userService.findOne({ email: req.body.email });

            // thoring an error if user exists
            if (userExists)
                return next(new AppError(`User with that email already exists`, 409));

            // Generating random salts and hashing users password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt)

            const profilePicture = await AvatarGenerator.generateRandomAvatar(req.body.email);


            // getting the user's data and adding the hashed password to it
            const userData = {
                email: req.body.email,
                handle: req.body.handle,
                password: hash,
                profilePicture
            }


            const createdUser = await userService.create(userData);


            // sign user using json web tokens
            const token = jwt.sign({ email: createdUser.email, id: createdUser._id, handle: createdUser.handle }, process.env.JWT_SECRET_TOKEN, { expiresIn: JWT_EXPIRES_IN });

            req.header('Authorization', token)

            // send the token along side data for client to store 
            res
                .cookie('token', token)
                .status(201)
                .json({ status: "success", message: "user created successfully", token, data: { user: createdUser } })



        } catch (error) {
            next(error);
        }
    }



    // login in a user
    // check if the  user exists in the database
    // then compare their password against the database  returned user password
    async loginUser(req, res, next) {
        try {
            const userData = { ...req.body };


            // checking if the user exists in the database
            const foundUser = await userService.findOne({ $or: [{ email: userData.email }, { handle: userData.handle }] });
            if (!foundUser)
                return next(new AppError(`User with that email does not exist`, 404))


            // Comparing User's password with the returned password from the database
            const passwordIsValid = await bcrypt.compare(userData.password, foundUser.password);

            // throwing an error if password is not valid
            if (!passwordIsValid)
                return next(new AppError(`User with that email does not exist`, 404));

            // signing the user if their password is correct
            const token = jwt.sign({ email: foundUser.email, id: foundUser._id, handle: foundUser.handle }, process.env.JWT_SECRET_TOKEN, { expiresIn: JWT_EXPIRES_IN });


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
}

module.exports = new AuthController()