const pool = require('../config/db');

class TaskLog {
  static async create(task_id, user_id, action, note = null) {
    const result = await pool.query(
      `INSERT INTO task_logs (task_id, user_id, action, note)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [task_id, user_id, action, note]
    );
    return result.rows[0];
  }

  static async getByTaskId(task_id) {
    const result = await pool.query(
      `SELECT tl.*, u.name as user_name
       FROM task_logs tl
       LEFT JOIN users u ON tl.user_id = u.id
       WHERE tl.task_id = $1
       ORDER BY tl.created_at DESC`,
      [task_id]
    );
    return result.rows;
  }

  static async getAll(filters = {}) {
    let query = `
    SELECT tl.*, u.name AS user_name, t.title AS task_title
    FROM task_logs tl
    LEFT JOIN users u ON tl.user_id = u.id
    LEFT JOIN tasks t ON tl.task_id = t.id
  `;

    const conditions = [];
    const values = [];
    let paramCount = 1;

    if (filters.task_id) {
      conditions.push(`tl.task_id = $${paramCount++}`);
      values.push(filters.task_id);
    }

    if (filters.user_id) {
      conditions.push(`tl.user_id = $${paramCount++}`);
      values.push(filters.user_id);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY tl.created_at DESC";

    if (filters.limit) {
      query += ` LIMIT $${paramCount++}`;
      values.push(filters.limit);
    } else {
      query += " LIMIT 100";
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async getMostActiveUser() {
    const result = await pool.query(
      `SELECT u.id, u.name, COUNT(tl.id) as log_count
       FROM users u
       LEFT JOIN task_logs tl ON u.id = tl.user_id
       GROUP BY u.id, u.name
       ORDER BY log_count DESC
       LIMIT 1`
    );
    return result.rows[0];
  }
}

module.exports = TaskLog;
