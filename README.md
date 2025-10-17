# Team Task Tracker

Full-stack aplikasi manajemen task dengan Node.js backend dan React frontend.

## Tech Stack

### Backend
- Node.js + Express.js
- PostgreSQL
- JWT Authentication
- Joi Validation

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router DOM
- Axios

## Features

- Authentication dengan JWT
- Dashboard dengan statistik task
- Task Management (CRUD) dengan filtering
- User Management (CRUD)
- Task Activity Logs
- Protected Routes
- Responsive Design

## Quick Start

### Prerequisites
- Node.js
- npm
- PostgreSQL

### Backend Setup

1. Navigate ke folder server:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables (copy `.env.example` ke `.env`):
```env
PORT=5000
DATABASE_URL=postgres://username:password@localhost:5432/database_name
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

4. Setup database dan jalankan SQL schema. Import dari file `database.sql`

5. Start server:
```bash
npm run dev
```

Server berjalan di `http://localhost:5000`

### Frontend Setup

1. Navigate ke folder frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables (copy `.env.example` ke `.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

4. Start development server:
```bash
npm run dev
```

Frontend berjalan di `http://localhost:5173`

## Documentation

- [Backend Documentation](./server/README.md) - API endpoints, database schema, dan backend setup
- [Frontend Documentation](./frontend/README.md) - Component structure, routing, dan frontend setup

## API Base URL

```
http://localhost:5000/api/v1
```

## Default Login

Setelah setup database, gunakan credentials sesuai dengan user yang telah dibuat.

## Development

### Backend Development
```bash
cd server
npm run dev
```

### Frontend Development
```bash
cd frontend
npm run dev
```
