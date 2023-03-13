const Joi = require('joi');
const AppError = require('../utils/AppErrorUtil');

/**
 * @typedef {Object} schemas
 * @property {Joi.object} login - Joi schema for login
 * @property {Joi.object} register - Joi schema for register
 * @property {Joi.object} post - Joi schema for post
 * @property {Joi.object} reply - Joi schema for reply
 */
const schemas = {
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }),

    register: Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        handle: Joi.string().min(3).required(),
    }),

    post: Joi.object({
        content: Joi.string().min(1).required(),
        image: Joi.string().uri(),
    }),

    reply: Joi.object({
        content: Joi.string().min(1).required(),
    }),

    postId: Joi.object({
        postId: Joi.string().required(),
    }),

    replyId: Joi.object({
        replyId: Joi.string().required(),
    }),

    handle: Joi.object({
        handle: Joi.string().required(),
    }),
    query: Joi.object({
        q: Joi.string().required()
    })
    ,
    password: Joi.object({
        password: Joi.string().min(6).required(),
    }),

    email: Joi.object({
        email: Joi.string().email().required(),
    }),

    userId: Joi.object({
        userId: Joi.string().required(),
    })
    ,
    resetPasswordSchema: Joi.object({
        resetPassword: Joi.string(),
    })

};

// Define a generic validation middleware function that takes a schema name as a parameter

/**
 * 
 * @param {schema} schemaName 
 * @returns {Error | NextFunction}
 */
function validate(schemaName) {
    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    return function (req, res, next) {
        const { error } = schemaName.validate(req.body);

        if (error) {
            return next(new AppError(error.details[0].message, 400));
        }
        next();
    };
}

/**
 * 
 * @param {schema} schemaName 
 * @returns {Error | NextFunction}
 */
function validateParams(schemaName) {
    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    return function (req, res, next) {
        const { error } = schemaName.validate(req.params);

        if (error) {
            return next(new AppError(error.details[0].message, 400));
        }
        next();
    };
}

/**
 * 
 * @param {schema} schemaName 
 * @returns {Error | NextFunction}
 */
function validateQuery(schemaName) {
    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    return function (req, res, next) {
        const { error } = schemaName.validate(req.query);

        if (error) {
            return next(new AppError(error.details[0].message, 400));
        }
        next();
    };
}

// Export the schemas and validation function as an object
module.exports = { schemas, validate, validateParams, validateQuery };
