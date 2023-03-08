const Comment = require("../models/CommentModel");

class CommentService {
    constructor(model) {
        this.model = model
    }

    async create(comment) {
        return await this.model.create(comment)
    }

    async fetchOne(filter) {
        return await this.model.findOne(filter)
    }

    async fetchAll(filter = {}) {
        return await this.model.find(filter)
    }
}

module.exports = new CommentService(Comment);