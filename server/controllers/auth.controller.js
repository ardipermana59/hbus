const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const ResponseHelper = require('../helpers/response');

/**
 * Login user
 * @function
 * @async
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {Promise<Object>}
 * @throws {Error} - if login failed
 */
/*
 * Request Body:
 * {
 *   email: string,
 *   password: string
 * }
 *
 * Response:
 * {
 *   token: string,
 *   user: {
 *     id: number,
 *     name: string,
 *     email: string,
 *     role: string
 *   }
 * }
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);

    if (!user) {
      return ResponseHelper.notFound(res, 'Email atau password salah');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return ResponseHelper.unauthorized(res, 'Email atau password salah');
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return ResponseHelper.success(res, 200, 'Login berhasil', {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return ResponseHelper.error(res, 500, 'Internal Server Error', error.message);
  }
};

module.exports = { login };
