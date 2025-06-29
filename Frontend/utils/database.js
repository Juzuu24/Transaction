const mysql = require("mysql2/promise");


const dbConfig = {
    host: "localhost",
    user: "root",
    password: "juzuu24",
    database: "user",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};


const db = mysql.createPool(dbConfig);


(async () => {
    try {
        const connection = await db.getConnection(); 
        console.log("Connected to MySQL database");
        connection.release(); 
    } catch (err) {
        console.error("Database connection failed:", err);
    }
})();


async function executeQuery(sql, values = []) {
    try {
        const [results] = await db.execute(sql, values);
        return results;
    } catch (err) {
        console.error("Query Execution Error:", err);
        throw err;
    }
}


module.exports = {
    db,
    dbConfig,
    executeQuery,
};
