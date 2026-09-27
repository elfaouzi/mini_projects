const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { initializeDatabase } = require('./config/database');
const todoRoutes = require('./routes/todoRoutes');


const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/todos', todoRoutes);

// Serve the main HTML file for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Initialize database and start server
const startServer = async () => {
    try {
        await initializeDatabase();
        console.log('Database initialized successfully!');
        
        app.listen(port, () => {
            console.log(`🚀 Todo App server running at http://localhost:${port}`);
            console.log('📝 Features available:');
            console.log('   - Create, read, update, delete todos');
            console.log('   - Mark todos as completed/pending');
            console.log('   - Filter todos by status');
            console.log('   - Responsive design');
            console.log('   - Real-time statistics');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
