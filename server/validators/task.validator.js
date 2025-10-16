const Joi = require('joi');

// Validasi untuk membuat task baru
const createTaskSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'Judul task minimal 3 karakter',
      'string.max': 'Judul task maksimal 200 karakter',
      'string.empty': 'Judul task tidak boleh kosong',
      'any.required': 'Judul task wajib diisi'
    }),
  description: Joi.string()
    .allow('', null)
    .optional()
    .messages({
      'string.base': 'Deskripsi harus berupa teks'
    }),
  assigned_to: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional()
    .messages({
      'number.base': 'assigned_to harus berupa angka',
      'number.integer': 'assigned_to harus berupa bilangan bulat',
      'number.positive': 'assigned_to harus berupa angka positif'
    }),
  status: Joi.string()
    .valid('Belum Dimulai', 'Sedang Dikerjakan', 'Selesai')
    .optional()
    .messages({
      'any.only': 'Status harus salah satu dari: Belum Dimulai, Sedang Dikerjakan, Selesai'
    }),
  start_date: Joi.date()
    .iso()
    .allow(null)
    .optional()
    .messages({
      'date.base': 'Tanggal mulai harus berupa tanggal yang valid',
      'date.format': 'Tanggal mulai harus dalam format ISO 8601'
    }),
  end_date: Joi.date()
    .iso()
    .allow(null)
    .optional()
    .greater(Joi.ref('start_date'))
    .messages({
      'date.base': 'Tanggal selesai harus berupa tanggal yang valid',
      'date.format': 'Tanggal selesai harus dalam format ISO 8601',
      'date.greater': 'Tanggal selesai harus lebih besar dari tanggal mulai'
    })
});

// Validasi untuk update task
const updateTaskSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Judul task minimal 3 karakter',
      'string.max': 'Judul task maksimal 200 karakter',
      'string.empty': 'Judul task tidak boleh kosong'
    }),
  description: Joi.string()
    .allow('', null)
    .optional()
    .messages({
      'string.base': 'Deskripsi harus berupa teks'
    }),
  assigned_to: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional()
    .messages({
      'number.base': 'assigned_to harus berupa angka',
      'number.integer': 'assigned_to harus berupa bilangan bulat',
      'number.positive': 'assigned_to harus berupa angka positif'
    }),
  status: Joi.string()
    .valid('Belum Dimulai', 'Sedang Dikerjakan', 'Selesai')
    .optional()
    .messages({
      'any.only': 'Status harus salah satu dari: Belum Dimulai, Sedang Dikerjakan, Selesai'
    }),
  start_date: Joi.date()
    .iso()
    .allow(null)
    .optional()
    .messages({
      'date.base': 'Tanggal mulai harus berupa tanggal yang valid',
      'date.format': 'Tanggal mulai harus dalam format ISO 8601'
    }),
  end_date: Joi.date()
    .iso()
    .allow(null)
    .optional()
    .messages({
      'date.base': 'Tanggal selesai harus berupa tanggal yang valid',
      'date.format': 'Tanggal selesai harus dalam format ISO 8601'
    })
})

// Validasi untuk parameter ID
const idParamSchema = Joi.object({
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

// Validasi untuk query parameters (filter)
const getTasksQuerySchema = Joi.object({
  status: Joi.string()
    .valid('Belum Dimulai', 'Sedang Dikerjakan', 'Selesai')
    .optional()
    .messages({
      'any.only': 'Status harus salah satu dari: Belum Dimulai, Sedang Dikerjakan, Selesai'
    }),
  assigned_to: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.base': 'assigned_to harus berupa angka',
      'number.integer': 'assigned_to harus berupa bilangan bulat',
      'number.positive': 'assigned_to harus berupa angka positif'
    })
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  idParamSchema,
  getTasksQuerySchema
};
