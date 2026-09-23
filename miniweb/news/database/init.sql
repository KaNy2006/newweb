CREATE DATABASE IF NOT EXISTS newsdb;
USE newsdb;

CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO news (title, description) VALUES
('Nodejs', 'Lập trình backend'),
('Web động', 'Trả về dữ liệu tương ứng với request'),
('React', 'Lập trình frontend')
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO users (username, password) VALUES
('admin', '123456')
ON DUPLICATE KEY UPDATE username = VALUES(username);
