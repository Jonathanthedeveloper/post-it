const Post = require("../models/PostModel");

class PostService {

    constructor(model) {
        this.model = model;
    }

    async create(postData) {
        return await this.model.create(postData)
    }

    async findOne(filter) {
        return await this.model.findOne(filter).populate('user comments')
    }

    async findAll(filter = {}) {
        return await this.model.find(filter).populate('user comments')
    }

    async update(filter, updateData) {
        return await this.model.findOneAndUpdate(filter, updateData, { new: true, runValidators: true })
    }
}


module.exports = new PostService(Post);