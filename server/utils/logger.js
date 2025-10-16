const fs = require('fs');
const path = require('path');

/**
 * Logger Utility
 * Simple logger untuk mencatat activity, error, dan info
 */
class Logger {
  constructor() {
    this.logsDir = path.join(__dirname, '../logs');
    this.ensureLogDirectory();
  }

  /**
   * Utk memastikan folder logs exists
   */
  ensureLogDirectory() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  /**
   * Format timestamp
   */
  getTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Write log to file
   */
  writeToFile(filename, message) {
    const logFile = path.join(this.logsDir, filename);
    const logMessage = `[${this.getTimestamp()}] ${message}\n`;

    fs.appendFile(logFile, logMessage, (err) => {
      if (err) console.error('Error writing to log file:', err);
    });
  }

  /**
   * Format log message
   */
  formatMessage(level, message, meta = {}) {
    let formattedMessage = `${level.toUpperCase()}: ${message}`;

    if (Object.keys(meta).length > 0) {
      formattedMessage += ` | ${JSON.stringify(meta)}`;
    }

    return formattedMessage;
  }

  /**
   * Info log - untuk informasi umum
   */
  info(message, meta = {}) {
    const formattedMessage = this.formatMessage('INFO', message, meta);
    this.writeToFile('app.log', formattedMessage);
  }

  /**
   * Success log - untuk operasi yang berhasil
   */
  success(message, meta = {}) {
    const formattedMessage = this.formatMessage('SUCCESS', message, meta);
    this.writeToFile('app.log', formattedMessage);
  }

  /**
   * Warning log - untuk peringatan
   */
  warn(message, meta = {}) {
    const formattedMessage = this.formatMessage('WARN', message, meta);
    this.writeToFile('app.log', formattedMessage);
  }

  /**
   * Error log - untuk error
   */
  error(message, error = null, meta = {}) {
    let errorDetails = { ...meta };

    if (error) {
      errorDetails.error = error.message;
      errorDetails.stack = error.stack;
    }

    const formattedMessage = this.formatMessage('ERROR', message, errorDetails);
    this.writeToFile('error.log', formattedMessage);
    this.writeToFile('app.log', formattedMessage);
  }

  /**
   * HTTP request log
   */
  http(method, url, statusCode, responseTime, meta = {}) {
    const message = `${method} ${url} - ${statusCode} - ${responseTime}ms`;
    const formattedMessage = this.formatMessage('HTTP', message, meta);
    this.writeToFile('http.log', formattedMessage);
  }

  /**
   * Database query log
   */
  db(operation, table, duration = null, meta = {}) {
    let message = `DB ${operation} on ${table}`;
    if (duration) {
      message += ` - ${duration}ms`;
    }
    const formattedMessage = this.formatMessage('DB', message, meta);
    this.writeToFile('db.log', formattedMessage);
  }
}

module.exports = new Logger();
