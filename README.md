# 🛒 TechMart — Enterprise Admin Panel

A full-stack enterprise-grade administrative dashboard for managing products, real-time inventory tracking, order processing, and automated low-stock email alerts.

## 🌟 Key Features
- ⚙️ **Automated Order Processing**: Auto-generates unique order tracking IDs (`TM-XXXXXX`).
- 🛡️ **Server-Side Stock Validation**: Prevents invalid transactions or out-of-stock purchases.
- 📧 **Automated Low-Stock Email Alerts**: Instant notifications dispatched via Nodemailer when inventory falls below threshold levels.
- 📊 **Dynamic Customer Analytics**: SQL aggregated reporting using `GROUP BY`.

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3, Bootstrap 5, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL (`mysql2`)
- **Email Service**: Nodemailer

## 🚀 Quick Setup Guide
1. Clone the repository.
2. Import `database.sql` into MySQL Workbench to create `techmart_db`.
3. Run `npm install` to install dependencies.
4. Update your database credentials in `server.js`.
5. Run `node server.js` to start your server!
