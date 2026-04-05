# 🏦 Banking Dashboard

A secure, role-based **Finance Dashboard System** built with Node.js and Express. Different users interact with financial records based on their assigned role. The system handles storage and management of financial entries, user roles, fine-grained permissions, CORS protection, rate limiting, and summary-level analytics.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Roles & Permissions](#roles--permissions)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The Banking Dashboard is a backend REST API designed to simulate a real-world financial record management platform. It supports three distinct user roles — **Admin**, **Analyst**, and **Viewer** — each with a clearly defined scope of access. Built with security in mind, the system enforces CORS policies with allowed origins, rate limiting to prevent abuse, and JWT-based authentication with configurable token expiry.

---

## Features

- 🔐 **Role-Based Access Control (RBAC)** — Admin, Analyst, and Viewer roles with distinct permissions.
- 📒 **Financial Entry Management** — Full CRUD operations on financial records (Admin only).
- 📊 **Dashboard Analytics** — Summary-level financial data accessible to all authenticated roles.
- 🔍 **Record Access for Analysts** — Analysts can read financial records and view dashboard data.
- 🛡️ **JWT Authentication** — Secure token-based auth with configurable token expiry via environment variables.
- 🌐 **CORS Protection** — Allowed origins configured via `.env` to restrict cross-origin access.
- ⏱️ **Rate Limiting** — Prevents brute-force and API abuse by limiting requests per time window.
- ✅ **Input Validation** — All incoming request data is validated using `express-validator` before processing.
- ⚠️ **Centralised Error Handling** — Consistent, structured error responses across the entire API.
- 🗄️ **Persistent Storage** — Financial entries and user data managed and stored server-side.

---

## Tech Stack

| Layer          | Technology                  |
|----------------|-----------------------------|
| Runtime        | Node.js                     |
| Framework      | Express.js                  |
| Language       | JavaScript (ES6+)           |
| Authentication | JWT (JSON Web Tokens)       |
| Security       | CORS, Express Rate Limiter  |
| Validation     | express-validator           |

---

## Project Structure

```
banking-dashboard/
└── server/
    ├── controllers/       # Request handlers for each resource
    ├── routes/            # API route definitions
    ├── models/            # Data models (users, financial entries)
    ├── services/          # Business logic — financial operations, analytics, user management
    ├── middleware/        # Auth verification, role-checking, rate limiting, error handling
    ├── validators/        # express-validator schemas for request input validation
    ├── utils/             # Helper functions and utilities
    ├── .env               # Environment variables (do not commit)
    └── server.js          # Entry point — initialises and starts the Express server
```

---

## Environment Variables

Create a `.env` file inside the `server/` directory with the following keys:

```env
# Server
PORT=5000

# JWT
JWT_SECRET=your_jwt_secret_key
TOKEN_EXPIRE=7d

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# Database
DB_URI=your_database_connection_string
```

| Variable          | Description                                      |
|-------------------|--------------------------------------------------|
| `PORT`            | Port the server runs on                          |
| `JWT_SECRET`      | Secret key used to sign JWTs                     |
| `TOKEN_EXPIRE`    | JWT expiry duration (e.g. `1d`, `7d`, `2h`)      |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins     |
| `DB_URI`          | Database connection URI                          |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- npm (comes with Node.js)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Divyanshukhatri-51/banking-dashboard.git
   cd banking-dashboard/server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Fill in the values in .env
   ```

4. **Start the server**

   ```bash
   npm start
   ```

   Server runs at `http://localhost:5000`

---

## API Endpoints

### Auth

| Method | Endpoint              | Description                    | Access  |
|--------|-----------------------|--------------------------------|---------|
| POST   | `/api/auth/register`  | Register a new user            | Public  |
| POST   | `/api/auth/login`     | Login and receive a JWT token  | Public  |

### Records

| Method | Endpoint              | Description                                  | Access          |
|--------|-----------------------|----------------------------------------------|-----------------|
| GET    | `/api/records`        | Get all financial records                    | Admin, Analyst  |
| GET    | `/api/records/:id`    | Get a single record by ID                    | Admin, Analyst  |
| POST   | `/api/records`        | Create a new record (with validation)        | Admin           |
| PUT    | `/api/records/:id`    | Update a record (with validation)            | Admin           |
| DELETE | `/api/records/:id`    | Soft delete a record                         | Admin           |

### Dashboard / Analytics

| Method | Endpoint                          | Description                              | Access                  |
|--------|-----------------------------------|------------------------------------------|-------------------------|
| GET    | `/api/dashboard/summary`          | Overall financial summary                | Admin, Analyst, Viewer  |
| GET    | `/api/dashboard/category-totals`  | Total amounts grouped by category        | Admin, Analyst, Viewer  |
| GET    | `/api/dashboard/recent-activity`  | Latest financial activity feed           | Admin, Analyst, Viewer  |
| GET    | `/api/dashboard/monthly-trends`   | Month-by-month financial trends          | Admin, Analyst          |
| GET    | `/api/dashboard/weekly-trends`    | Week-by-week financial trends            | Admin, Analyst          |
| GET    | `/api/dashboard/top-categories`   | Top spending/income categories           | Admin, Analyst          |

### Users

| Method | Endpoint                      | Description                                   | Access  |
|--------|-------------------------------|-----------------------------------------------|---------|
| GET    | `/api/users`                  | Get all users                                 | Admin   |
| GET    | `/api/users/:id`              | Get a single user by ID                       | Admin   |
| POST   | `/api/users`                  | Create a new user (with validation)           | Public  |
| PUT    | `/api/users/:id`              | Update a user (with validation)               | Admin   |
| DELETE | `/api/users/:id`              | Soft delete a user                            | Admin   |
| PATCH  | `/api/users/change-password`  | Change authenticated user's password          | Authenticated |

---

## Roles & Permissions

| Permission                  | Admin | Analyst | Viewer |
|-----------------------------|:-----:|:-------:|:------:|
| View dashboard data         |  ✅   |   ✅    |   ✅   |
| View financial records      |  ✅   |   ✅    |   ❌   |
| Create financial entries    |  ✅   |   ❌    |   ❌   |
| Update financial entries    |  ✅   |   ❌    |   ❌   |
| Delete financial entries    |  ✅   |   ❌    |   ❌   |
| Manage users                |  ✅   |   ❌    |   ❌   |

> **Admin** — Full control over all resources, users, and system settings.
>
> **Analyst** — Read-only access to financial records and dashboard analytics.
>
> **Viewer** — Can only view summary dashboard data. No access to raw records.

---

## Security

### CORS
Cross-Origin Resource Sharing is restricted to origins defined in the `ALLOWED_ORIGINS` environment variable. Any request from an unlisted origin will be rejected.

```env
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### Rate Limiting
The API uses rate limiting to protect against brute-force attacks and excessive requests. Requests exceeding the limit within a time window will receive a `429 Too Many Requests` response.

### Input Validation
All request bodies are validated using `express-validator`. If validation fails, the API returns a `400 Bad Request` with a detailed list of field-level errors:

```json
{
  "errors": [
    { "field": "email", "message": "Must be a valid email address" },
    { "field": "password", "message": "Password must be at least 6 characters" }
  ]
}
```

### Error Handling
The API uses a centralised error handler that catches all errors and returns consistent, structured responses:

| Status Code | Meaning                                      |
|-------------|----------------------------------------------|
| `400`       | Bad Request — validation failed              |
| `401`       | Unauthorised — missing or invalid JWT        |
| `403`       | Forbidden — insufficient role permissions    |
| `404`       | Not Found — resource does not exist          |
| `429`       | Too Many Requests — rate limit exceeded      |
| `500`       | Internal Server Error — unexpected failure   |

### JWT Authentication
All protected routes require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

Token expiry is controlled via the `TOKEN_EXPIRE` environment variable. Once expired, the user must log in again to receive a new token.

---

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

> Built by [Divyanshukhatri-51](https://github.com/Divyanshukhatri-51)
