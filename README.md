<<<<<<< HEAD
# Finance Dashboard API

A backend for a **finance dashboard system** featuring role-based access control, financial record management, and aggregated analytics. Built as a clean, maintainable REST API.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (v18+) |
| Framework | Express 5 |
| Database | SQLite via `better-sqlite3` |
| Authentication | JWT (`jsonwebtoken`) |
| Password hashing | `bcryptjs` |
| Validation | `express-validator` |
| IDs | `uuid` v4 |

**Why SQLite?** No external database setup, zero configuration, perfect for assessment and local development. The schema is fully relational with foreign keys enabled.

---

## Project Structure

```
=======
# Finance-Data-Processing-and-Access-Control-Backend
A backend for a finance dashboard system featuring role-based access control, financial record management, and aggregated analytics. Built as a clean, maintainable REST API.


Tech Stack
Layer	Technology
Runtime	Node.js (v18+)
Framework	Express 5
Database	SQLite via better-sqlite3
Authentication	JWT (jsonwebtoken)
Password hashing	bcryptjs
Validation	express-validator
IDs	uuid v4
Why SQLite? No external database setup, zero configuration, perfect for assessment and local development. The schema is fully relational with foreign keys enabled.

Project Structure
>>>>>>> aa5ec80dc3c46f1f41a8b43c786327ffc7487584
zorvyn/
├── src/
│   ├── server.js              # Entry point — env load, server start, graceful shutdown
│   ├── app.js                 # Express app — middleware, routes, error handler
│   ├── db/
│   │   ├── schema.sql         # DDL — users + financial_records tables
│   │   ├── index.js           # DB connection (WAL mode, FK enforcement)
│   │   └── seed.js            # Demo users + 20 sample records
│   ├── middleware/
│   │   ├── auth.js            # JWT Bearer token verification
│   │   ├── roles.js           # requireRole() / requireMinRole() guards
│   │   ├── validate.js        # express-validator error formatter (→ 422)
│   │   └── errorHandler.js    # Global error handler + createError() factory
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── record.routes.js
│   │   └── dashboard.routes.js
│   ├── controllers/           # Thin HTTP adapters — parse input, call service, send response
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── record.controller.js
│   │   └── dashboard.controller.js
│   └── services/              # All business logic lives here
│       ├── auth.service.js
│       ├── user.service.js
│       ├── record.service.js
│       └── dashboard.service.js
├── tests/
│   └── api.http               # REST Client test suite (VS Code extension)
├── data/                      # Auto-created — SQLite database file
├── .env.example
└── package.json
<<<<<<< HEAD
```

---

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url>
cd zorvyn
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env if needed — defaults work out of the box
```

### 3. Seed the database

```bash
npm run seed
```

Output:
```
=======
Quick Start
1. Clone and install
git clone <repo-url>
cd zorvyn
npm install
2. Configure environment
cp .env.example .env
# Edit .env if needed — defaults work out of the box
3. Seed the database
npm run seed
Output:

>>>>>>> aa5ec80dc3c46f1f41a8b43c786327ffc7487584
Seeding users …
  ✓ admin    — admin@finance.dev   (pwd: Admin@123)
  ✓ analyst  — analyst@finance.dev (pwd: Analyst@123)
  ✓ viewer   — viewer@finance.dev  (pwd: Viewer@123)

Seeding financial records …
  ✓ [income ] Salary       ₹85000
  ... (20 records total)

✅ Seed complete.
<<<<<<< HEAD
```

### 4. Start the server

```bash
npm start          # production
npm run dev        # development (auto-restart with --watch)
```

Server starts at `http://localhost:3000`.

---

## Demo Credentials

| Role | Email | Password | Capabilities |
|---|---|---|---|
| Admin | admin@finance.dev | Admin@123 | Full access — user mgmt + records + all dashboard |
| Analyst | analyst@finance.dev | Analyst@123 | Read records + all dashboard analytics |
| Viewer | viewer@finance.dev | Viewer@123 | Read records + recent activity only |

---

## Role × Permission Matrix

| Endpoint group | viewer | analyst | admin |
|---|:---:|:---:|:---:|
| `POST /api/auth/login` | ✅ | ✅ | ✅ |
| `GET /api/records` (list + detail) | ✅ | ✅ | ✅ |
| `POST/PATCH/DELETE /api/records` | ❌ | ❌ | ✅ |
| `GET /api/dashboard/recent` | ✅ | ✅ | ✅ |
| `GET /api/dashboard/summary` | ❌ | ✅ | ✅ |
| `GET /api/dashboard/categories` | ❌ | ✅ | ✅ |
| `GET /api/dashboard/trends` | ❌ | ✅ | ✅ |
| `GET/PATCH/DELETE /api/users` | ❌ | ❌ | ✅ |

