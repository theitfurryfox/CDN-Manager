# 🚀 CDN Manager

[![Node.js](https://img.shields.io/badge/Node.js-18%2B%20%7C%2020%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Platform](https://img.shields.io/badge/Platform-Debian%20%7C%20Ubuntu-blue)

A **minimalist, self-hosted CDN management platform** built for Debian and Ubuntu environments.  
It provides secure file delivery, customizable branding, and efficient upload handling — all through a clean, dark-mode web interface.

---

## 🧭 Overview

**CDN Manager** helps developers and sysadmins deploy and manage static content delivery systems quickly.  
It’s optimized for simplicity, security, and full control — no third-party dependencies or external storage required.

---

## ✨ Features

- 🌙 Dark mode interface
- 🔐 Secure MariaDB-based authentication
- 📦 File upload, management & sharing
- 📊 Storage usage statistics
- 🧩 Environment-based configuration
- 🖼️ Custom branding via `brand.json`
- 🪶 Lightweight Node.js backend

---

## ⚙️ Requirements

- **Node.js** 18+ or 20+  
- **MariaDB** 10.3+  
- **Debian / Ubuntu** (recommended)

---

## 🧩 Installation

### 1️⃣ Install Dependencies

```bash
# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MariaDB
sudo apt-get update
sudo apt-get install -y mariadb-server
sudo mysql_secure_installation
```

### 2️⃣ Setup Database

```bash
sudo mysql -u root -p

CREATE DATABASE cdn_manager;
CREATE USER 'cdn_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON cdn_manager.* TO 'cdn_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3️⃣ Configure Environment

```bash
cp .env.example .env
nano .env
```

Set the following variables:

| Variable | Description |
|-----------|-------------|
| `DB_PASSWORD` | MariaDB password |
| `FIRST_USER_EMAIL` | Admin email |
| `FIRST_USER_PASSWORD` | Admin password |
| `SESSION_SECRET` | Random security string |
| `PORT` | App port (default: 7040) |

---

## 🎨 Branding (Optional)

Edit `brand.json` to customize your instance:

```json
{
  "baseUrl": "https://cdn.example.com",
  "favicon": "/assets/favicon.ico",
  "logo": "/assets/logo.png",
  "name": "My CDN"
}
```

---

## 🗄️ Initialize Database

```bash
mysql -u cdn_user -p cdn_manager < scripts/001_initial_schema.sql
```

---

## 👤 Create First User

```bash
node scripts/create-first-user.js
```

---

## 🏗️ Build & Start

```bash
npm install
npm run build
npm start
```

Then visit:  
👉 **http://localhost:7040**

---

## 🚀 Production Deployment

### Using PM2

```bash
sudo npm install -g pm2
pm2 start npm --name "cdn-manager" -- start
pm2 save
pm2 startup
```

### Using systemd

Create file `/etc/systemd/system/cdn-manager.service`:

```ini
[Unit]
Description=CDN Manager
After=network.target mariadb.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/cdn-manager
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable cdn-manager
sudo systemctl start cdn-manager
```

---

## 📂 File Upload Directory

```bash
sudo mkdir -p /var/www/cdn/uploads
sudo chown www-data:www-data /var/www/cdn/uploads
sudo chmod 755 /var/www/cdn/uploads
```

---

## 🔒 Security Notes

- Use **strong passwords**
- Keep **MariaDB** and **Node.js** updated
- Always deploy with **HTTPS** (via nginx or Apache reverse proxy)
- Schedule **database backups**
- Apply **restrictive file permissions**

---

## 🧾 Footer Information

The footer dynamically shows:
- © 2025 TheITFurryFox  
- [Project Repository](https://github.com/theitfurryfox/CDN-Manager)  
- Git commit (via `GIT_COMMIT` environment variable)

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.  
Created with ❤️ by **[TheITFurryFox](https://theitfurryfox.com)**

---
