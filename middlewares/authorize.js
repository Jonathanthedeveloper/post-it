function authorise(role) {
    return function (req, res, next) {
        if (req.user.role !== 'admin')
            return next(new AppError('You are not authorised to perform this action', 403));

        next();
    }
}

// / if the user is not an admin, they are not authorised to perform this action
// // if the user is an admin, they are authorised to perform this action
// // if the user is the owner, they are  authorised to perform this action
