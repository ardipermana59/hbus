const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const ResponseHelper = require('../helpers/response');
const logger = require('../utils/logger');

/**
 * GET - Fetch all users
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 *
 * @returns {Promise<Object>} - A promise that resolves to a response object with users data
 *
 * @throws {Error} - If there is an error fetching users
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();

    return ResponseHelper.success(res, 200, 'Data users berhasil diambil', users);
  } catch (error) {
    logger.error('Get all users error:', error);
    return ResponseHelper.error(res, 500, 'Gagal mengambil data users', error.message);
  }
};

/**
 * GET - Fetch user by ID
 * @param {Object} req.params - The request parameters object
 * @param {number} req.params.id - The user ID
 * @param {Object} res - The response object
 *
 * @returns {Promise<Object>} - A promise that resolves to a response object with user data
 *
 * @throws {Error} - If there is an error fetching user by ID
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return ResponseHelper.notFound(res, 'User tidak ditemukan');
    }

    return ResponseHelper.success(res, 200, 'Data user berhasil diambil', user);
  } catch (error) {
    logger.error('Get user by ID error:', error);
    return ResponseHelper.error(res, 500, 'Gagal mengambil data user', error.message);
  }
};

/**
 * POST - Create a new user
 * @param {Object} req.body - The request body object
 * @param {string} req.body.name - The new user name
 * @param {string} req.body.email - The new user email
 * @param {string} req.body.password - The new user password
 * @param {string} req.body.role - The new user role (default: member)
 * @param {Object} res - The response object
 *
 * @returns {Promise<Object>} - A promise that resolves to a response object with the new user data
 *
 * @throws {Error} - If there is an error creating the user
 */
const createUser = async (req, res) => {
  try {
    const { name, email, password, role = 'member' } = req.body;

    const emailExists = await User.checkEmailExists(email);
    if (emailExists) {
      return ResponseHelper.error(res, 400, 'Email sudah terdaftar', [{
        field: 'email',
        message: 'Email sudah terdaftar'
      }]);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create(name, email, hashedPassword, role);

    return ResponseHelper.success(res, 201, 'User berhasil dibuat', newUser);
  } catch (error) {
    logger.error('Create user error:', error);
    return ResponseHelper.error(res, 500, 'Gagal membuat user', error.message);
  }
};

/**
 * PUT - Update user by ID
 * @param {Object} req.params - The request parameters object
 * @param {number} req.params.id - The user ID
 * @param {Object} req.body - The request body object
 * @param {string} req.body.name - The new user name
 * @param {string} req.body.email - The new user email
 * @param {string} req.body.role - The new user role (default: member)
 * @param {Object} res - The response object
 *
 * @returns {Promise<Object>} - A promise that resolves to a response object with the updated user data
 *
 * @throws {Error} - If there is an error updating the user
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return ResponseHelper.notFound(res, 'User tidak ditemukan');
    }

    const emailExists = await User.checkEmailExists(email, id);
    if (emailExists) {
      return ResponseHelper.error(res, 400, 'Email sudah terdaftar', [{
        field: 'email',
        message: 'Email sudah terdaftar'
      }]);
    }

    const updatedUser = await User.update(id, name, email, role);

    return ResponseHelper.success(res, 200, 'User berhasil diupdate', updatedUser);
  } catch (error) {
    logger.error('Update user error:', error);
    return ResponseHelper.error(res, 500, 'Gagal mengupdate user', error.message);
  }
};

/**
 * DELETE - Delete user by ID
 * @param {Object} req.params - The request parameters object
 * @param {number} req.params.id - The user ID
 * @param {Object} res - The response object
 *
 * @returns {Promise<Object>} - A promise that resolves to a response object with deleted user data
 *
 * @throws {Error} - If there is an error deleting user
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return ResponseHelper.notFound(res, 'User tidak ditemukan');
    }

    const deletedUser = await User.delete(id);

    return ResponseHelper.success(res, 200, 'User berhasil dihapus', deletedUser);
  } catch (error) {
    logger.error('Delete user error:', error);
    return ResponseHelper.error(res, 500, 'Gagal menghapus user', error.message);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
