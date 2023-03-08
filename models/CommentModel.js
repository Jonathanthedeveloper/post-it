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
    }

}, { timestamps: true });

const Comment = model('Comment', commentSchema);
module.exports = Comment