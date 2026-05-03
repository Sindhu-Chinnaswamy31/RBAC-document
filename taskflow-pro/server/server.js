// server/server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
require('dotenv').config();

connectDB();
const app = express();

// --- MIDDLEWARE CHAIN ---
// 1. CORS — must be first so preflight OPTIONS requests work
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// 2. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Cookie parser — needed to read httpOnly JWT cookie
app.use(cookieParser());

// 4. Logger — logs method, path, status, response time
app.use(morgan('dev'));

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// --- GLOBAL ERROR HANDLER (must be LAST) ---
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
