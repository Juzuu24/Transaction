require("dotenv").config(); // <-- Load .env if needed
const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const db = require("./utils/database");
const qbRoutes = require("./routes/qb");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL session store config using env
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    expiration: 1000 * 60 * 60 * 2, // 2 hours
    createDatabaseTable: true,
    schema: {
        tableName: "sessions",
        columnNames: {
            session_id: "session_id",
            expires: "expires",
            data: "data"
        }
    }
});

// Session setup
app.use(session({
    key: "session_cookie_name",
    secret: "f4a9b8c6e3d1a5f9c3b2d4e8f6a7c9b1d3e5f8a4b2c6e9d7", // use .env for production
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 2 // 2 hours
    }
}));

// Serve static files
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/product", express.static("public/product"));

// Set EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Authentication middleware
const authMiddleware = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/");
    }
    next();
};

// Routes
app.get("/", (req, res) => {
    res.render("logIn", { title: "Login for Admin", errorMessage: "" });
});

app.get("/dashboard", authMiddleware, (req, res) => {
    res.render("dashboard", { title: "Dashboard", user: req.session.user });
});

app.get("/add-admin", (req, res) => {
    res.render("addAdmin", { title: "Add New Admin", errorMessage: "" });
});

app.use(qbRoutes);

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const query = "SELECT * FROM users WHERE username = ? AND password = ?";

    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Server error. Please try again." });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Username or password is incorrect" });
        }

        req.session.user = {
            id: results[0].id,
            username: results[0].username,
            sessionID: req.sessionID
        };

        console.log("Login Success:", req.session.user);
        res.json({ message: "Login successful", redirect: "/dashboard" });
    });
});

app.post("/api/add-admin", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Please fill in all the required information." });
    }

    const query = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.query(query, [username, password], (err, result) => {
        if (err) {
            console.error("Database connection error:", err);
            return res.status(500).json({ message: "Database connection error" });
        }
        res.json({ message: "New admin added successfully!" });
    });
});

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout error:", err);
        }
        res.redirect("/");
    });
});

// 404
app.use((req, res) => {
    res.status(404).render("404", { title: "404 Not Found" });
});

// Start server
const PORT = process.env.PORT || 4100;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
