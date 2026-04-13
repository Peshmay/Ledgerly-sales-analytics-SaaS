# Ledgerly - Sales Analytics SaaS

Ledgerly is a full-stack analytics SaaS for bar, restaurants, and venues to track sales, manage inventory, and analyze profitability in real time.

Ledgerly demonstrates production-grade backend architecture, financial logic, and full-stack system design.

## Screenshot

### Login Page

![Login Page](screenshots/Userlogin.png)

### Users

![Users](screenshots/UserDashboard.png)

### Play Game

![Play Page](screenshots/PlayGamepage.png)

### Timer Page

![Timer Page](screenshots/Timepage.png)

### Statistics

![Statistics](screenshots/StatisticPage.png)

### Admin Login

![Admin Login](screenshots/AdminLogin.png)

### Admin Dashboard

![Admin Dashboard](screenshots/AdminDashboard.png)

### Admin Users

![Admin Users](screenshots/AllUsers.png)

## Project Overview

Ledgerly is a sales analytics and inventory tracking system designed for real-world usage in hospitality environments.

It allows staff to:

- Sell cocktails in real time
- Automatically deduct ingredient stock
- Track profit per sale
- Monitor low-stock ingredients
- Analyze top-performing products

## Key Features

- Sales & Revenue
- Create sales with multiple items
- Automatic profit calculation
- Real-time inventory deduction
- Transaction-safe operations using Prisma

## Dashboard Analytics

- Total revenue, profit, and sales count
- Top-selling cocktails
- Recent sales activity
- Low-stock ingredient alerts

## Inventory Management

- Create and manage ingredients
- Track stock levels and minimum thresholds
- Automatic stock updates after each sale
- Stock adjustment logs

## Cocktail & Recipe System

- Create cocktails with pricing
- Attach ingredients via recipe builder
  Calculate:
  Recipe cost
  Profit per item
  Margin %

## Menu

- One-click sale recording
- Live UI for staff usage
- Real-time backend updates

## Architecture

The application follows a full-stack client–server architecture.

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- Zod

### Database

- PostgreSQL

### Project Purpose

- Transactional logic (inventory + sales consistency)
- Financial calculations (profit, cost, margin)
- Relational data modeling (Cocktails ↔ Recipes ↔ Ingredients)
- Error handling and validation
- Production-ready SaaS

### Core Logic Highlight

- Sale Processing,When a sale is created:

1. Validate cocktail and recipe
2. Check ingredient stock
3. Deduct ingredient quantities
4. Log stock adjustments
5. Calculate:
   - totalAmount
   - totalCost
   - profit
6. Save sale with items

### Future Improvements

📊 Advanced charts (Recharts dashboard)
👤 Admin dashboard & role management
📦 Supplier & purchase tracking
📅 Time-based analytics (daily/weekly/monthly)
🔐 Authentication & permissions
📉 Profit trends & forecasting