---

## API Reference

All protected endpoints require:
```
Authorization: Bearer <token>
```

### Authentication

#### `POST /api/auth/register`
Create a new user account.

**Body**
```json
=======
4. Start the server
npm start          # production
npm run dev        # development (auto-restart with --watch)
Server starts at http://localhost:3000.

Demo Credentials
Role	Email	Password	Capabilities
Admin	admin@finance.dev	Admin@123	Full access — user mgmt + records + all dashboard
Analyst	analyst@finance.dev	Analyst@123	Read records + all dashboard analytics
Viewer	viewer@finance.dev	Viewer@123	Read records + recent activity only
Role × Permission Matrix
Endpoint group	viewer	analyst	admin
POST /api/auth/login	✅	✅	✅
GET /api/records (list + detail)	✅	✅	✅
POST/PATCH/DELETE /api/records	❌	❌	✅
GET /api/dashboard/recent	✅	✅	✅
GET /api/dashboard/summary	❌	✅	✅
GET /api/dashboard/categories	❌	✅	✅
GET /api/dashboard/trends	❌	✅	✅
GET/PATCH/DELETE /api/users	❌	❌	✅
API Reference
All protected endpoints require:

Authorization: Bearer <token>
Authentication
POST /api/auth/register
Create a new user account.

Body

>>>>>>> aa5ec80dc3c46f1f41a8b43c786327ffc7487584
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Jane@123",
  "role": "viewer"
}
<<<<<<< HEAD
```
Password rules: min 6 chars, at least 1 uppercase letter, at least 1 digit.  
`role` defaults to `"viewer"` if omitted.

**Response** `201 Created`
```json
=======
Password rules: min 6 chars, at least 1 uppercase letter, at least 1 digit.
role defaults to "viewer" if omitted.

Response 201 Created

>>>>>>> aa5ec80dc3c46f1f41a8b43c786327ffc7487584
{
  "status": "success",
  "data": { "id": "...", "name": "Jane Doe", "email": "jane@example.com", "role": "viewer", "status": "active" }
}
<<<<<<< HEAD
```

---

#### `POST /api/auth/login`
**Body** `{ "email", "password" }`

**Response** `200 OK`
```json
=======
POST /api/auth/login
Body { "email", "password" }

Response 200 OK

>>>>>>> aa5ec80dc3c46f1f41a8b43c786327ffc7487584
{
  "status": "success",
  "data": {
    "token": "<jwt>",
    "user": { "id", "name", "email", "role", "status" }
  }
}
<<<<<<< HEAD
```

---

#### `GET /api/auth/me`
Returns the authenticated user's profile (from JWT payload).

---

### User Management *(admin only)*

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/users` | List all users (paginated) |
| `GET` | `/api/users/:id` | Get user by ID |
| `PATCH` | `/api/users/:id` | Update name / email / role |
| `PATCH` | `/api/users/:id/status` | Set status `active` or `inactive` |
| `DELETE` | `/api/users/:id` | Hard delete (cannot delete self) |

**Query params for list:** `page`, `limit`

---

### Financial Records

| Method | Path | Role required |
|---|---|---|
| `POST` | `/api/records` | admin |
| `GET` | `/api/records` | viewer, analyst, admin |
| `GET` | `/api/records/:id` | viewer, analyst, admin |
| `PATCH` | `/api/records/:id` | admin |
| `DELETE` | `/api/records/:id` | admin (soft delete) |

**Create/Update body fields:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `amount` | number | ✅ | Must be > 0 |
| `type` | string | ✅ | `"income"` or `"expense"` |
| `category` | string | ✅ | e.g. `"Salary"`, `"Rent"` |
| `date` | string | ✅ | ISO 8601: `YYYY-MM-DD` |
| `notes` | string | ❌ | Max 500 chars |

**List query parameters:**

| Param | Description |
|---|---|
| `type` | Filter by `income` or `expense` |
| `category` | Filter by category (exact match) |
| `from` | Filter records on/after this date |
| `to` | Filter records on/before this date |
| `search` | Search in category and notes (partial match) |
| `page` | Page number (default: 1) |
| `limit` | Results per page (default: 20) |

**Pagination response structure:**
```json
=======
GET /api/auth/me
Returns the authenticated user's profile (from JWT payload).

User Management (admin only)
Method	Path	Description
GET	/api/users	List all users (paginated)
GET	/api/users/:id	Get user by ID
PATCH	/api/users/:id	Update name / email / role
PATCH	/api/users/:id/status	Set status active or inactive
DELETE	/api/users/:id	Hard delete (cannot delete self)
Query params for list: page, limit

