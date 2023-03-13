const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppErrorUtil');
/**
 *
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
function authenticate(req, res, next) {
    const token = req.cookies.token || req.headers?.authorization?.split(' ')[1];

    console.log(token)

    if (!token) return next(new AppError('Access denied. No token provided', 401));

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
        req.user = decoded;
        next();

    } catch (error) {
        next(new AppError('Invalid token', 400));
    }
}

module.exports = authenticate;