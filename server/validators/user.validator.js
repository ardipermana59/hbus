const Joi = require('joi');

// Validasi untuk membuat user baru
const createUserSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'Nama minimal 3 karakter',
      'string.max': 'Nama maksimal 100 karakter',
      'string.empty': 'Nama tidak boleh kosong',
      'any.required': 'Nama wajib diisi'
    }),
  email: Joi.string()
    .trim()
    .email()
    .max(100)
    .required()
    .messages({
      'string.email': 'Email harus valid',
      'string.max': 'Email maksimal 100 karakter',
      'string.empty': 'Email tidak boleh kosong',
      'any.required': 'Email wajib diisi'
    }),
  password: Joi.string()
    .min(6)
    .max(100)
    .required()
    .messages({
      'string.min': 'Password minimal 6 karakter',
      'string.max': 'Password maksimal 100 karakter',
      'string.empty': 'Password tidak boleh kosong',
      'any.required': 'Password wajib diisi'
    }),
  role: Joi.string()
    .valid('manager', 'member')
    .default('member')
    .messages({
      'any.only': 'Role harus salah satu dari: manager, member'
    })
});

// Validasi untuk update user
const updateUserSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'Nama minimal 3 karakter',
      'string.max': 'Nama maksimal 100 karakter',
      'string.empty': 'Nama tidak boleh kosong',
      'any.required': 'Nama wajib diisi'
    }),
  email: Joi.string()
    .trim()
    .email()
    .max(100)
    .required()
    .messages({
      'string.email': 'Email harus valid',
      'string.max': 'Email maksimal 100 karakter',
      'string.empty': 'Email tidak boleh kosong',
      'any.required': 'Email wajib diisi'
    }),
  role: Joi.string()
    .valid('manager', 'member')
    .required()
    .messages({
      'any.only': 'Role harus salah satu dari: manager, member',
      'any.required': 'Role wajib diisi'
    })
});

// Validasi untuk ID parameter
const userIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'ID harus berupa angka',
      'number.integer': 'ID harus berupa bilangan bulat',
      'number.positive': 'ID harus berupa angka positif',
      'any.required': 'ID wajib diisi'
    })
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  userIdSchema
};
