const jwt = require('jsonwebtoken');
const ResponseHelper = require('../helpers/response');

require('dotenv').config();

const verifyToken = (req, res, next) => {
  // Ambil token dari header
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    return ResponseHelper.unauthorized(res, 'Unauthorized.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (error) {
    return ResponseHelper.unauthorized(res, 'Unauthorized.');
  }
};

const isManager = (req, res, next) => {
  if (req.user.role !== 'manager') {
    return ResponseHelper.forbidden(res, 'Forbidden.');
  }
  next();
};

module.exports = { verifyToken, isManager };
