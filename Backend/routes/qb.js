const express = require("express");
const mysqlConnection = require("../utils/database.js");
const Router = express.Router();

Router.use(express.json());
const bodyParser = require("body-parser");
Router.use(bodyParser.json());
Router.use(bodyParser.urlencoded({ extended: true }));
const methodOverride = require("method-override");
Router.use(methodOverride("_method"));

/* ---------------- USER (signUp) CRUD ---------------- */

// View all users
Router.get("/users", (req, res) => {
  mysqlConnection.query("SELECT * FROM signUp", (err, results) => {
    if (!err) {
      res.render("users", { title: "Users", users: results });
    } else {
      console.error(err);
      res.status(500).json({ message: "Error fetching users" });
    }
  });
});

// Add user form
Router.get("/users/add", (req, res) => {
  res.render("addUser", { title: "Add User" });
});

// Add user
Router.post("/users/add", (req, res) => {
  const { username, phone_number, email, password_hash } = req.body;
  const sql = `INSERT INTO signUp (username, phone_number, email, password_hash) VALUES (?, ?, ?, ?)`;
  mysqlConnection.query(sql, [username, phone_number, email, password_hash], (err, result) => {
    if (!err) {
      res.redirect("/users");
    } else {
      console.error(err);
      res.status(500).json({ message: "Error adding user" });
    }
  });
});

