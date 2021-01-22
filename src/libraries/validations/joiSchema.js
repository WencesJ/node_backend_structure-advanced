const Joi = require('joi');

const users = _include('components/users/sanitize');
const admin = _include('components/admin/sanitize');

const { AppError, catchAsync } = _include('libraries/error');
const { selectProps } = _include('libraries/shared/helpers/helper');

const validate = {
    ...users,
    ...admin
}


exports.reqValidate = (endpoint) => {
    return (req, res, next) => {
        
        let request = {};

        if (!validate[endpoint]) {
            return next(new AppError('Something went wrong!', 500));
        }

        const request_methods = {
            GET: req.params,
            POST: req.body,
            PATCH: req.body,
            DELETE: req.body
        }
        
        const requestData = request_methods[req.method];

        request = selectProps(requestData, Object.keys(validate[endpoint]));

        const schema = Joi.object({
            ...validate[endpoint]
        });

        const { value, error } = schema.validate({ ...request });
        
        if (error) {
            let msg = error.message;

            if (msg.includes('ref')) {
                msg = "'Password' and 'Confirm Password' Do Not Match. Please Check Passwords!"
            }

            msg = msg.replace(/"/g, "'");

            return next(new AppError(msg, 400));
        }
        
        if (req.method === 'GET') {
            req.params = selectProps(value, Object.keys(req.params));
        }
        else {
            req.body = selectProps(value, Object.keys(req.body));
        }

        next();
    }
}
