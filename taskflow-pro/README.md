# ⚡ TaskFlow Pro — MERN Full-Stack Project

A production-grade, role-based task management system built with MongoDB, Express, React, and Node.js.

## Features
- JWT Authentication with httpOnly cookies
- Role-Based Access Control (Admin / Manager / Employee)
- Task CRUD with search, filters & server-side pagination
- Dashboard with Recharts visualizations
- MongoDB aggregation pipeline for stats
- Global error handling middleware

## Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

---

## 🚀 Setup & Run

### 1. Clone / open the project
```bash
cd taskflow-pro
```

### 2. Backend setup
```bash
cd server
cp .env.example .env
# Edit .env — set your MONGO_URI and JWT_SECRET
npm install
```

### 3. Frontend setup (new terminal)
```bash
cd client
npm install
```

### 4. Start both servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

### 5. Seed test data
```bash
cd server
node seed.js
```

### 6. Open the app
Visit http://localhost:5173

---

## Test Accounts (after seeding)
| Email | Password | Role |
|-------|----------|------|
| admin@test.com | password123 | Admin |
| manager@test.com | password123 | Manager |
| employee@test.com | password123 | Employee |

---

## API Endpoints
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| POST | /api/auth/logout | Authenticated |
| GET | /api/auth/me | Authenticated |
| GET | /api/tasks | All roles |
| GET | /api/tasks/dashboard | All roles |
| POST | /api/tasks | Admin, Manager |
| PUT | /api/tasks/:id | All roles |
| DELETE | /api/tasks/:id | Admin, Manager |

## Tech Stack
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- **Frontend:** React 18, Vite, React Router, Axios, Recharts, React Hot Toast
