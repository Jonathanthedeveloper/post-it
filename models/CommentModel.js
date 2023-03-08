const { Schema, model } = require('mongoose');


const commentSchema = new Schema({
    content: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
        type: Date
    }

}, { timestamps: true });

commentSchema.pre(/^find/, function (next) {
    this.find({ isDeleted: { $ne: true } });
    next()
})

const Comment = model('Comment', commentSchema);
module.exports = Comment