/**
 * Response Helper
 * Utility untuk membuat response yang konsisten di seluruh aplikasi
 * Format utama:
 * {
 *  success: boolean,
 *  message: string,
 *  data: any,
 *  meta: object (optional)
 * }
 */

class ResponseHelper {
  /**
   * Response sukses
   * @param {object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Success message
   * @param {any} data - Response data
   * @param {object} meta - Additional metadata (optional)
   */
  static success(res, statusCode = 200, message = 'Success', data = null, meta = null) {
    const response = {
      success: true,
      message,
      data
    };

    if (meta) {
      response.meta = meta;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Response error
   * @param {object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {any} errors - Error details (optional)
   */
  static error(res, statusCode = 500, message = 'Internal Server Error', errors = null) {
    const response = {
      success: false,
      message
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Response untuk validation error
   * @param {object} res - Express response object
   * @param {any} errors - Validation errors
   */
  static validationError(res, errors) {
    return this.error(res, 400, 'Validation Error', errors);
  }

  /**
   * Response untuk unauthorized
   * @param {object} res - Express response object
   * @param {string} message - Custom message
   */
  static unauthorized(res, message = 'Unauthorized') {
    return this.error(res, 401, message);
  }

  /**
   * Response untuk forbidden
   * @param {object} res - Express response object
   * @param {string} message - Custom message
   */
  static forbidden(res, message = 'Forbidden') {
    return this.error(res, 403, message);
  }

  /**
   * Response untuk not found
   * @param {object} res - Express response object
   * @param {string} message - Custom message
   */
  static notFound(res, message = 'Resource not found') {
    return this.error(res, 404, message);
  }

  /**
   * Response untuk created
   * @param {object} res - Express response object
   * @param {string} message - Success message
   * @param {any} data - Created resource data
   */
  static created(res, message = 'Resource created successfully', data = null) {
    return this.success(res, 201, message, data);
  }

  /**
   * Response untuk paginated data
   * @param {object} res - Express response object
   * @param {string} message - Success message
   * @param {array} data - Array of data
   * @param {number} page - Current page
   * @param {number} limit - Items per page
   * @param {number} total - Total items
   */
  static paginated(res, message, data, page, limit, total) {
    const meta = {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(total),
      totalPages: Math.ceil(total / limit)
    };

    return this.success(res, 200, message, data, meta);
  }
}

module.exports = ResponseHelper;
