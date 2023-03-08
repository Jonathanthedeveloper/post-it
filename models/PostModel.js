const { Schema, model } = require('mongoose');


const postSchema = new Schema({
    content: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: "Comment"
    },
    likes: {
        type: [Schema.Types.ObjectId],
        ref: "User"
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
    }

}, { timestamps: true });

postSchema.pre(/^find/, function (next) {
    this.find({ isDeleted: { $ne: true } });
    next()
})

const Post = model('Post', postSchema);
module.exports = Post