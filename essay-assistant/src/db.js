// db.js
const mysql = require('mysql2');

// Create a connection to the MySQL database with hardcoded credentials
const db = mysql.createConnection({
    host: 'junction.proxy.rlwy.net', // Use the actual host from your Railway config
    user: 'root',                     // Your actual username
    password: 'VfpAfzOSfnhFboanCtgbLCTWHffQjvTH', // Your actual password
    database: 'railway',              // Your actual database name
    port: 10861                        // Add the port if necessary
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the MySQL database.');

    // Create the essays table if it doesn't exist
    const createEssaysTable = `
    CREATE TABLE IF NOT EXISTS essays (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

    db.query(createEssaysTable, (err) => {
        if (err) {
            console.error('Error creating essays table:', err);
            return;
        }
        console.log('Essays table is ready.');
    });
});

module.exports = db; // Export the db connection