// Edit user form
Router.get("/users/edit/:id", (req, res) => {
  const id = req.params.id;
  mysqlConnection.query("SELECT * FROM signUp WHERE id = ?", [id], (err, result) => {
    if (!err && result.length > 0) {
      res.render("editUser", { title: "Edit User", user: result[0] });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
});

// Update user
Router.post("/users/edit/:id", (req, res) => {
  const id = req.params.id;
  const { username, phone_number, email, balance} = req.body;
  const sql = "UPDATE signUp SET username = ?, phone_number = ?, email = ?, balance = ? WHERE id = ?";
  mysqlConnection.query(sql, [username, phone_number, email, balance, id], (err) => {
    if (!err) {
      res.redirect("/users");
    } else {
      console.error(err);
      res.status(500).json({ message: "Error updating user" });
    }
  });
});

// Delete user
Router.get("/users/delete/:id", (req, res) => {
  const id = req.params.id;
  mysqlConnection.query("DELETE FROM signUp WHERE id = ?", [id], (err) => {
    if (!err) {
      res.redirect("/users");
    } else {
      console.error(err);
      res.status(500).json({ message: "Error deleting user" });
    }
  });
});


/* ---------------- WITHDRAWALS CRUD ---------------- */

// View all withdrawals
Router.get("/withdrawals", (req, res) => {
  mysqlConnection.query("SELECT * FROM withdrawals", (err, results) => {
    if (!err) {
      res.render("withdrawals", { title: "Withdrawals", withdrawals: results });
    } else {
      console.error(err);
      res.status(500).json({ message: "Error fetching withdrawals" });
    }
  });
});

// Add withdrawal form
Router.get("/withdrawals/add", (req, res) => {
  res.render("addWithdrawal", { title: "Add Withdrawal" });
});

// Add withdrawal
Router.post("/withdrawals/add", (req, res) => {
  const { id, amount, method, account } = req.body;
  const sql = `INSERT INTO withdrawals (id, amount, method, account) VALUES (?, ?, ?, ?)`;
  mysqlConnection.query(sql, [id, amount, method, account], (err) => {
    if (!err) {
      res.redirect("/withdrawals");
    } else {
      console.error(err);
      res.status(500).json({ message: "Error adding withdrawal" });
    }
  });
});

// Edit withdrawal form
Router.get("/withdrawals/edit/:withdraw_id", (req, res) => {
  const withdraw_id = req.params.withdraw_id;
  mysqlConnection.query("SELECT * FROM withdrawals WHERE withdraw_id = ?", [withdraw_id], (err, result) => {
    if (!err && result.length > 0) {
      res.render("editWithdrawal", { title: "Edit Withdrawal", withdrawal: result[0] });
    } else {
      res.status(404).json({ message: "Withdrawal not found" });
    }
  });
});

// Update withdrawal
Router.post("/withdrawals/edit/:withdraw_id", (req, res) => {
  const withdraw_id = req.params.withdraw_id;
  const { amount, method, account } = req.body;
  const sql = `UPDATE withdrawals SET amount = ?, method = ?, account = ? WHERE withdraw_id = ?`;
  mysqlConnection.query(sql, [amount, method, account, withdraw_id], (err) => {
    if (!err) {
      res.redirect("/withdrawals");
    } else {
      console.error(err);
      res.status(500).json({ message: "Error updating withdrawal" });
    }
  });
});

// Delete withdrawal
Router.get("/withdrawals/delete/:withdraw_id", (req, res) => {
  const withdraw_id = req.params.withdraw_id;
  mysqlConnection.query("DELETE FROM withdrawals WHERE withdraw_id = ?", [withdraw_id], (err) => {
    if (!err) {
      res.redirect("/withdrawals");
    } else {
      console.error(err);
      res.status(500).json({ message: "Error deleting withdrawal" });
    }
  });
});


/* ---------------- DEPOSITS CRUD ---------------- */

// View all deposits
Router.get("/deposits", (req, res) => {
  mysqlConnection.query("SELECT * FROM deposit", (err, results) => {
    if (!err) {
      res.render("deposits", { title: "Deposits", deposits: results });
    } else {
      console.error(err);
      res.status(500).json({ message: "Error fetching deposits" });
    }
  });
});

// Add deposit form
Router.get("/deposits/add", (req, res) => {
  res.render("addDeposit", { title: "Add Deposit" });
});

// Add deposit
Router.post("/deposits/add", (req, res) => {
  const { id, amount, method, account } = req.body;
  const sql = `INSERT INTO deposit (id, amount, method, account) VALUES (?, ?, ?, ?)`;
  mysqlConnection.query(sql, [id, amount, method, account], (err) => {
    if (!err) {
      res.redirect("/deposits");
    } else {
      console.error(err);
      res.status(500).json({ message: "Error adding deposit" });
    }
  });
});

// Edit deposit form
Router.get("/deposits/edit/:deposit_id", (req, res) => {
  const deposit_id = req.params.deposit_id;
  mysqlConnection.query("SELECT * FROM deposit WHERE deposit_id = ?", [deposit_id], (err, result) => {
    if (!err && result.length > 0) {
      res.render("editDeposit", { title: "Edit Deposit", deposit: result[0] });
    } else {
      res.status(404).json({ message: "Deposit not found" });
    }
  });
});

// Update deposit
Router.post("/deposits/edit/:deposit_id", (req, res) => {
  const deposit_id = req.params.deposit_id;
  const { amount, method, account } = req.body;
  const sql = `UPDATE deposit SET amount = ?, method = ?, account = ? WHERE deposit_id = ?`;
  mysqlConnection.query(sql, [amount, method, account, deposit_id], (err) => {
    if (!err) {
      res.redirect("/deposits");
    } else {
      console.error(err);
      res.status(500).json({ message: "Error updating deposit" });
    }
  });
});

// Delete deposit
Router.get("/deposits/delete/:deposit_id", (req, res) => {
  const deposit_id = req.params.deposit_id;
  mysqlConnection.query("DELETE FROM deposit WHERE deposit_id = ?", [deposit_id], (err) => {
    if (!err) {
      res.redirect("/deposits");
    } else {
      console.error(err);
      res.status(500).json({ message: "Error deleting deposit" });
    }
  });
});

///Lucky Order
// View all settings
Router.get('/order', (req, res) => {
  mysqlConnection.query(`
    SELECT us.*, s.username
    FROM user_settings us
    JOIN signUp s ON us.user_id = s.id
  `, (err, results) => {
    if (!err) {
      res.render('order', { title: 'User Settings', settings: results });
    } else {
      console.error(err);
      res.status(500).send('Error loading settings');
    }
  });
});

// Show add form
Router.get('/order/add', (req, res) => {
  mysqlConnection.query(`SELECT id, username FROM signUp`, (err, users) => {
    if (!err) {
      res.render('addOrder', { title: 'Add Setting', users });
    } else {
      res.status(500).send('Error loading users');
    }
  });
});

// Add setting
Router.post('/order/add', (req, res) => {
  const { user_id, lucky_frequency, lucky_daily_limit } = req.body;
  const sql = `
    INSERT INTO user_settings (user_id, lucky_frequency, lucky_daily_limit)
    VALUES (?, ?, ?)
  `;
  mysqlConnection.query(sql, [user_id, lucky_frequency, lucky_daily_limit], (err) => {
    if (!err) {
      res.redirect('/order');
    } else {
      console.error(err);
      res.status(500).send('Error adding setting');
    }
  });
});

// Edit form
Router.get('/order/edit/:id', (req, res) => {
  const id = req.params.id;
  mysqlConnection.query(`SELECT * FROM user_settings WHERE id = ?`, [id], (err, settingResult) => {
    if (err || settingResult.length === 0) return res.status(404).send('Setting not found');
    mysqlConnection.query(`SELECT id, username FROM signUp`, (err2, users) => {
      if (!err2) {
        res.render('editOrder', { title: 'Edit Setting', setting: settingResult[0], users });
      } else {
        res.status(500).send('Error loading users');
      }
    });
  });
});

// Update
Router.post('/order/edit/:id', (req, res) => {
  const { user_id, lucky_frequency, lucky_daily_limit } = req.body;
  const id = req.params.id;
  const sql = `
    UPDATE user_settings
    SET user_id = ?, lucky_frequency = ?, lucky_daily_limit = ?
    WHERE id = ?
  `;
  mysqlConnection.query(sql, [user_id, lucky_frequency, lucky_daily_limit, id], (err) => {
    if (!err) {
      res.redirect('/order');
    } else {
      console.error(err);
      res.status(500).send('Error updating setting');
    }
  });
});

// Delete
Router.post('/order/delete/:id', (req, res) => {
  const id = req.params.id;
  mysqlConnection.query(`DELETE FROM user_settings WHERE id = ?`, [id], (err) => {
    if (!err) {
      res.redirect('/order');
    } else {
      console.error(err);
      res.status(500).send('Error deleting setting');
    }
  });
});


module.exports = Router;
