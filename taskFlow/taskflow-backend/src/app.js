const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/taskRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://192.168.1.143',  // your IIS frontend IP
  methods: ['GET','POST','PUT','DELETE'],
  credentials: false               // if you need cookies/auth
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/tasks', taskRoutes);

// 404 & Errors
app.use(notFound);
app.use(errorHandler);

module.exports = app;
