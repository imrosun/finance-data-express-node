# Backend API Postman Collection

This collection includes all available API endpoints for the **Zorvyn Financial Dashboard** backend.

## 🚀 Setup

1.  **Base URL**: Use the variable `{{baseUrl}}` (set to `http://localhost:5000/api` by default).
2.  **Authentication**: Most endpoints require a **Bearer Token**.
    - Copy the `token` from the Login/Register response.
    - Go to the collection's **Authorization** tab, select **Bearer Token**, and use the variable `{{token}}`.

---

## 🔑 Authentication
*Access: Public*

### 1. Register User
*   **Method**: `POST`
*   **URL**: `{{baseUrl}}/auth/register`
*   **Description**: Registers a new user. The first user created in the database is automatically assigned the `ADMIN` role.
*   **Body (JSON)**:
    ```json
    {
      "email": "admin@example.com",
      "password": "Password123!"
    }
    ```

### 2. Login User
*   **Method**: `POST`
*   **URL**: `{{baseUrl}}/auth/login`
*   **Description**: Authenticates a user and returns a JWT token.
*   **Body (JSON)**:
    ```json
    {
      "email": "admin@example.com",
      "password": "Password123!"
    }
    ```

---

## 👥 User Management
*Access: Admin Only*

### 1. List Users
*   **Method**: `GET`
*   **URL**: `{{baseUrl}}/users?page=1&limit=10&role=VIEWER&status=ACTIVE`
*   **Authorization - Bearer Token**: `{{token}}`
*   **Query Params**:
    - `page` (optional, default: 1)
    - `limit` (optional, default: 10)
    - `role` (optional: `VIEWER`, `ANALYST`, `ADMIN`)
    - `status` (optional: `ACTIVE`, `INACTIVE`)

### 2. Get User by ID
*   **Method**: `GET`
*   **URL**: `{{baseUrl}}/users/:id`

### 3. Update User Role
*   **Method**: `PATCH`
*   **URL**: `{{baseUrl}}/users/:id/role`
*   **Body (JSON)**:
    ```json
    {
      "role": "ANALYST"
    }
    ```

### 4. Update User Status
*   **Method**: `PATCH`
*   **URL**: `{{baseUrl}}/users/:id/status`
*   **Body (JSON)**:
    ```json
    {
      "status": "INACTIVE"
    }
    ```

---

## 📊 Financial Records
*Access: Authentication Required*

### 1. Create Record
*   **Method**: `POST`
*   **URL**: `{{baseUrl}}/records`
*   **Access**: Admin Only
*   **Body (JSON)**:
    ```json
    {
      "amount": 1500.50,
      "type": "INCOME",
      "category": "Consulting",
      "date": "2024-03-20T10:00:00.000Z",
      "notes": "Project payment"
    }
    ```

### 2. List Records
*   **Method**: `GET`
*   **URL**: `{{baseUrl}}/records?page=1&limit=10&type=INCOME`
*   **Access**: Admin, Analyst, Viewer
*   **Query Params**:
    - `page` (default: 1)
    - `limit` (default: 10)
    - `type` (`INCOME`, `EXPENSE`)
    - `category` (partial match string)
    - `startDate` (ISO 8601)
    - `endDate` (ISO 8601)

### 3. Get Record by ID
*   **Method**: `GET`
*   **URL**: `{{baseUrl}}/records/:id`
*   **Access**: Admin, Analyst, Viewer

### 4. Update Record
*   **Method**: `PUT`
*   **URL**: `{{baseUrl}}/records/:id`
*   **Access**: Admin Only
*   **Body (JSON)**:
    ```json
    {
      "amount": 1600.00,
      "category": "Architecture Consulting"
    }
    ```

### 5. Delete Record
*   **Method**: `DELETE`
*   **URL**: `{{baseUrl}}/records/:id`
*   **Access**: Admin Only

---

## 📈 Analytics
*Access: Admin or Analyst Only*

### 1. Get Financial Summary
*   **Method**: `GET`
*   **URL**: `{{baseUrl}}/analytics/summary`
*   **Description**: Get total income, total expenses, and current net balance.

### 2. Category Totals
*   **Method**: `GET`
*   **URL**: `{{baseUrl}}/analytics/categories`
*   **Description**: Get aggregated spending/income per category.

### 3. Recent Activity
*   **Method**: `GET`
*   **URL**: `{{baseUrl}}/analytics/recent?limit=5`
*   **Description**: Get the most recent financial transactions.

### 4. Monthly Trends
*   **Method**: `GET`
*   **URL**: `{{baseUrl}}/analytics/trends`
*   **Description**: Get month-over-month income vs expense trends.