Financial Records
Method	Path	Role required
POST	/api/records	admin
GET	/api/records	viewer, analyst, admin
GET	/api/records/:id	viewer, analyst, admin
PATCH	/api/records/:id	admin
DELETE	/api/records/:id	admin (soft delete)
Create/Update body fields:

Field	Type	Required	Notes
amount	number	✅	Must be > 0
type	string	✅	"income" or "expense"
category	string	✅	e.g. "Salary", "Rent"
date	string	✅	ISO 8601: YYYY-MM-DD
notes	string	❌	Max 500 chars
List query parameters:

Param	Description
type	Filter by income or expense
category	Filter by category (exact match)
from	Filter records on/after this date
to	Filter records on/before this date
search	Search in category and notes (partial match)
page	Page number (default: 1)
limit	Results per page (default: 20)
Pagination response structure:

>>>>>>> aa5ec80dc3c46f1f41a8b43c786327ffc7487584
{
  "status": "success",
  "total": 20,
  "page": 1,
  "limit": 10,
  "pages": 2,
  "data": [...]
}
<<<<<<< HEAD
```

**Soft delete:** `DELETE /api/records/:id` sets `deleted_at` timestamp. Deleted records are excluded from all list and get queries but remain in the database for audit purposes.

---

### Dashboard

| Method | Path | Role | Description |
|---|---|---|---|
| `GET` | `/api/dashboard/summary` | analyst, admin | Total income, expenses, net balance |
| `GET` | `/api/dashboard/categories` | analyst, admin | Per-category, per-type totals and averages |
| `GET` | `/api/dashboard/trends` | analyst, admin | Monthly or weekly income/expense trends |
| `GET` | `/api/dashboard/recent` | all roles | N most recent records |

**`/api/dashboard/trends` query params:**
- `period` — `"monthly"` (default) or `"weekly"`
- `limit` — number of periods to return (default `12`, max `52`)

**Sample summary response:**
```json
=======
Soft delete: DELETE /api/records/:id sets deleted_at timestamp. Deleted records are excluded from all list and get queries but remain in the database for audit purposes.

Dashboard
Method	Path	Role	Description
GET	/api/dashboard/summary	analyst, admin	Total income, expenses, net balance
GET	/api/dashboard/categories	analyst, admin	Per-category, per-type totals and averages
GET	/api/dashboard/trends	analyst, admin	Monthly or weekly income/expense trends
GET	/api/dashboard/recent	all roles	N most recent records
/api/dashboard/trends query params:

period — "monthly" (default) or "weekly"
limit — number of periods to return (default 12, max 52)
Sample summary response:

>>>>>>> aa5ec80dc3c46f1f41a8b43c786327ffc7487584
{
  "status": "success",
  "data": {
    "total_income": 289200.50,
    "total_expenses": 97848.00,
    "net_balance": 191352.50
  }
}
<<<<<<< HEAD
```

**Sample trends response:**
```json
=======
Sample trends response:

>>>>>>> aa5ec80dc3c46f1f41a8b43c786327ffc7487584
{
  "status": "success",
  "meta": { "period": "monthly", "count": 3 },
  "data": [
    { "period": "2026-02", "income": 96700.00, "expenses": 47798.00, "net": 48902.00 },
    { "period": "2026-03", "income": 85000.00, "expenses": 31199.00, "net": 53801.00 },
    { "period": "2026-04", "income": 97500.50, "expenses": 18851.00, "net": 78649.50 }
  ]
}
<<<<<<< HEAD
```

---

## Error Response Format

All errors follow a consistent structure:

```json
=======
Error Response Format
All errors follow a consistent structure:

