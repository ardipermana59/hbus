const Joi = require('joi');

// Validasi untuk login
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email harus valid',
      'string.empty': 'Email tidak boleh kosong',
      'any.required': 'Email wajib diisi'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password minimal 6 karakter',
      'string.empty': 'Password tidak boleh kosong',
      'any.required': 'Password wajib diisi'
    })
});

module.exports = {
  loginSchema
};
