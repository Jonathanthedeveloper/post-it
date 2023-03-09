const Comment = require("../models/ReplyModel");

class ReplyService {
    constructor(model) {
        this.model = model
    }

    async create(comment) {
        return await this.model.create(comment)
    }

    async fetchOne(filter) {
        return await this.model.findOne(filter).populate('likes user')
    }

    async fetchAll(filter = {}) {
        return await this.model.find(filter).populate('likes user')
    }

    async update(filter, updateData) {
        return await this.model.findOneAndUpdate(filter, updateData, { new: true, runValidators: true })
    }
}

module.exports = new ReplyService(Comment);