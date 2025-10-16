const TaskLog = require('../models/task-log.model');
const ResponseHelper = require('../helpers/response');
const logger = require('../utils/logger');

/**
 * GET - Fetch all logs
 * @param {Object} req.query - Query parameters
 * @param {number} req.query.task_id - Filter by task ID
 * @param {number} req.query.user_id - Filter by user ID
 * @param {number} req.query.limit - Limit the number of logs returned
 * @returns {Promise<Object>} - The response object
 */
const getAllLogs = async (req, res) => {
  try {
    const { task_id, user_id, limit } = req.query;
    const filters = {};
    
    if (task_id) filters.task_id = parseInt(task_id);
    if (user_id) filters.user_id = parseInt(user_id);
    if (limit) filters.limit = parseInt(limit);

    const logs = await TaskLog.getAll(filters);

    return ResponseHelper.success(res, 200, 'Data logs berhasil diambil', logs);
  } catch (error) {
    logger.error('Failed to fetch logs', error);
    return ResponseHelper.error(res, 500, 'Internal Server Error', error.message);
  }
};

/**
 * GET - Fetch logs by task ID
 * @param {Object} req.params - Request parameters
 * @param {number} req.params.taskId - Task ID
 * @returns {Promise<Object>} - The response object
 */
const getLogsByTaskId = async (req, res) => {
  try {
    const { taskId } = req.params;

    const logs = await TaskLog.getByTaskId(taskId);

    return ResponseHelper.success(res, 200, 'Data logs berhasil diambil', logs);
  } catch (error) {
    logger.error('Failed to fetch logs by task ID', error, { task_id: req.params.taskId });
    return ResponseHelper.error(res, 500, 'Internal Server Error', error.message);
  }
};

module.exports = {
  getAllLogs,
  getLogsByTaskId
};
