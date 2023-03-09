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
    profilePicture: {
        type: String,
        required: [true, "profile picture is required"],
    },
    bio: {
        type: String,
        max: 250
    },
    posts: {
        type: [Schema.Types.ObjectId],
        ref: 'Post',
        unique: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
    }
}, {
    timestamps: true,
});

userSchema.pre(/^find/, function (next) {
    this.find({ isDeleted: { $ne: true } });
    next()
})

const User = model('User', userSchema);
module.exports = User;