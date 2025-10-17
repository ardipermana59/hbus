# Server - Task Management API

RESTful API server untuk sistem manajemen task 

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js ^4.18.2
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken ^9.0.2)
- **Password Hashing:** bcrypt ^5.1.1
- **Validation:** Joi ^17.11.0
- **Database Driver:** pg ^8.11.3
- **Other:** cors, dotenv, body-parser

## Installation & Setup

### Prerequisites
- Node.js 
- npm
- PostgreSQL

### Steps

1. **Install dependencies**
```bash
npm install
```

2. **Setup environment variables**

Copy `.env.example` ke `.env` dan sesuaikan:
```env
PORT=5000
DATABASE_URL=postgres://username:password@localhost:5432/database_name
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

3. **Setup database**

Buat database dan jalankan SQL schema untuk membuat tabel yang diperlukan.

4. **Run application**

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

## Project Structure

```
server/
├── app.js                      # Main application entry point
├── package.json                # Dependencies & scripts
├── .env.example                # Environment template
├── nodemon.json                # Nodemon configuration
│
├── config/
│   └── db.js                   # PostgreSQL connection pool
│
├── routes/
│   ├── auth.routes.js          # Auth endpoints
│   ├── user.routes.js          # User CRUD endpoints
│   ├── task.routes.js          # Task CRUD & dashboard endpoints
│   └── log.routes.js           # Task logs endpoints
│
├── controllers/
│   ├── auth.controller.js      # Login logic
│   ├── user.controller.js      # User business logic
│   ├── task.controller.js      # Task business logic
│   ├── dashboard.controller.js # Dashboard statistics
│   └── log.controller.js       # Task logs logic
│
├── models/
│   ├── user.model.js           # User database queries
│   ├── task.model.js           # Task database queries
│   └── task-log.model.js       # Task logs database queries
│
├── middleware/
│   ├── auth.middleware.js      # JWT verification & role check
│   └── validation.middleware.js # Request validation with Joi
│
├── validators/
│   ├── auth.validator.js       # Login validation schema
│   ├── user.validator.js       # User validation schemas
│   ├── task.validator.js       # Task validation schemas
│   └── log.validator.js        # Log validation schemas
│
├── helpers/
│   └── response.js             # Standardized API responses
│
├── utils/
│   └── logger.js               # Application logging utility
│
└── logs/
    ├── app.log                 # General logs
    ├── error.log               # Error logs
    └── http.log                # HTTP request logs
```

## API Endpoints

Base URL: `http://localhost:5000/api/v1`

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/login` | No | Login user |

**POST /login**
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "name": "User Name",
      "email": "user@example.com",
      "role": "manager"
    }
  }
}
```

---

### User Management

**All endpoints require: JWT Token + Manager Role**

Header: `Authorization: Bearer <token>`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create new user |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

**POST /users**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "member"  // optional, default: "member"
}
```

**PUT /users/:id**
```json
{
  "name": "John Updated",
  "email": "john.new@example.com",
  "role": "manager"
}
```

---

### Task Management

**All endpoints require: JWT Token + Manager Role**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Get dashboard statistics |
| GET | `/tasks` | Get all tasks (with filters) |
| GET | `/tasks/:id` | Get task by ID with logs |
| POST | `/tasks` | Create new task |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

**GET /tasks** - Query params:
- `status` (optional): `Belum Dimulai` / `Sedang Dikerjakan` / `Selesai`
- `assigned_to` (optional): User ID

**POST /tasks**
```json
{
  "title": "Task Title",
  "description": "Task description",
  "assigned_to": 2,  // optional
  "status": "Belum Dimulai",  // optional
  "start_date": "2024-01-20",  // optional
  "end_date": "2024-01-30"  // optional
}
```

**PUT /tasks/:id** - All fields optional
```json
{
  "title": "Updated Title",
  "status": "Sedang Dikerjakan",
  "assigned_to": 3
}
```

---

### Task Logs

**All endpoints require: JWT Token + Manager Role**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/task-logs` | Get all logs (with filters) |
| GET | `/task-logs/:taskId` | Get logs for specific task |

**GET /task-logs** - Query params:
- `task_id` (optional): Task ID
- `user_id` (optional): User ID
- `limit` (optional): 1-100, default: 100

---

## Testing (Coming Soon)
