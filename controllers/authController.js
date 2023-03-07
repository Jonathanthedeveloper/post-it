const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userService = require("../services/userService");
const { JWT_EXPIRES_IN } = require('../config');



class AuthController {

    // create a new user
    // check if the user exists
    // if user already exists return error
    // else hash user's password
    // store in database
    // sign user using jwt
    async createUser(req, res) {
        try {

            // checking if the user with that email already exists
            const userExists = await userService.findOne({ email: req.body.email });
            if (userExists)
                return res.status(409).json({ success: false, message: "user with that email already exists" });


            // Generating random salts and hashing users password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt)


            // getting the user's data and adding the hashed password to it
            const userData = {
                email: req.body.email,
                password: hash
            }


            const createdUser = await userService.create(userData);


            // sign user using json web tokens
            const token = jwt.sign({ email: createdUser.email }, process.env.JWT_SECRET_TOKEN, { expiresIn: JWT_EXPIRES_IN })

            // send the token along side data for client to store 
            res
                .status(201)
                .json({ success: true, message: "user created successfully", token, data: { user: createdUser } })



        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }



    // login in a user
    // check if the  user exists in the database
    // then compare their password against the database  returned user password
    async loginUser(req, res) {
        try {
            const userData = { ...req.body };


            // checking if the user exists in the database
            const foundUser = await userService.findOne({ email: userData.email });
            if (!foundUser)
                return res.status(404).json({ success: false, message: "invalid email or password" });


            // Comparing User's password with the returned password from the database
            const passwordIsValid = await bcrypt.compare(userData.password, foundUser.password);
            if (!passwordIsValid)
                return res.status(404).json({ success: false, message: "invalid email or password" });

            // signing the user if their password is correct
            const token = jwt.sign({ email: foundUser.email }, process.env.JWT_SECRET_TOKEN, { expiresIn: JWT_EXPIRES_IN });


            // returning the token along side the response for client to store
            res
                .status(200)
                .json({ success: true, message: "user logged in successfully", token })

        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new AuthController()