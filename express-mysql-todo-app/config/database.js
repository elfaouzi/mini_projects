const mysql = require('mysql2');

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todo_db'
};

// Create connection pool for better performance
const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Create connection for initial setup
const connection = mysql.createConnection(dbConfig);

// Initialize database and tables
const initializeDatabase = () => {
    return new Promise((resolve, reject) => {
        connection.connect(err => {
            if (err) {
                console.error('Error connecting to MySQL:', err);
                reject(err);
                return;
            }
            console.log('Connected to MySQL!');

            // Create todos table if it doesn't exist
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS todos (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    completed BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            `;

            connection.query(createTableQuery, (err, result) => {
                if (err) {
                    console.error('Error creating todos table:', err);
                    reject(err);
                    return;
                }
                console.log('Todos table ready!');
                resolve();
            });
        });
    });
};

module.exports = {
    pool: pool.promise(),
    connection,
    initializeDatabase
};