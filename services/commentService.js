const Comment = require("../models/CommentModel");

class CommentService {
    constructor(model) {
        this.model = model
    }

    async create(comment) {
        return await this.model.create(comment)
    }
}

module.exports = new CommentService(Comment);