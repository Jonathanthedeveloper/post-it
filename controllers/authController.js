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
}

module.exports = new AuthController()