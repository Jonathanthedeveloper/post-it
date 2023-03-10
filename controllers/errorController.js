/**
 * handle error for all routes
 * sends a json response to the client
 * @param {Error} error 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Next} next 
 */
function globalErrorHandler(error, req, res, next) {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    console.error(error);

    res
        .status(error.statusCode)
        .json({ status: error.status, message: error.message });
}

/**
 *@exports globalErrorHandler
 */
module.exports = globalErrorHandler;