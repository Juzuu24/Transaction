const mysql = require("mysql2");

// Setting connect MySQL (Connection Pool)
const db = mysql.createPool({
    host: "db",
    user: "root",
    password: "juzuu24",
    database: "user",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Check connect MySQL
db.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL database");
        connection.release(); // release Connection back to Pool
    }
});

// Export the db connection pool
module.exports = db;