create database user;
use user;

CREATE TABLE signUp (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE signUp
ADD COLUMN balance DECIMAL(10,2) DEFAULT 0;


INSERT INTO signUp (username, phone_number, email, password_hash)
VALUES (
    'john_doe',
    '0812345678',
    'john@example.com',
    '$2b$10$R8Ez0ZiK1T0mI9qE3NwHjOv6GzLgMdQfb2bJhr0vB1Y8Zfg8Dm6fW' -- bcrypt hashed password
);




CREATE TABLE withdrawals (
  withdraw_id INT AUTO_INCREMENT PRIMARY KEY,
  id INT,
  amount DECIMAL(10,2),
  method VARCHAR(100),
  account VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id) REFERENCES signUp(id)
);

CREATE TABLE deposit (
  withdraw_id INT AUTO_INCREMENT PRIMARY KEY,
  id INT,
  amount DECIMAL(10,2),
  method VARCHAR(100),
  account VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id) REFERENCES signUp(id)
);

ALTER TABLE deposit
RENAME COLUMN withdraw_id TO deposit_id;

CREATE TABLE start_actions (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    id INT NOT NULL,
    action_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id) REFERENCES signUp(id) ON DELETE CASCADE
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- store hashed passwords for security
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  key_name VARCHAR(100) UNIQUE,
  value VARCHAR(100)
);


  
ALTER TABLE start_actions
  ADD COLUMN isLucky TINYINT(1) NOT NULL DEFAULT 0;
  
UPDATE settings SET value = '5' WHERE key_name = 'lucky_chance_percent';
UPDATE settings SET value = '10' WHERE key_name = 'lucky_daily_limit';

INSERT INTO settings (key_name, value)
VALUES ('lucky_frequency', '5')  -- every 5th order is lucky
ON DUPLICATE KEY UPDATE value = '5';

DROP TABLE IF EXISTS settings;

CREATE TABLE user_settings (
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











