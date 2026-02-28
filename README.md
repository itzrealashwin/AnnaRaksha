# AnnaRaksha - Smart Agriculture Warehouse System
**AI-Powered Post-Harvest Loss Prevention & Intelligent Warehouse Management System**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-blue?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Express](https://img.shields.io/badge/Express-4.x-orange)](https://expressjs.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Smart Agri-Warehouse** is a full-stack backend system designed to drastically reduce post-harvest losses in agriculture (especially for fruits, vegetables, and grains) through:

- Real-time environmental monitoring  
- Dynamic AI-driven risk scoring  
- Predictive expiry & spoilage alerts  
- Smart batch & inventory management  
- Role-based access control with secure authentication

In India, post-harvest losses account for **₹ 92,651 crore annually** (≈30–40% of perishables). This system aims to cut that loss by **40–60%** using proactive intelligence.

## ✨ Core Features

- **Secure Authentication** — Register, OTP verification, Google login, forgot password, JWT refresh tokens  
- **Warehouse Management** — Create, list, view, update & soft-delete warehouses (capacity & stock sync)  
- **Batch Tracking** — Add batches, dispatch quantities, update details, soft-delete (with atomic stock updates)  
- **Risk Engine** — Automatic risk scoring (0–100) & levels (Low/Medium/High/Critical) based on time-to-expiry + environment deviation  
- **Real-time Dashboard** — Overview stats, environment trends, high-risk batches, inventory summary by produce type  
- **AI Alerts** — Auto-generated alerts for high-risk / near-expiry batches + manual trigger & resolve functionality  
- **Atomic & Safe Operations** — Prevents stock inconsistencies during dispatch / deletion  
- **Role-Based Authorization** — Manager, Admin, Superadmin controls

## 🛠️ Tech Stack

- **Backend** — Node.js + Express.js  
- **Database** — MongoDB (Mongoose ODM)  
- **Authentication** — JWT + OTP (email/SMS) + Google OAuth  
- **Validation** — Joi schemas + rate limiting  
- **Error Handling** — Global error catcher + custom AppError  
- **Aggregation & Virtuals** — Efficient dashboard stats & computed fields (daysToExpiry, utilizationPercent)

## 📁 Project Structure (Assumed)
``
# Smart Agri-Warehouse  
**AI-Powered Post-Harvest Loss Prevention & Intelligent Warehouse Management System**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-blue?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Express](https://img.shields.io/badge/Express-4.x-orange)](https://expressjs.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Smart Agri-Warehouse** is a full-stack backend system designed to drastically reduce post-harvest losses in agriculture (especially for fruits, vegetables, and grains) through:

- Real-time environmental monitoring  
- Dynamic AI-driven risk scoring  
- Predictive expiry & spoilage alerts  
- Smart batch & inventory management  
- Role-based access control with secure authentication

In India, post-harvest losses account for **₹ 92,651 crore annually** (≈30–40% of perishables). This system aims to cut that loss by **40–60%** using proactive intelligence.

## ✨ Core Features

- **Secure Authentication** — Register, OTP verification, Google login, forgot password, JWT refresh tokens  
- **Warehouse Management** — Create, list, view, update & soft-delete warehouses (capacity & stock sync)  
- **Batch Tracking** — Add batches, dispatch quantities, update details, soft-delete (with atomic stock updates)  
- **Risk Engine** — Automatic risk scoring (0–100) & levels (Low/Medium/High/Critical) based on time-to-expiry + environment deviation  
- **Real-time Dashboard** — Overview stats, environment trends, high-risk batches, inventory summary by produce type  
- **AI Alerts** — Auto-generated alerts for high-risk / near-expiry batches + manual trigger & resolve functionality  
- **Atomic & Safe Operations** — Prevents stock inconsistencies during dispatch / deletion  
- **Role-Based Authorization** — Manager, Admin, Superadmin controls

## 🛠️ Tech Stack

- **Backend** — Node.js + Express.js  
- **Database** — MongoDB (Mongoose ODM)  
- **Authentication** — JWT + OTP (email/SMS) + Google OAuth  
- **Validation** — Joi schemas + rate limiting  
- **Error Handling** — Global error catcher + custom AppError  
- **Real-time Ready** — Designed for future WebSocket / MQTT integration  
- **Aggregation & Virtuals** — Efficient dashboard stats & computed fields (daysToExpiry, utilizationPercent)

## 📁 Project Structure (Assumed)

```
AnnaRaksha/
├── src/
│   ├── models/           # Batch, Warehouse, SensorReading, AIAlert, User...
│   ├── controllers/      # auth, warehouse, batch, dashboard, alert
│   ├── services/         # Business logic layers
│   ├── routes/           # auth.routes.js, warehouse.routes.js, etc.
│   ├── middlewares/      # protect, authorizeRoles, validate, rateLimiters
│   ├── utils/            # AppError, catchAsync, generateBatchId...
│   └── config/           # db, env, constants
|   |___ AI/
├── .env.example
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18  
- MongoDB (local or Atlas)  
- npm / yarn

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/itzrealashwin/AnnaRaksha.git
   cd AnnaRaksha
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create `.env` file (copy from `.env.example`)

   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/agriwarehouse
   JWT_SECRET=super_long_random_secret_2026
   JWT_REFRESH_SECRET=another_super_long_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   OTP_EXPIRY_MINUTES=5
   NODE_ENV=development
   GEMINI_API_KEY=YOUR_API_KEY
   ```

4. Start the server

   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production
   npm start
   ```

   API will be available at: `http://localhost:5000/api`

## 📡 API Routes Overview

### Authentication (`/api/auth`)

| Method | Endpoint              | Description                          | Auth?     |
|--------|-----------------------|--------------------------------------|-----------|
| POST   | `/register`           | User registration + OTP send         | Public    |
| POST   | `/verify-otp`         | Verify OTP after register/login      | Public    |
| POST   | `/resend-otp`         | Resend OTP                           | Public    |
| POST   | `/login`              | Email + password login               | Public    |
| POST   | `/google`             | Google OAuth login                   | Public    |
| POST   | `/refresh`            | Refresh access token                 | Public    |
| POST   | `/forgot-password`    | Initiate password reset OTP          | Public    |
| POST   | `/verify-reset-otp`   | Verify reset OTP                     | Public    |
| POST   | `/reset-password`     | Set new password                     | Public    |
| POST   | `/logout`             | Logout (blacklist token)             | Protected |
| GET    | `/me`                 | Get current user profile             | Protected |

### Warehouses (`/api/warehouses`)

| Method | Endpoint       | Description                               | Auth / Role               |
|--------|----------------|-------------------------------------------|---------------------------|
| POST   | `/`            | Create new warehouse                      | Authenticated             |
| GET    | `/`            | List all warehouses (filtered by role)    | Authenticated             |
| GET    | `/:id`         | Get single warehouse details              | Authenticated             |
| PATCH  | `/:id`         | Update warehouse (owner/admin)            | Authenticated + check     |
| DELETE | `/:id`         | Soft-delete warehouse                     | Admin / Superadmin        |

### Batches (`/api/batches`)

| Method | Endpoint           | Description                           | Auth / Role         |
|--------|--------------------|---------------------------------------|---------------------|
| POST   | `/`                | Create new batch                      | Authenticated       |
| GET    | `/`                | List batches (filter by warehouse, risk, etc.) | Authenticated |
| GET    | `/:id`             | Get single batch                      | Authenticated       |
| POST   | `/:id`             | Update batch details                  | Authenticated       |
| DELETE | `/:id`             | Soft-delete batch                     | Admin / Superadmin  |
| POST   | `/:id/dispatch`    | Dispatch (reduce) quantity            | Authenticated       |

### Dashboard (`/api/dashboard`)

| Method | Endpoint                                | Description                              | Auth?     |
|--------|-----------------------------------------|------------------------------------------|-----------|
| GET    | `/:warehouseId/overview`                | Main stats card (stock, risk, batches)   | Protected |
| GET    | `/:warehouseId/environment`             | Sensor readings trend                    | Protected |
| GET    | `/:warehouseId/risk-batches`            | High-risk batches list                   | Protected |
| GET    | `/:warehouseId/alerts`                  | Recent active alerts                     | Protected |
| GET    | `/:warehouseId/inventory-summary`       | Produce-type wise summary                | Protected |

### Alerts (`/api/alerts`)

| Method | Endpoint                   | Description                               | Auth / Role                  |
|--------|----------------------------|-------------------------------------------|------------------------------|
| GET    | `/`                        | List alerts (filtered by warehouse)       | Authenticated                |
| GET    | `/:id`                     | Get single alert                          | Authenticated                |
| PUT    | `/:id/resolve`             | Mark alert as resolved                    | Manager / Admin / Superadmin |
| POST   | `/manual/:batchId`         | Manually trigger AI re-analysis           | Manager / Admin / Superadmin |
| DELETE | `/:id`                     | Soft-dismiss alert                        | Admin / Superadmin           |

## 🌟 Why This Project Stands Out

- Proactive spoilage prevention using dynamic risk scoring  
- Atomic stock updates → no overselling / negative inventory  
- OTP + Google auth → secure & modern user onboarding  
- Ready for IoT expansion (MQTT, ESP32, real sensors)  
- Addresses real Indian agriculture problem (FPO / cold storage scale)

## 🔮 Future Scope

- Real IoT sensor integration (DHT22, MQ135, load cells)  
- ML-based spoilage prediction (time-series forecasting)  
- WhatsApp / SMS critical alerts  
- React / Vue dashboard frontend  
- Energy consumption & carbon footprint tracking  
- Mobile app for farmers / managers

## 🤝 Contributing

1. Fork the repo  
2. Create feature branch (`git checkout -b feature/xyz`)  
3. Commit changes (`git commit -m 'Add xyz'`)  
4. Push (`git push origin feature/xyz`)  
5. Open Pull Request

## 📄 License

MIT License — feel free to use, modify, distribute.

**Built with ❤️ in Pune, Maharashtra**  
For Indian farmers, FPOs, and smarter agriculture.

Made by **Team CRUX**  ~~~~
Star ⭐ if it helps your project too!
 badges, deployment section) to bol dena!  
All the best for your presentation / hackathon! 🌾🚀
