const Task = require('../models/task.model');
const TaskLog = require('../models/task-log.model');
const ResponseHelper = require('../helpers/response');
const logger = require('../utils/logger');

/**
 * Get dashboard data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise} - Promise object with response data on success or error message on failure
 */
const getDashboard = async (req, res) => {
  try {
    const statsByStatus = await Task.getStatsByStatus();
    const statsByUser = await Task.getStatsByUser();
    const mostActiveUser = await TaskLog.getMostActiveUser();
    const recentInProgress = await Task.getRecentInProgress();

    return ResponseHelper.success(res, 200, 'Data dashboard berhasil diambil', {
      tasks_by_status: statsByStatus,
      tasks_by_user: statsByUser,
      most_active_user: mostActiveUser,
      recent_in_progress_tasks: recentInProgress
    });
  } catch (error) {
    logger.error('Failed to fetch dashboard data', error);
    return ResponseHelper.error(res, 500, 'Internal Server Error', error.message);
  }
};

module.exports = {
  getDashboard
};