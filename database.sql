-- ========================================
-- TABEL USERS
-- ========================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) CHECK (role IN ('manager', 'member')) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- TABEL TASKS
-- ========================================
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'Belum Dimulai',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- TABEL TASK_LOGS
-- ========================================
CREATE TABLE task_logs (
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert dummy users (password: password)
INSERT INTO users (name, email, password, role) VALUES
('John Manager', 'manager@gmail.com', '$2a$12$GllWsIGlZKaKyqae4OZDH.ynS7z3ljKg9Wh52uA/M.hMvNFYgIohS', 'manager'),
('Jane Developer', 'budi@gmail.com', '$2a$12$GllWsIGlZKaKyqae4OZDH.ynS7z3ljKg9Wh52uA/M.hMvNFYgIohS', 'member'),
('Bob Designer', 'anduk@gmail.com', '$2a$12$GllWsIGlZKaKyqae4OZDH.ynS7z3ljKg9Wh52uA/M.hMvNFYgIohS', 'member'),
('Alice Tester', 'mia@gmail.com', '$2a$12$GllWsIGlZKaKyqae4OZDH.ynS7z3ljKg9Wh52uA/M.hMvNFYgIohS', 'member');

-- Insert dummy tasks
INSERT INTO tasks (title, description, assigned_to, created_by, status, start_date, end_date) VALUES
('Desain UI Dashboard', 'Buat desain mockup untuk dashboard admin', 3, 1, 'Sedang Dikerjakan', '2025-10-10', '2025-10-20'),
('Implementasi API Login', 'Buat endpoint login dengan JWT', 2, 1, 'Selesai', '2025-10-05', '2025-10-12'),
('Testing Fitur Task Management', 'Test semua endpoint task CRUD', 4, 1, 'Belum Dimulai', '2025-10-15', '2025-10-22'),
('Database Migration', 'Setup database PostgreSQL', 2, 1, 'Selesai', '2025-10-01', '2025-10-05'),
('Dokumentasi API', 'Buat dokumentasi untuk semua endpoint', 2, 1, 'Sedang Dikerjakan', '2025-10-12', '2025-10-18');

-- Insert dummy task logs
INSERT INTO task_logs (task_id, user_id, action, note) VALUES
(1, 1, 'Task "Desain UI Dashboard" dibuat', NULL),
(1, 1, 'Status diubah dari "Belum Dimulai" ke "Sedang Dikerjakan"', 'Mulai mengerjakan desain'),
(2, 1, 'Task "Implementasi API Login" dibuat', NULL),
(2, 1, 'Status diubah dari "Belum Dimulai" ke "Sedang Dikerjakan"', NULL),
(2, 1, 'Status diubah dari "Sedang Dikerjakan" ke "Selesai"', 'API login sudah berhasil diimplementasi'),
(3, 1, 'Task "Testing Fitur Task Management" dibuat', NULL),
(4, 1, 'Task "Database Migration" dibuat', NULL),
(4, 1, 'Status diubah dari "Belum Dimulai" ke "Selesai"', 'Database sudah siap'),
(5, 1, 'Task "Dokumentasi API" dibuat', NULL),
(5, 1, 'Status diubah dari "Belum Dimulai" ke "Sedang Dikerjakan"', NULL);
