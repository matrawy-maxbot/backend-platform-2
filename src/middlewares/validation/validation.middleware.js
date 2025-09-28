import status from '../../config/status.config.js';
import Joi from 'joi';

const validationMiddleware = (req, res, next) => {

    if(!req.type) {
        res.status(status.BAD_REQUEST);
        return next(new Error('Type is required'));
    }

    if(!req.value) req.value = {};

    // Set the validation target based on type
    let validationTarget;
    if(req.type === 'params') {
        validationTarget = req.params;
    } else if(req.type === 'query') {
        validationTarget = req.query;
    } else if(req.type === 'body') {
        validationTarget = req.body;
    } else if(req.type === 'file') {
        validationTarget = req.file;
    } else if(req.type === 'files') {
        validationTarget = req.files;
    } else if(req.type === 'headers') {
        validationTarget = req.headers;
    } else {
        res.status(status.BAD_REQUEST);
        return next(new Error('Type is not supported'));
    }

    if(!req.schema) {
        res.status(status.BAD_REQUEST);
        return next(new Error('Schema is required'));
    }

    const schema = req.schema.unknown ? req.schema.unknown() : Joi.object(req.schema).unknown();
    const { error, value } = schema.validate(validationTarget, { abortEarly: false });
  
    if (error) {
        res.status(status.BAD_REQUEST);
        return next(new Error(error.details.map((err) => err.message).join(', ')));
    }

    // Store validated values back to req for use in controllers
    if(!req.value) req.value = {};
    
    if(req.type === 'params') {
        req.value.params = value;
        // Also update req.params with validated values
        req.params = value;
    } else if(req.type === 'query') {
        req.value.query = value;
        req.query = value;
    } else if(req.type === 'body') {
        req.value.body = value;
        req.body = value;
    } else if(req.type === 'file') {
        req.value.file = value;
    } else if(req.type === 'files') {
        req.value.files = value;
    } else if(req.type === 'headers') {
        req.value.headers = value;
    }
  
    next();
};

const validationMiddlewareFactory = (schema, type) => {
    return (req, res, next) => {
        req.schema = schema;
        req.type = type;
        validationMiddleware(req, res, next);
    }
}

export default validationMiddlewareFactory;
  