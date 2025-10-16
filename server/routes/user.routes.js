const express = require('express');
const router = express.Router();

// Controllers
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/user.controller');

// Middleware
const { verifyToken, isManager } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');

// Validators
const {
  createUserSchema,
  updateUserSchema,
  userIdSchema
} = require('../validators/user.validator');

router.use(verifyToken);
router.use(isManager);

router.get('/users', getAllUsers);
router.get('/users/:id', validate(userIdSchema, 'params'), getUserById);
router.post('/users', validate(createUserSchema), createUser);
router.put('/users/:id', validate(userIdSchema, 'params'), validate(updateUserSchema), updateUser);
router.delete('/users/:id', validate(userIdSchema, 'params'), deleteUser);

module.exports = router;
