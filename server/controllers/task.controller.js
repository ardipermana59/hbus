const Task = require('../models/task.model');
const TaskLog = require('../models/task-log.model');
const ResponseHelper = require('../helpers/response');
const logger = require('../utils/logger');

/**
 * Create a new task
 *
 * @param {Object} req.body - The request body object
 * @param {Object} res - The response object
 *
 * @returns {Promise} - A promise that resolves to a response object
 *
 * @throws {Error} - If there is an error creating the task
 */
const createTask = async (req, res) => {
  try {
    const { title, description, assigned_to, status, start_date, end_date } = req.body;

    const taskData = {
      title,
      description,
      assigned_to,
      created_by: req.user.id,
      status: status || 'Belum Dimulai',
      start_date,
      end_date
    };

    const task = await Task.create(taskData);

    await TaskLog.create(
      task.id,
      req.user.id,
      `Task "${task.title}" dibuat`,
      null
    );

    return ResponseHelper.created(res, 'Task berhasil dibuat', task);
  } catch (error) {
    logger.error('Failed to create task', error, { user_id: req.user.id });
    return ResponseHelper.error(res, 500, 'Gagal membuat task', error.message);
  }
};

/**
 * GET - Fetch all tasks
 * @param {string} req.query.status - Filter by task status
 * @param {number} req.query.assigned_to - Filter by assigned to user ID
 * @param {Object} res - The response object
 *
 * @returns {Promise<Object>} - A promise that resolves to a response object with tasks data
 *
 * @throws {Error} - If there is an error fetching tasks
 */
const getTasks = async (req, res) => {
  try {
    const { status, assigned_to } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (assigned_to) filters.assigned_to = parseInt(assigned_to);

    const tasks = await Task.getAll(filters);

    return ResponseHelper.success(res, 200, 'Data task berhasil diambil', tasks);
  } catch (error) {
    logger.error('Failed to fetch tasks', error);
    return ResponseHelper.error(res, 500, 'Gagal mengambil data task', error.message);
  }
};

/**
 * GET - Fetch task by ID
 * @param {Object} req.params - The request parameters object
 * @param {number} req.params.id - The task ID
 * @param {Object} res - The response object
 *
 * @returns {Promise<Object>} - A promise that resolves to a response object with task data
 *
 * @throws {Error} - If there is an error fetching task by ID
 */
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return ResponseHelper.notFound(res, 'Task tidak ditemukan');
    }

    const logs = await TaskLog.getByTaskId(id);
    return ResponseHelper.success(res, 200, 'Data task berhasil diambil', {
      ...task,
      logs
    });
  } catch (error) {
    logger.error('Failed to fetch task by ID', error, { task_id: req.params.id });
    return ResponseHelper.error(res, 500, 'Gagal mengambil data task', error.message);
  }
};

/**
 * PUT - Update task
 * @param {Object} req.params - The request parameters object
 * @param {number} req.params.id - The task ID
 * @param {Object} req.body - The request body object
 * @param {string} req.body.title - The new task title
 * @param {string} req.body.description - The new task description
 * @param {number} req.body.assigned_to - The new task assigned to user ID
 * @param {string} req.body.status - The new task status
 * @param {Date} req.body.start_date - The new task start date
 * @param {Date} req.body.end_date - The new task end date
 * @param {Object} res - The response object
 *
 * @returns {Promise<Object>} - A promise that resolves to a response object with updated task data
 *
 * @throws {Error} - If there is an error updating task
 */
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, assigned_to, status, start_date, end_date } = req.body;

    const oldTask = await Task.findById(id);

    if (!oldTask) {
      return ResponseHelper.notFound(res, 'Task tidak ditemukan');
    }

    const taskData = {
      title,
      description,
      assigned_to,
      status,
      start_date,
      end_date
    };

    const updatedTask = await Task.update(id, taskData);
    let logAction = `Task "${updatedTask.title}" diupdate`;

    await TaskLog.create(
      updatedTask.id,
      req.user.id,
      logAction,
      null
    );

    return ResponseHelper.success(res, 200, 'Task berhasil diupdate', updatedTask);
  } catch (error) {
    logger.error('Failed to update task', error, { task_id: req.params.id });
    return ResponseHelper.error(res, 500, 'Gagal mengupdate task', error.message);
  }
};

/**
 * DELETE - Delete task by ID
 * @param {Object} req.params - The request parameters object
 * @param {number} req.params.id - The task ID
 * @param {Object} res - The response object
 *
 * @returns {Promise<Object>} - A promise that resolves to a response object with task data
 *
 * @throws {Error} - If there is an error deleting task
 */
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return ResponseHelper.notFound(res, 'Task tidak ditemukan');
    }

    await TaskLog.create(
      task.id,
      req.user.id,
      `Task "${task.title}" dihapus`,
      null
    );

    await Task.delete(id);

    return ResponseHelper.success(res, 200, 'Task berhasil dihapus', task);
  } catch (error) {
    logger.error('Failed to delete task', error, { task_id: req.params.id });
    return ResponseHelper.error(res, 500, 'Gagal menghapus task', error.message);
  }
};



module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
