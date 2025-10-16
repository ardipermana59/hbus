const ResponseHelper = require('../helpers/response');

/**
 * Middleware untuk validasi request menggunakan Joi schema
 * @param {object} schema - Joi validation schema
 * @returns {function} Express middleware
 */
const validate = (schema) => {
  return (req, res, next) => {
    const validationOptions = {
      abortEarly: false, // Tampilkan semua error, tidak hanya error pertama
      allowUnknown: true, // Izinkan field yang tidak didefinisikan di schema
      stripUnknown: true  // Hapus field yang tidak didefinisikan di schema
    };

    const { error, value } = schema.validate(req.body, validationOptions);

    if (error) {
      // Format error dari Joi
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return ResponseHelper.validationError(res, errors);
    }

    // Replace request body dengan validated value
    req.body = value;
    next();
  };
};

/**
 * Middleware untuk validasi query parameters
 * @param {object} schema - Joi validation schema
 * @returns {function} Express middleware
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const validationOptions = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    };

    const { error, value } = schema.validate(req.query, validationOptions);

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return ResponseHelper.validationError(res, errors);
    }

    req.query = value;
    next();
  };
};

/**
 * Middleware untuk validasi params
 * @param {object} schema - Joi validation schema
 * @returns {function} Express middleware
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    const validationOptions = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    };

    const { error, value } = schema.validate(req.params, validationOptions);

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return ResponseHelper.validationError(res, errors);
    }

    req.params = value;
    next();
  };
};

module.exports = {
  validate,
  validateQuery,
  validateParams
};
