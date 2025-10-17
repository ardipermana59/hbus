# Frontend - Team Task Tracker

React application untuk sistem manajemen task dengan TailwindCSS styling.

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **State Management:** React Context API

## Installation & Setup

### Prerequisites
- Node.js
- npm
- Backend server running di `http://localhost:5000`

### Steps

1. **Install dependencies**
```bash
npm install
```

2. **Setup environment variables**

Copy `.env.example` ke `.env` dan sesuaikan:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

3. **Run application**

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

Aplikasi akan berjalan di `http://localhost:5173`

## Project Structure

```
frontend/
├── public/                     # Static assets
├── src/
│   ├── api/                   # API service layer
│   │   ├── axios.js          # Axios instance & interceptors
│   │   ├── auth.js           # Auth API calls
│   │   ├── tasks.js          # Tasks API calls
│   │   ├── users.js          # Users API calls
│   │   └── logs.js           # Logs API calls
│   │
│   ├── components/           # Reusable components
│   │   ├── Button.jsx        # Button component
│   │   ├── Input.jsx         # Input component
│   │   ├── Select.jsx        # Select component
│   │   ├── Modal.jsx         # Modal component
│   │   ├── Layout.jsx        # Main layout with navbar
│   │   ├── ProtectedRoute.jsx # Route guard
│   │   ├── TaskForm.jsx      # Task form
│   │   ├── TaskDetail.jsx    # Task detail view
│   │   └── UserForm.jsx      # User form
│   │
│   ├── contexts/             # React contexts
│   │   └── AuthContext.jsx   # Authentication context
│   │
│   ├── pages/                # Page components
│   │   ├── Login.jsx         # Login page
│   │   ├── Dashboard.jsx     # Dashboard page
│   │   ├── Tasks.jsx         # Tasks management page
│   │   └── Users.jsx         # Users management page
│   │
│   ├── utils/                # Utility functions
│   │   ├── constants.js      # App constants
│   │   └── formatters.js     # Date/time formatters
│   │
│   ├── App.jsx               # Main app component with routing
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles + Tailwind
│
├── .env.example              # Environment template
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
├── vite.config.js            # Vite configuration
└── package.json              # Dependencies & scripts
```

## Pages

### Login (`/login`)
- Login form dengan email & password
- Error handling
- Redirect ke dashboard setelah login sukses

### Dashboard (`/dashboard`)
- Statistik task (total, belum dimulai, sedang dikerjakan, selesai)
- Recent tasks list
- Protected route (requires authentication)

### Tasks (`/tasks`)
- Task list dengan filtering (status, assigned user)
- CRUD operations (Create, Read, Update, Delete)
- Task detail modal dengan activity logs
- Protected route (requires authentication)

### Users (`/users`)
- User list
- CRUD operations
- Protected route (requires authentication)

## Authentication

- JWT token disimpan di localStorage
- Automatic token injection ke setiap request
- Auto redirect ke login jika token invalid/expired
- Protected routes menggunakan ProtectedRoute component

## API Integration

Base URL: `http://localhost:5000/api/v1`

Semua API calls menggunakan axios instance yang sudah dikonfigurasi dengan:
- Automatic token injection
- Error handling & interceptors
- Consistent response format
