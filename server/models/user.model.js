const pool = require('../config/db');

class User {
  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async create(name, email, hashedPassword, role = 'member') {
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [name, email, hashedPassword, role]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY name'
    );
    return result.rows;
  }
}

module.exports = User;
