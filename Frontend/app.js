const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const { db } = require("./utils/database"); // Assuming you export 'db' directly
const { dbConfig } = require("./utils/database");
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

function generateInviteCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Enhanced CORS configuration
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    exposedHeaders: ['set-cookie']
}));

// Session store with enhanced configuration
const sessionStore = new MySQLStore({
    ...dbConfig,
    clearExpired: true,
    checkExpirationInterval: 900000,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
});

// Session error handling
sessionStore.on('error', (error) => {
    console.error('SESSION STORE ERROR:', error);
});

// Enhanced session middleware
app.use(session({
    name: 'transaction.sid',
    secret: "jklfsodifjsktnwjasdp465dd",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 3600000, // 1 hour
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        path: '/'
    }
}));

// Session debugging middleware
app.use((req, res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('Session:', JSON.stringify(req.session, null, 2));
    next();
});

// Body parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (!req.session.authenticated) {
        console.log('Auth failed - session:', req.session);
        return res.redirect('/');
    }
    next();
};

// Routes
app.get("/", (req, res) => {
    if (req.session.authenticated) {
        return res.redirect('/dashboard');
    }
    res.render("login", { error: null });
});

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Replace with your actual authentication logic (consider using bcrypt for password hashing)
        if (username === 'ALVIN' && password === '1234') {
            req.session.regenerate((err) => {
                if (err) {
                    console.error('Session regeneration error:', err);
                    return res.status(500).render('login', { error: 'Login failed during session start' });
                }

                req.session.authenticated = true;
                req.session.userId = 2;
                req.session.username = username;

                console.log('New session created:', req.session);
                return res.redirect('/dashboard');
            });
        } else {
            return res.render('login', { error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).render('login', { error: 'Login failed due to server error' });
    }
});

app.get("/dashboard", requireAuth, async (req, res) => {
    try {
        console.log('Accessing dashboard with session:', req.session);

        const [userResult] = await db.execute('SELECT balance FROM signUp WHERE id = ?', [req.session.userId]);

        if (userResult.length === 0) {
            console.log(`User with ID ${req.session.userId} not found.`);
            return res.status(404).send('User not found');
        }

        // Get CashIn (Deposit) for current month
        const [depositResult] = await db.execute(`
            SELECT IFNULL(SUM(amount), 0) AS monthlyCashIn
            FROM deposit
            WHERE id = ? AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())
        `, [req.session.userId]);

        // Get CashOut (Withdraw) for current month
        const [withdrawResult] = await db.execute(`
            SELECT IFNULL(SUM(amount), 0) AS monthlyCashOut
            FROM withdrawals
            WHERE id = ? AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())
        `, [req.session.userId]);

        res.render("dashboard", {
            user: req.session.username,
            balance: userResult[0].balance,
            monthlyCashIn: depositResult[0].monthlyCashIn,
            monthlyCashOut: withdrawResult[0].monthlyCashOut
        });

    } catch (err) {
        console.error('Error fetching dashboard data:', err);
        return res.status(500).send('Database error fetching dashboard data');
    }
});

app.get('/signup', (req, res) => {
    res.render('signup');
  });

// POST route to handle signup form submission
app.post('/signup', (req, res) => {
  const { username, phone, email, password, confirmPassword } = req.body;

  // Basic validation (you can add more checks)
  if (password !== confirmPassword) {
    return res.send('Passwords do not match.');
  }

  // Simulate saving to DB
  console.log('User signed up:', { username, phone, email });

  // Redirect or show success message
  res.send('Account created successfully!');
});

  

app.get("/deposit", requireAuth, async (req, res) => {
    try {
        console.log('Accessing deposit with session:', req.session);

        const [results] = await db.execute('SELECT balance FROM signUp WHERE id = ?', [req.session.userId]);

        if (results.length === 0) {
            console.log(`User with ID ${req.session.userId} not found.`);
            return res.status(404).send('User not found');
        }

        res.render('deposit', {
            balance: results[0].balance,
            user: req.session.username
        });

    } catch (err) {
        console.error('Error fetching balance for deposit:', err);
        return res.status(500).send('Database error fetching balance');
    }
});

