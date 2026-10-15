const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to your MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'techmart_db'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database successfully!');
});

// Configure Nodemailer for automated email alerts
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',     // Replace with your actual email address
        pass: 'your-app-password'         // Replace with your Gmail App Password
    }
});

// 1. GET all products (GET)
app.get('/api/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// 2. ADD a new product (POST)
app.post('/api/products', (req, res) => {
    const { product_id, name, category, price, stock } = req.body;
    const query = 'INSERT INTO products (product_id, name, category, price, stock) VALUES (?, ?, ?, ?, ?)';
    
    db.query(query, [product_id, name, category, price, stock], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Product added successfully!' });
    });
});

// 3. UPDATE an existing product (PUT)
app.put('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    const { name, category, price, stock } = req.body;
    const query = 'UPDATE products SET name = ?, category = ?, price = ?, stock = ? WHERE product_id = ?';
    
    db.query(query, [name, category, price, stock, productId], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Product updated successfully!' });
    });
});

// 4. DELETE a product (DELETE)
app.delete('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    const query = 'DELETE FROM products WHERE product_id = ?';
    
    db.query(query, [productId], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Product deleted successfully!' });
    });
});

// 5. GET all orders (GET)
app.get('/api/orders', (req, res) => {
    const query = 'SELECT * FROM orders';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// 6. PLACE a new order with Auto-Generated Order ID, Stock Validation, Alerts & Email Notification (POST)
app.post('/api/orders', (req, res) => {
    const { customer_name, order_date, amount, status, product_id, quantity } = req.body;
    
    // Auto-generate a unique Order ID automatically
    const order_id = "TM-" + Date.now().toString().slice(-6);

    if (product_id && quantity) {
        const checkStockQuery = 'SELECT * FROM products WHERE product_id = ?';
        db.query(checkStockQuery, [product_id], (err, productRows) => {
            if (err) return res.status(500).json({ error: err.message });
            if (productRows.length === 0) return res.status(404).json({ error: 'Product not found!' });

            const product = productRows[0];

            // Strict out-of-stock validation check
            if (product.stock <= 0) {
                return res.status(400).json({ error: `Order failed: ${product.name} is completely OUT OF STOCK!` });
            }
            if (quantity > product.stock) {
                return res.status(400).json({ error: `Order failed: Only ${product.stock} units of ${product.name} available!` });
            }

            const orderQuery = 'INSERT INTO orders (order_id, customer_name, order_date, amount, status) VALUES (?, ?, ?, ?, ?)';
            db.query(orderQuery, [order_id, customer_name, order_date, amount, status], (orderErr) => {
                if (orderErr) return res.status(500).json({ error: orderErr.message });

                const stockQuery = 'UPDATE products SET stock = stock - ? WHERE product_id = ?';
                db.query(stockQuery, [quantity, product_id], (stockErr) => {
                    if (stockErr) return res.status(500).json({ error: stockErr.message });

                    const updatedStock = product.stock - quantity;
                    
                    // Trigger low stock warning and email alert if stock drops to 5 or below
                    if (updatedStock <= 5) {
                        const alertMessage = `Low Stock Warning: ${product.name} (${product.product_id}) has only ${updatedStock} units left!`;
                        
                        const alertQuery = 'INSERT INTO stock_alerts (product_id, message) VALUES (?, ?)';
                        db.query(alertQuery, [product.product_id, alertMessage], (alertErr) => {
                            if (alertErr) console.error("Failed to insert stock alert:", alertErr);
                        });

                        // Send Automated Email Notification to Admin
                        const mailOptions = {
                            from: 'TechMart System <your-email@gmail.com>',
                            to: 'admin-target-email@gmail.com', // Where you want to receive notifications
                            subject: `⚠️ Low Stock Alert: ${product.name}`,
                            text: `Hello Admin,\n\n${alertMessage}\nPlease restock this item soon.\n\n- TechMart Admin Panel`
                        };

                        transporter.sendMail(mailOptions, (mailErr, info) => {
                            if (mailErr) {
                                console.error("Failed to send email alert:", mailErr);
                            } else {
                                console.log("Email alert sent successfully:", info.response);
                            }
                        });
                    }

                    res.json({ message: `Order ${order_id} placed successfully and inventory updated!` });
                });
            });
        });
    } else {
        const orderQuery = 'INSERT INTO orders (order_id, customer_name, order_date, amount, status) VALUES (?, ?, ?, ?, ?)';
        db.query(orderQuery, [order_id, customer_name, order_date, amount, status], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: `Order ${order_id} placed successfully!` });
        });
    }
});

// 7. GET all low-stock alerts (GET)
app.get('/api/alerts', (req, res) => {
    const query = 'SELECT * FROM stock_alerts ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// 8. GET customer directory summary from orders (GET)
app.get('/api/customers', (req, res) => {
    const query = `
        SELECT customer_name, 
               COUNT(order_id) as total_orders, 
               SUM(amount) as total_spending, 
               MAX(order_date) as last_order 
        FROM orders 
        GROUP BY customer_name
    `;
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// 9. UPDATE order status (PUT)
app.put('/api/orders/:id', (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;
    const query = 'UPDATE orders SET status = ? WHERE order_id = ?';
    
    db.query(query, [status, orderId], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Order status updated successfully!' });
    });
});

// Start the server
app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});