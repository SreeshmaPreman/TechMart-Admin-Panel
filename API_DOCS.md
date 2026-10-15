# TechMart API Documentation

Base URL: `http://localhost:5000`

### Products
- `GET /api/products` - Retrieves all product inventory.
- `POST /api/products` - Adds a new product to inventory.
- `PUT /api/products/:id` - Updates product details.
- `DELETE /api/products/:id` - Deletes a product.

### Orders
- `GET /api/orders` - Retrieves all customer orders.
- `POST /api/orders` - Places a new order, auto-generates Order ID (`TM-XXXXXX`), validates stock, and sends email alerts if low.
- `PUT /api/orders/:id` - Updates order fulfillment status.

### Analytics & Alerts
- `GET /api/alerts` - Retrieves low-stock warnings ($k \le 5$).
- `GET /api/customers` - Aggregates customer directory metrics (total orders, total spending) using SQL `GROUP BY`.
