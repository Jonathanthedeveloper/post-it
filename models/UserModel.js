const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    handle: {
        type: String,
        required: [true, "handle is required"],
        unique: true,
    },
    bio: {
        type: String,
        max: 250
    },
    posts: {
        type: [Schema.Types.ObjectId],
        ref: 'Post',
        unique: true,
    }
}, {
    timestamps: true,
});

const User = model('User', userSchema);
module.exports = User;