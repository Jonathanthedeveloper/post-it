const User = require('../models/UserModel'); // imports user model

class UserService {

    constructor(model) {
        this.model = model;
    }


    // create a new user
    async create(userData) {
        try {
            return await this.model.create(userData);
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async findOne(filter, projection = { __v: 0, isDeleted: 0 }) {
        try {
            return await this.model.findOne(filter, projection).populate({ path: "posts", select: "-isDeleted -__v" }).select(projection);
        } catch (error) {
            throw error
        }
    }

    async findAll(filter) {
        try {
            return await this.model.find(filter).populate('posts');
        } catch (error) {
            throw error;
        }
    }

    /**
     * 
     * @param {query} filter 
     * @param {object} updateData 
     * @returns 
     */
    async update(filter, updateData) {
        try {
            return await this.model.findOneAndUpdate(filter, updateData, { new: true, runValidators: true });
        } catch (error) {
            throw error
        }
    }

}

module.exports = new UserService(User);