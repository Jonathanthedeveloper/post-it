const { Schema, model } = require('mongoose');


const replySchema = new Schema({
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

replySchema.pre(/^find(?!By)/, function (next) {
    this.find({ isDeleted: { $ne: true } });
    next()
})

const Reply = model('Reply', replySchema);
module.exports = Reply