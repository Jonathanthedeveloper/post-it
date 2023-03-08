const Post = require("../models/PostModel");

class PostService {

    constructor(model) {
        this.model = model;
    }

    async create(postData) {
        return await this.model.create(postData)
    }

    async findOne(filter) {
        return await this.model.findOne(filter).populate('user')
    }

    async findAll(filter = {}) {
        return await this.model.find(filter).populate('user')
    }
}


module.exports = new PostService(Post);