app.post("/deposit", requireAuth, async (req, res) => {
    const { amount, method, account } = req.body; // Assuming you implemented Solution 1

    try {
        await db.execute(
            'INSERT INTO deposit (id, amount, method, account) VALUES (?, ?, ?, ?)',
            [req.session.userId, amount, method, account]
        );

        const [updateResult] = await db.execute(
            'UPDATE signUp SET balance = balance + ? WHERE id = ?',
            [amount, req.session.userId]
        );

        if (updateResult.affectedRows === 0) {
            console.warn(`Balance not updated for user ID ${req.session.userId}`);
            return res.status(400).json({ error: 'Balance update failed' });
        }

        res.json({ success: true });

    } catch (err) {
        console.error('Error processing deposit:', err);
        return res.status(500).json({ error: 'Deposit failed' });
    }
});

app.get("/withdraw", requireAuth, async (req, res) => {
    try {
        console.log('Accessing withdraw with session:', req.session);

        const [results] = await db.execute('SELECT balance FROM signUp WHERE id = ?', [req.session.userId]);

        if (results.length === 0) {
            console.log(`User with ID ${req.session.userId} not found.`);
            return res.status(404).send('User not found');
        }

        res.render('withdraw', {
            balance: results[0].balance,
            user: req.session.username
        });

    } catch (err) {
        console.error('Error fetching balance for withdraw:', err);
        return res.status(500).send('Database error fetching balance');
    }
});

app.post("/withdraw", requireAuth, async (req, res) => {
    const { amount, method, account } = req.body; // Assuming you implemented Solution 1

    try {
        await db.execute(
            'INSERT INTO withdrawals (id, amount, method, account) VALUES (?, ?, ?, ?)',
            [req.session.userId, amount, method, account]
        );

        const [updateResult] = await db.execute(
            'UPDATE signUp SET balance = balance - ? WHERE id = ?',
            [amount, req.session.userId]
        );

        if (updateResult.affectedRows === 0) {
            console.warn(`Balance not updated for user ID ${req.session.userId}`);
            return res.status(400).json({ error: 'Balance update failed' });
        }

        res.json({ success: true });

    } catch (err) {
        console.error('Error processing deposit:', err);
        return res.status(500).json({ error: 'Deposit failed' });
    }
});


app.get("/checkin", (req, res) => {
    res.render("checkin", { title: "Check In", errorMessage: "" });
});

app.get("/event", (req, res) => {
    res.render("event", { 
        title: "Event", 
        errorMessage: "",
        dashboardUrl: "/dashboard"  // <-- add this line
    });
});


app.get('/transactions', async (req, res, next) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const { search = '', type = '' } = req.query;
    const like = `%${search}%`;

    // Query withdrawals only if type is empty or 'Withdraw'
    let withdraws = [];
    if (type === '' || type === 'Withdraw') {
      const wQuery = `
        SELECT withdraw_id AS id, created_at AS date, amount
        FROM withdrawals
        WHERE (? = '' OR withdraw_id LIKE ? OR created_at LIKE ?)
        ORDER BY created_at DESC
        LIMIT 10
      `;
      const [wRows] = await conn.execute(wQuery, [search, like, like]);
      withdraws = wRows.map(txn => ({
        ...txn,
        amount: Number(txn.amount),
        date: new Date(txn.date)
      }));
    }

    // Query deposits only if type is empty or 'Deposit'
    let deposits = [];
    if (type === '' || type === 'Deposit') {
      const dQuery = `
        SELECT deposit_id AS id, created_at AS date, amount
        FROM deposit
        WHERE (? = '' OR deposit_id LIKE ? OR created_at LIKE ?)
        ORDER BY created_at DESC
        LIMIT 10
      `;
      const [dRows] = await conn.execute(dQuery, [search, like, like]);
      deposits = dRows.map(txn => ({
        ...txn,
        amount: Number(txn.amount),
        date: new Date(txn.date)
      }));
    }

    await conn.end();

    res.render('transaction', {
      withdraws,
      deposits,
      search,
      type,
      dashboardUrl: '/dashboard'
    });
  } catch (err) {
    next(err);
  }
});