>>>>>>> aa5ec80dc3c46f1f41a8b43c786327ffc7487584
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "Input validation failed.",
  "errors": [
    { "field": "amount", "message": "Amount must be a positive number." }
  ]
}
<<<<<<< HEAD
```

| HTTP Status | Code | Scenario |
|---|---|---|
| 400 | `BAD_REQUEST` | Invalid operation (e.g., self-delete) |
| 401 | `MISSING_TOKEN` / `INVALID_TOKEN` / `TOKEN_EXPIRED` | Auth failures |
| 403 | `FORBIDDEN` / `ACCOUNT_INACTIVE` | Role mismatch or deactivated user |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Duplicate email |
| 422 | `VALIDATION_ERROR` | Input validation failure |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected server error |

---

## Design Decisions & Assumptions

### Architecture
- **3-layer architecture**: Routes define HTTP contracts → Controllers parse HTTP in/out → Services hold business logic. This separation makes each layer independently testable.
- **Synchronous SQLite**: `better-sqlite3` uses synchronous APIs which are safe in Node.js single-thread context and avoids callback/promise complexity without sacrificing correctness.

### Access Control
- Two helper middlewares: `requireRole('role1', 'role2')` for exact role matching, and `requireMinRole('analyst')` for hierarchical access (analyst OR admin).
- Inactive users are blocked at the middleware level on every authenticated request.

### Data Integrity
- `amount` column has a `CHECK (amount > 0)` constraint at the database level as a second line of defense.
- Soft delete (`deleted_at`) preserves records for audit trails while excluding them from all query results.
- Foreign key `created_by` is enforced at DB level with `PRAGMA foreign_keys = ON`.

### Security
- Passwords are hashed with bcrypt (10 rounds).
- JWT tokens expire in 24h (configurable via `JWT_EXPIRES_IN`).
- JWT payload carries only `{ id, email, role, status }` — no sensitive data.
- The `password_hash` field is stripped from all user objects before sending to clients.

### Tradeoffs
- No refresh tokens (out of scope for assessment — noted for production).
- No rate limiting (would add `express-rate-limit` in production).
- Hard delete for users, soft delete for financial records (business records should never be permanently lost).

---

## Testing

Open `tests/api.http` in VS Code with the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension.

**Workflow:**
1. Start server: `npm start`
2. Seed data: `npm run seed`  
3. Run "Login as ADMIN" request — copy the `token` value
4. Paste it into `@adminToken` at the top of the file
5. Run any other requests

**Key scenarios to verify:**
- RBAC rejection — Viewer → `POST /api/records` → **403 FORBIDDEN**
- RBAC rejection — Viewer → `GET /api/dashboard/summary` → **403 FORBIDDEN**  
- Validation — negative amount → **422 VALIDATION_ERROR**
- Soft delete — `DELETE` then `GET` same record → **404 NOT_FOUND**
- Trend grouping — `GET /api/dashboard/trends?period=weekly` → week-bucketed totals
=======
HTTP Status	Code	Scenario
400	BAD_REQUEST	Invalid operation (e.g., self-delete)
401	MISSING_TOKEN / INVALID_TOKEN / TOKEN_EXPIRED	Auth failures
403	FORBIDDEN / ACCOUNT_INACTIVE	Role mismatch or deactivated user
404	NOT_FOUND	Resource not found
409	CONFLICT	Duplicate email
422	VALIDATION_ERROR	Input validation failure
500	INTERNAL_SERVER_ERROR	Unexpected server error
Design Decisions & Assumptions
Architecture
3-layer architecture: Routes define HTTP contracts → Controllers parse HTTP in/out → Services hold business logic. This separation makes each layer independently testable.
Synchronous SQLite: better-sqlite3 uses synchronous APIs which are safe in Node.js single-thread context and avoids callback/promise complexity without sacrificing correctness.
Access Control
Two helper middlewares: requireRole('role1', 'role2') for exact role matching, and requireMinRole('analyst') for hierarchical access (analyst OR admin).
Inactive users are blocked at the middleware level on every authenticated request.
Data Integrity
amount column has a CHECK (amount > 0) constraint at the database level as a second line of defense.
Soft delete (deleted_at) preserves records for audit trails while excluding them from all query results.
Foreign key created_by is enforced at DB level with PRAGMA foreign_keys = ON.
Security
Passwords are hashed with bcrypt (10 rounds).
JWT tokens expire in 24h (configurable via JWT_EXPIRES_IN).
JWT payload carries only { id, email, role, status } — no sensitive data.
The password_hash field is stripped from all user objects before sending to clients.
Tradeoffs
No refresh tokens (out of scope for assessment — noted for production).
No rate limiting (would add express-rate-limit in production).
Hard delete for users, soft delete for financial records (business records should never be permanently lost).
Testing
Open tests/api.http in VS Code with the REST Client extension.

Workflow:

Start server: npm start
Seed data: npm run seed
Run "Login as ADMIN" request — copy the token value
Paste it into @adminToken at the top of the file
Run any other requests
Key scenarios to verify:

RBAC rejection — Viewer → POST /api/records → 403 FORBIDDEN
RBAC rejection — Viewer → GET /api/dashboard/summary → 403 FORBIDDEN
Validation — negative amount → 422 VALIDATION_ERROR
Soft delete — DELETE then GET same record → 404 NOT_FOUND
Trend grouping — GET /api/dashboard/trends?period=weekly → week-bucketed totals
>>>>>>> aa5ec80dc3c46f1f41a8b43c786327ffc7487584
