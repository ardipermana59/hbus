const Joi = require('joi');

// Validasi untuk parameter taskId
const taskIdParamSchema = Joi.object({
  taskId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Task ID harus berupa angka',
      'number.integer': 'Task ID harus berupa bilangan bulat',
      'number.positive': 'Task ID harus berupa angka positif',
      'any.required': 'Task ID wajib diisi'
    })
});

// Validasi untuk query parameters (filter logs)
const getLogsQuerySchema = Joi.object({
  task_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.base': 'Task ID harus berupa angka',
      'number.integer': 'Task ID harus berupa bilangan bulat',
      'number.positive': 'Task ID harus berupa angka positif'
    }),
  user_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.base': 'User ID harus berupa angka',
      'number.integer': 'User ID harus berupa bilangan bulat',
      'number.positive': 'User ID harus berupa angka positif'
    }),
  limit: Joi.number()
    .integer()
    .positive()
    .max(100)
    .optional()
    .messages({
      'number.base': 'Limit harus berupa angka',
      'number.integer': 'Limit harus berupa bilangan bulat',
      'number.positive': 'Limit harus berupa angka positif',
      'number.max': 'Limit maksimal 100'
    })
});

module.exports = {
  taskIdParamSchema,
  getLogsQuerySchema
};
