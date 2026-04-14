# Z Backend - Financial Dashboard API

A robust, production-ready backend for a financial dashboard, built with Node.js, Express, and Prisma 7.

## 🚀 Features

- **Role-Based Access Control (RBAC)**: Admin, Analyst, and Viewer roles.
- **Authentication**: Secure JWT-based authentication.
- **Financial Records**: Full CRUD operations for income and expenses.
- **Analytics**: Aggregated summaries, category totals, and monthly trends.
- **Validation**: Strict request validation using Zod.
- **Security**: Request rate-limiting, Helmet security headers, and safe password hashing with Bcrypt.
- **Database**: PostgreSQL with Prisma 7 (using the new Database Adapter architecture).

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js 5
- **ORM**: Prisma 7
- **Database**: PostgreSQL
- **Security**: JWT, BcryptJS, Helmet, Express-Rate-Limit
- **Validation**: Zod

---

## 🏁 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **PostgreSQL**: Local instance or hosted (e.g., Supabase, Neon)

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/imrosun/finance-data-express-node.git
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory and configure your variables. You can use the template below:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/backend_db?schema=public"
PORT=5000
JWT_SECRET="generate-a-long-random-string-here"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
```

### 3. Database Initialization

Since this project uses Prisma 7 with a local client generation strategy:

```bash
# 1. Push the schema to your database and create the initial migration
npm run db:migrate

# 2. Generate the Prisma Client locally
npm run db:generate
```

### 4. Running the Application

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm run build
npm start
```

---

## 📖 API Documentation

The full API documentation, including request/response examples and Postman collection details, can be found in:
👉 [**postman_api_collection.md**](./postman_api_collection.md)

### Key Endpoints:
- `POST /api/auth/register`: Register a new account.
- `POST /api/auth/login`: Authenticate and get a token.
- `GET /api/records`: List financial transactions (Auth required).
- `GET /api/analytics/summary`: Get financial summary (Admin/Analyst Only).

> [!TIP]
> **First User Tip**: The first user to register on a fresh database is automatically promoted to the **ADMIN** role. Subsequent users will be assigned the **VIEWER** role by default.

---

## 🏛️ Project Structure

- `src/config`: Environment and Database (Prisma) configurations.
- `src/middleware`: Auth, Authorization, Error Handling, and Validation middlewares.
- `src/modules`: Feature-based modular structure (Auth, Records, Analytics, Users).
- `src/utils`: Reusable utilities (Response helpers, Async handlers, Type-safe query parsers).
- `prisma`: Database schema and migration logs.


## Decision Making
- This stack prioritises stability and security over the absolute "lightest" possible build. It's a setup that's ready for a production environment where data integrity is the highest priority. If you need to scale this to 100 features tomorrow, the foundation is solid enough to handle it!
1. The Framework: Express 5 + TypeScript
Decision: I chose Express 5 (the latest version) paired with TypeScript.
2. The Database: PostgreSQL + Prisma 7
Decision: PostgreSQL as the data store and Prisma 7 as the ORM.
3. Authentication: Stateless JWT + RBAC
Decision: JSON Web Tokens (JWT) for session management and Role-Based Access Control (RBAC) for permissions.
4. Project Structure: Modular (Feature-based)
Decision: Organising the code by features (auth, records, analytics, users) instead of by type (all controllers in one folder, all routes in another).
5. Validation Strategy: Zod-First
Decision: Every request segment (body, query, params) is validated by Zod BEFORE it hits a controller.
