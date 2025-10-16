const ResponseHelper = require('../helpers/response');
const logger = require('../utils/logger');

const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      logger.warn('Validation failed', {
        property,
        errors: errorMessages,
        path: req.path
      });

      return ResponseHelper.validationError(res, errorMessages);
    }

    req[property] = value;
    next();
  };
};

module.exports = { validate };
