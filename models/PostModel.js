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
    replies: {
        type: [Schema.Types.ObjectId],
        ref: "Reply"
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

// postSchema.post(/^find/, function (docs, next) {
//     if (docs.isDeleted) {
//         const post = {
//             _id: docs._id,
//             content: "This post has been deleted",
//             likes: docs.likes,
//             replies: docs.replies,
//             user: docs.user
//         }

//         console.log(post);
//         next();
//         return post;
//     }
//     next();
// });

const Post = model('Post', postSchema);
module.exports = Post