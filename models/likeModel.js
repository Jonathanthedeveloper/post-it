const { Schema, model } = require('mongoose');


const likeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

}, { timestamps: true });

const Like = model('Like', likeSchema);
module.exports = Like