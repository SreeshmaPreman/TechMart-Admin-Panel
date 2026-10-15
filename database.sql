DROP DATABASE IF EXISTS techmart_db;
CREATE DATABASE techmart_db;
USE techmart_db;

CREATE TABLE products (
    product_id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL
);

CREATE TABLE orders (
    order_id VARCHAR(10) PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    order_date VARCHAR(20) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL
);

CREATE TABLE stock_alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(50),
    message VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (product_id, name, category, price, stock) VALUES 
('TM001', 'HP Laptop', 'Laptops', 55000.00, 15),
('TM002', 'Samsung Monitor', 'Monitors', 12000.00, 8),
('TM003', 'Wireless Mouse', 'Accessories', 800.00, 3),
('TM004', 'Keyboard', 'Accessories', 1500.00, 0),
('TM007', 'Samsung Galaxy Phone', 'Mobiles', 24999.00, 10),
('TM008', 'Mechanical Gaming Keyboard', 'Accessories', 3499.00, 4),
('TM009', 'Portable SSD 1TB', 'Accessories', 7999.00, 0),
('TM010', '4K Ultra HD Monitor', 'Monitors', 28000.00, 7);

INSERT INTO orders (order_id, customer_name, order_date, amount, status) VALUES 
('TM1001', 'Anu Thomas', '12 Oct 2026', 45000.00, 'Delivered'),
('TM1002', 'Rahul Nair', '11 Oct 2026', 2500.00, 'Processing'),
('TM1003', 'Meera S', '11 Oct 2026', 8999.00, 'Pending');