const express = require('express');
const router = express.Router();
const { getAllLogs, getLogsByTaskId } = require('../controllers/log.controller');
const { verifyToken, isManager } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { taskIdParamSchema, getLogsQuerySchema } = require('../validators/log.validator');

router.use(verifyToken);
router.use(isManager);

router.get('/task-logs', validate(getLogsQuerySchema, 'query'), getAllLogs);
router.get('/task-logs/:taskId', validate(taskIdParamSchema, 'params'), getLogsByTaskId);

module.exports = router;
