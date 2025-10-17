const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Config
require('dotenv').config();

const ResponseHelper = require('./helpers/response');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const taskRoutes = require('./routes/task.routes');
const logRoutes = require('./routes/log.routes');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware untuk logging setiap request
app.use((req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    logger.http(req.method, req.originalUrl, res.statusCode, responseTime, {
      ip: req.ip,
      user_agent: req.get('user-agent')
    });
  });

  next();
});

// Routes
app.use('/api/v1', authRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', taskRoutes);
app.use('/api/v1', logRoutes);

app.use((req, res) => {
  return ResponseHelper.notFound(res, 'Endpoint tidak ditemukan');
});

app.use((err, req, res, next) => {
  const message = err.message || 'Internal Server Error';
  logger.error(message, err, {
    path: req.path,
    method: req.method,
    body: req.body
  });

  return ResponseHelper.error(
    res,
    err.statusCode || 500,
    message,
    process.env.NODE_ENV === 'development' ? err.stack : undefined
  );
});

app.listen(PORT, () => {
  logger.info(`Server started on http://localhost:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;