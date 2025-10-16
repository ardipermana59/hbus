const express = require('express');
const router = express.Router();

// Controllers
const { login } = require('../controllers/auth.controller');
// Middleware
const { validate } = require('../middleware/validation.middleware');
// Validators
const { loginSchema } = require('../validators/auth.validator');

router.post('/login', validate(loginSchema), login);

module.exports = router;
