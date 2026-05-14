# ☕ Fondo

A full-stack specialty coffee e-commerce platform — React 18 + TypeScript + Vite frontend, Express + Sequelize + MySQL backend.

---

## 🗂 Project Structure

```
fondo/
├── src/                    # Frontend (React + TypeScript + Vite)
│   ├── app/
│   │   ├── components/     # Navbar, CartDrawer, AuthModal, ProductCard, etc.
│   │   ├── context/        # AuthContext, CartContext
│   │   ├── pages/          # HomePage, ShopPage, ProductDetailPage, CheckoutPage, …
│   │   │   └── admin/      # AdminDashboard, AdminInventory, AdminOrders, AdminUsers
│   │   ├── services/       # api.ts — centralised HTTP client
│   │   └── routes.tsx      # React Router configuration
│   └── styles/             # theme.css, fonts.css, tailwind.css
├── server/                 # Backend (Node.js + Express + Sequelize)
│   ├── config/             # database.js — Sequelize connection config
│   ├── controllers/        # authController, productController, orderController, …
│   ├── middleware/         # auth.js (verifyToken), isAdmin.js
│   ├── migrations/         # 001–006 Sequelize CLI migrations
│   ├── models/             # User, Category, Product, Order, OrderDetail, BrewingGuide
│   ├── routes/             # auth, categories, products, orders, users, guides
│   ├── seeders/            # seed.js — idempotent initial data
│   ├── schema.sql          # Raw SQL schema (alternative to migrations)
│   ├── app.js              # Express entry point (helmet, rate-limit, graceful shutdown)
│   └── package.json
├── public/                 # favicon.svg
├── index.html
├── package.json            # Frontend deps
├── tsconfig.json
├── vite.config.ts
└── .env.example            # Copy to .env — frontend env vars
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+

### 1. Clone and install
```bash
git clone <repo>
cd fondo

# Frontend deps
npm install

# Backend deps
cd server
npm install
cd ..
```

### 2. Configure environment variables

**Frontend** (root directory):
```bash
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api  ← default, no change needed for local dev
```

**Backend** (`server/` directory):
```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=fondo
DB_USER=coffee
DB_PASSWORD=your_mysql_password_here
JWT_SECRET=generate_a_strong_random_secret
```

### 3. Set up the database

See **Database Connection Guide** below for full instructions.

Quick version:
```bash
# Create the DB and user in MySQL, then:
cd server
npm run db:setup     # runs migrations + seeds
```

### 4. Start development servers

In two separate terminals:

```bash
# Terminal 1 — Backend (port 5000)
cd server
npm run dev

# Terminal 2 — Frontend (port 5173)
npm run dev
```

Visit: http://localhost:5173

---

## 🔐 Demo Credentials

| Role     | Email                     | Password       |
|----------|---------------------------|----------------|
| Admin    | admin@artisanbean.com     | Admin@12345    |
| Admin    | maria@artisanbean.com     | Admin@12345    |
| Customer | sarah.m@email.com         | Customer@123   |

Admin portal: http://localhost:5173/admin

---

## 🛠 Available Scripts

### Frontend (root)
| Command           | Description               |
|-------------------|---------------------------|
| `npm run dev`     | Start Vite dev server     |
| `npm run build`   | Production build to dist/ |
| `npm run preview` | Preview production build  |

### Backend (`server/`)
| Command                  | Description                           |
|--------------------------|---------------------------------------|
| `npm run dev`            | Start with nodemon (auto-reload)      |
| `npm start`              | Start in production mode              |
| `npm run db:migrate`     | Run all pending migrations            |
| `npm run db:migrate:undo`| Roll back all migrations              |
| `npm run db:seed`        | Seed the database                     |
| `npm run db:setup`       | Migrate + seed (first-time setup)     |
| `npm run db:reset`       | Undo all → migrate → seed (full reset)|

---

## 🌐 API Overview

Base URL: `http://localhost:5000/api`

| Method | Path                         | Auth    | Description                        |
|--------|------------------------------|---------|------------------------------------|
| POST   | /auth/register               | Public  | Create customer account            |
| POST   | /auth/login                  | Public  | Authenticate, receive JWT          |
| GET    | /auth/me                     | JWT     | Get current user profile           |
| GET    | /products                    | Public  | List products (filter + paginate)  |
| GET    | /products/search             | Public  | Search products                    |
| GET    | /products/:id                | Public  | Single product detail              |
| POST   | /products                    | Admin   | Create product                     |
| PUT    | /products/:id                | Admin   | Update product                     |
| PATCH  | /products/:id/stock          | Admin   | Adjust stock level                 |
| DELETE | /products/:id                | Admin   | Delete product                     |
| GET    | /categories                  | Public  | All categories with product count  |
| POST   | /orders                      | JWT     | Place order (transactional)        |
| GET    | /orders/me                   | JWT     | Customer's order history           |
| GET    | /orders                      | Admin   | All orders (paginated)             |
| PATCH  | /orders/:id/status           | Admin   | Update order status                |
| GET    | /guides                      | Public  | All brewing guides                 |
| GET    | /users                       | Admin   | All users (paginated)              |

Full interactive API docs: http://localhost:5173/admin/api-docs

---

## 🏗 Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite 6 + Tailwind CSS v4
- React Router 7
- shadcn/ui (Radix UI primitives)
- Recharts (admin charts)
- Sonner (toast notifications)

**Backend**
- Node.js 18 + Express 4
- Sequelize ORM + MySQL2
- JWT authentication
- bcryptjs password hashing
- express-validator input validation
- helmet security headers
- express-rate-limit brute-force protection

---

## 🔒 Security

- Passwords: bcrypt with configurable salt rounds (default 12)
- Auth: JWT Bearer tokens (7-day expiry)
- Rate limiting: 20 auth requests / 300 API requests per 15 min window
- HTTP headers: helmet (X-Frame-Options, CSP, HSTS, etc.)
- Body size limit: 1 MB cap on JSON payloads
- SQL injection prevention: Sequelize parameterised queries
- Stock race condition prevention: `SELECT ... FOR UPDATE` transactions on order placement
