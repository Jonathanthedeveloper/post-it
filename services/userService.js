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
            throw error
        }
    }

    async findOne(filter) {
        try {
            return await this.model.findOne(filter);
        } catch (error) {
            throw error
        }
    }

    async findAll(filter) {
        try {
            return await this.model.find(filter);
        } catch (error) {
            throw error;
        }
    }

}

module.exports = new UserService(User);