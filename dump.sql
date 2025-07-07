-- 1. Create DB and switch to it
CREATE DATABASE IF NOT EXISTS user;
USE user;

-- 2. Main user table
CREATE TABLE IF NOT EXISTS signUp (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    balance DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Sample user data (password is bcrypt-hashed)
INSERT INTO signUp (username, phone_number, email, password_hash)
VALUES (
    'john_doe',
    '0812345678',
    'john@example.com',
    '$2b$10$R8Ez0ZiK1T0mI9qE3NwHjOv6GzLgMdQfb2bJhr0vB1Y8Zfg8Dm6fW'
);

-- 4. Table for withdrawal transactions
CREATE TABLE IF NOT EXISTS withdrawals (
    withdraw_id INT AUTO_INCREMENT PRIMARY KEY,
    id INT,
    amount DECIMAL(10,2),
    method VARCHAR(100),
    account VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id) REFERENCES signUp(id)
);

-- 5. Table for deposit transactions
CREATE TABLE IF NOT EXISTS deposit (
    deposit_id INT AUTO_INCREMENT PRIMARY KEY,
    id INT,
    amount DECIMAL(10,2),
    method VARCHAR(100),
    account VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id) REFERENCES signUp(id)
);

-- 6. Actions from user
CREATE TABLE IF NOT EXISTS start_actions (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    id INT NOT NULL,
    action_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    isLucky TINYINT(1) NOT NULL DEFAULT 0,
    FOREIGN KEY (id) REFERENCES signUp(id) ON DELETE CASCADE
);

-- 7. Users login table (used by some backend code)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Optional app-wide settings table
CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    key_name VARCHAR(100) UNIQUE,
    value VARCHAR(100)
);

-- Insert or update default lucky values
INSERT INTO settings (key_name, value)
VALUES
  ('lucky_chance_percent', '5'),
  ('lucky_daily_limit', '10'),
  ('lucky_frequency', '5')
ON DUPLICATE KEY UPDATE value = VALUES(value);

-- 9. Per-user lucky settings
CREATE TABLE IF NOT EXISTS user_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lucky_frequency INT NOT NULL DEFAULT 5,
    lucky_daily_limit INT NOT NULL DEFAULT 10,
    UNIQUE KEY uniq_user (user_id),
    INDEX idx_user (user_id),
    FOREIGN KEY (user_id) REFERENCES signUp(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;
