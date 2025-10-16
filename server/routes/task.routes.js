const express = require('express');
const router = express.Router();

// Controllers
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require('../controllers/task.controller');
const { getDashboard } = require('../controllers/dashboard.controller');

// Middleware
const { verifyToken, isManager } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');

// Validators
const {
  createTaskSchema,
  updateTaskSchema,
  idParamSchema,
  getTasksQuerySchema
} = require('../validators/task.validator');

router.use(verifyToken);
router.use(isManager);

router.get('/dashboard', getDashboard);

router.get('/tasks', validate(getTasksQuerySchema, 'query'), getTasks);
router.get('/tasks/:id', validate(idParamSchema, 'params'), getTaskById);
router.post('/tasks', validate(createTaskSchema), createTask);
router.put('/tasks/:id', validate(idParamSchema, 'params'), validate(updateTaskSchema), updateTask);
router.delete('/tasks/:id', validate(idParamSchema, 'params'), deleteTask);

module.exports = router;
