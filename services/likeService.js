const Like = require('../models/likeModel');

class LikeService {
    constructor(model) {
        this.model = model;
    }

    create()
}

module.exports = new LikeService(Like);