const pool = require('../config/db');

class Task {
  static async create(taskData) {
    const { title, description, assigned_to, created_by, status, start_date, end_date } = taskData;
    const result = await pool.query(
      `INSERT INTO tasks (title, description, assigned_to, created_by, status, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, assigned_to, created_by, status || 'Belum Dimulai', start_date, end_date]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT t.*,
              u1.name as assigned_to_name,
              u2.name as created_by_name
       FROM tasks t
       LEFT JOIN users u1 ON t.assigned_to = u1.id
       LEFT JOIN users u2 ON t.created_by = u2.id
       WHERE t.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async getAll(filters = {}) {
    let query = `
      SELECT t.*,
             u1.name as assigned_to_name,
             u2.name as created_by_name
      FROM tasks t
      LEFT JOIN users u1 ON t.assigned_to = u1.id
      LEFT JOIN users u2 ON t.created_by = u2.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (filters.status) {
      query += ` AND t.status = $${paramCount++}`;
      params.push(filters.status);
    }

    if (filters.assigned_to) {
      query += ` AND t.assigned_to = $${paramCount++}`;
      params.push(filters.assigned_to);
    }

    query += ' ORDER BY t.created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async update(id, taskData) {
    const { title, description, assigned_to, status, start_date, end_date } = taskData;
    const result = await pool.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           assigned_to = COALESCE($3, assigned_to),
           status = COALESCE($4, status),
           start_date = COALESCE($5, start_date),
           end_date = COALESCE($6, end_date),
           updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [title, description, assigned_to, status, start_date, end_date, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  static async getStatsByStatus() {
    const result = await pool.query(
      `SELECT status, COUNT(*) as count
       FROM tasks
       GROUP BY status
       ORDER BY count DESC`
    );
    return result.rows;
  }

  static async getStatsByUser() {
    const result = await pool.query(
      `SELECT u.id, u.name, COUNT(t.id) as task_count
       FROM users u
       LEFT JOIN tasks t ON u.id = t.assigned_to
       GROUP BY u.id, u.name
       ORDER BY task_count DESC`
    );
    return result.rows;
  }

  static async getRecentInProgress() {
    const result = await pool.query(
      `SELECT t.*, u.name as assigned_to_name
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.status = 'Sedang Dikerjakan'
       ORDER BY t.updated_at DESC
       LIMIT 10`
    );
    return result.rows;
  }
}

module.exports = Task;
