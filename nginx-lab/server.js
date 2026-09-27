const express = require('express');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev'));

// API route
app.get('/api/info', (req, res) => {
    res.json({
        appName: process.env.APP_NAME || 'Node-Default',
        hostname: require('os').hostname(),
        port: PORT
    });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Serving environment: ${process.env.NODE_ENV || 'development'}`);
});