app.get("/order", requireAuth, async (req, res) => {
    try {
        console.log('Accessing withdraw with session:', req.session);

        const [results] = await db.execute('SELECT username,balance FROM signUp WHERE id = ?', [req.session.userId]);
        

        if (results.length === 0) {
            console.log(`User with ID ${req.session.userId} not found.`);
            return res.status(404).send('User not found');
        }

        res.render('order', {
            username:results[0].username,
            balance: results[0].balance,
            user: req.session.username
        });

    } catch (err) {
        console.error('Error fetching balance for order:', err);
        return res.status(500).send('Database error fetching balance');
    }
});

app.post('/order', async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: 'Not logged in' });

    // ✅ Count today's actions correctly
    const [countResult] = await db.query(`
      SELECT COUNT(*) AS count FROM start_actions 
      WHERE id = ? AND DATE(action_time) = CURDATE()
    `, [userId]);

    const countToday = countResult[0].count;

    if (countToday >= 50) {
      return res.status(403).json({ message: 'Daily limit reached (50/50)' });
    }

    // ✅ Get user balance
    const [userResult] = await db.query('SELECT balance FROM signUp WHERE id = ?', [userId]);
    if (!userResult.length) return res.status(404).json({ message: 'User not found' });

    const currentBalance = parseFloat(userResult[0].balance);
    let profit = currentBalance * 0.05;

    // ✅ Deterministic lucky order: every 5th action
    const isLucky = ((countToday + 1) % 5 === 0);
    if (isLucky) {
      profit *= 10;
    }

    const updatedBalance = currentBalance + profit;

    // ✅ Update balance and log action
    await db.query('UPDATE signUp SET balance = ? WHERE id = ?', [updatedBalance, userId]);
    await db.query('INSERT INTO start_actions (id) VALUES (?)', [userId]);

    res.json({
      message: isLucky
        ? `🎉 Lucky Order! (Every 5th click) You earned 10x profit.`
        : `Order successful.`,
      profit: profit.toFixed(2),
      updatedBalance: updatedBalance.toFixed(2),
      isLucky,
      remaining: 50 - (countToday + 1)
    });

  } catch (err) {
    console.error('Error in /order:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




app.get("/order-description", (req, res) => {
    res.render("orderdescription", { title: "Order description", errorMessage: "" });
});

app.get("/illustrate", (req, res) => {
    res.render("illustrate", { title: "Illustrate", errorMessage: "" });
});

app.get("/faq", (req, res) => {
    res.render("faq", { title: "FAQs", errorMessage: "" });
});

app.get("/aboutus", (req, res) => {
    res.render("aboutus", { title: "About as", errorMessage: "" });
});


app.get("/service", (req, res) => {
    res.render("service", { title: "Service", errorMessage: "" });
});



app.get("/profile", requireAuth, async (req, res) => {
  try {
    console.log('Accessing profile with session:', req.session);

    const [results] = await db.execute(
      'SELECT username,balance, email, phone_number FROM signUp WHERE id = ?',
      [req.session.userId]
    );

    if (results.length === 0) {
      console.log(`User with ID ${req.session.userId} not found.`);
      return res.status(404).send('User not found');
    }

    const userData = results[0];
    const inviteCode = generateInviteCode(); // ← Generate code here

    res.render('profile', {
      username:userData.username,
      balance: userData.balance,
      email: userData.email,
      phone_number: userData.phone_number,
      inviteCode,           // ← Pass code to EJS
      dashboardUrl: '/dashboard',
      user: req.session.username
    });

  } catch (err) {
    console.error('Error fetching profile:', err);
    return res.status(500).send('Database error fetching profile');
  }
});


app.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout session destroy error:', err);
      return next(err);
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Application error:', err.stack);
    res.status(500).send('Internal server error');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('MySQL session store configured');
    console.log('Connected to MySQL database'); // Ensure this log is still present
});