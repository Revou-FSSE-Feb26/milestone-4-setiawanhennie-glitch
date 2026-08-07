# FinTrack API — Smoke Test Examples

**Base URL (live):** `https://milestone-4-setiawanhennie-glitch-production.up.railway.app`
**Local:** `http://localhost:3000`

## Postman setup

1. Import `docs/fintrack.postman_collection.json`.
2. Environment variables: `base_url` (URL above) and `token`.
3. The collection sends `Authorization: Bearer {{token}}` automatically.
4. The **login** request contains this test script, which saves the token for you:
   ```js
   const json = pm.response.json();
   if (json.access_token) pm.environment.set('token', json.access_token);
   ```

**Demo logins:** `alice@example.com` / `password123` (user) · `carol@example.com` / `password123` (admin)

---

## 🔓 AUTH

### POST /auth/register
**Request:**
```bash
curl -X POST {{base_url}}/auth/register \
  -H "Content-Type: application/json" \
  -d '{ "name": "John Doe", "email": "john@example.com", "password": "password123" }'
```
**Response (201):** *(password hash is never returned)*
```json
{
  "id": 7,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "created_at": "2026-08-07T10:00:00.000Z"
}
```

### POST /auth/login  *(rate-limited: 5 req/min)*
**Request:**
```bash
curl -X POST {{base_url}}/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "alice@example.com", "password": "password123" }'
```
**Response (200):**
```json
{ "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEs..." }
```

### ❌ Blocked: duplicate email
**Request:** `POST /auth/register` with an existing email
**Response (409):**
```json
{ "statusCode": 409, "message": "Email already registered", "error": "Conflict" }
```

### ❌ Blocked: wrong password
**Request:** `POST /auth/login` with `"password": "wrong"`
**Response (401):**
```json
{ "statusCode": 401, "message": "Invalid credentials", "error": "Unauthorized" }
```

---

## 👥 USERS (🔒 JWT)

### GET /users — as **admin** (carol)
**Request:**
```bash
curl {{base_url}}/users -H "Authorization: Bearer {{token}}"
```
**Response (200):** *(hashes excluded)*
```json
[
  { "id": 1, "name": "Alice Johnson", "email": "alice@example.com", "role": "user", "created_at": "2026-07-01T00:00:00.000Z" },
  { "id": 2, "name": "Bob Smith", "email": "bob@example.com", "role": "user", "created_at": "2026-07-01T00:00:00.000Z" },
  { "id": 3, "name": "Carol Williams", "email": "carol@example.com", "role": "admin", "created_at": "2026-07-01T00:00:00.000Z" }
]
```

### ❌ Blocked: GET /users as regular **user** (alice)
**Response (403):**
```json
{ "statusCode": 403, "message": "Admin access required", "error": "Forbidden" }
```

### GET /users/1 — as alice (own profile)
**Response (200):**
```json
{ "id": 1, "name": "Alice Johnson", "email": "alice@example.com", "role": "user", "created_at": "2026-07-01T00:00:00.000Z" }
```

---

## 💳 ACCOUNTS (🔒 JWT, ownership enforced)

### POST /accounts — as alice
**Request:**
```bash
curl -X POST {{base_url}}/accounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}" \
  -d '{ "name": "Holiday Fund", "type": "bank", "balance": 500 }'
```
**Response (201):**
```json
{ "id": 7, "user_id": 1, "name": "Holiday Fund", "type": "bank", "balance": 500, "created_at": "2026-08-07T10:05:00.000Z" }
```

### GET /accounts — as alice (only her accounts)
**Response (200):**
```json
[
  { "id": 1, "user_id": 1, "name": "Alice Checking", "type": "bank", "balance": 2500, "created_at": "2026-07-01T00:00:00.000Z" },
  { "id": 2, "user_id": 1, "name": "Alice Savings", "type": "bank", "balance": 10000, "created_at": "2026-07-01T00:00:00.000Z" },
  { "id": 3, "user_id": 1, "name": "Alice Cash", "type": "cash", "balance": 150, "created_at": "2026-07-01T00:00:00.000Z" }
]
```

### GET /accounts/1 — as alice
**Response (200):** *(single account object as above)*

### ❌ Blocked: no token
**Request:** `GET /accounts` without `Authorization` header
**Response (401):**
```json
{ "statusCode": 401, "message": "Missing bearer token", "error": "Unauthorized" }
```

### ❌ Blocked: GET /accounts/4 (Bob's account) as alice
**Response (403):**
```json
{ "statusCode": 403, "message": "You do not own this account", "error": "Forbidden" }
```

### ❌ Blocked: validation error
**Request:** `POST /accounts` with `{ "name": "", "type": "crypto" }`
**Response (400):**
```json
{
  "statusCode": 400,
  "message": ["name should not be empty", "type must be one of the following values: cash, bank, e_wallet"],
  "error": "Bad Request"
}
```

### PATCH /accounts/7 — as alice
**Request:**
```bash
curl -X PATCH {{base_url}}/accounts/7 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}" \
  -d '{ "name": "Holiday Fund 2026" }'
```
**Response (200):**
```json
{ "id": 7, "user_id": 1, "name": "Holiday Fund 2026", "type": "bank", "balance": 500, "created_at": "2026-08-07T10:05:00.000Z" }
```

### DELETE /accounts/7 — as alice
**Response (200):**
```json
{ "message": "Account 7 deleted successfully" }
```

### ❌ Blocked: GET /accounts/999
**Response (404):**
```json
{ "statusCode": 404, "message": "Account with ID 999 not found", "error": "Not Found" }
```

---

## 🏷 CATEGORIES (reads public, writes admin)

### GET /categories (no token needed)
**Response (200):**
```json
[
  { "id": 1, "name": "Salary", "type": "income" },
  { "id": 4, "name": "Groceries", "type": "expense" }
]
```

### GET /categories?type=expense
**Response (200):** *(only expense categories)*

### POST /categories — as **admin**
**Request:**
```bash
curl -X POST {{base_url}}/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token_admin}}" \
  -d '{ "name": "Shopping", "type": "expense" }'
```
**Response (201):**
```json
{ "id": 10, "name": "Shopping", "type": "expense" }
```

### ❌ Blocked: POST /categories as regular user
**Response (403):**
```json
{ "statusCode": 403, "message": "Admin access required", "error": "Forbidden" }
```

### PATCH /categories/10 — as admin
**Response (200):** `{ "id": 10, "name": "Online Shopping", "type": "expense" }`

### DELETE /categories/10 — as admin
**Response (200):** `{ "message": "Category 10 deleted successfully" }`

---

## 💸 TRANSACTIONS (🔒 JWT, ownership via account, balance auto-recalc)

### POST /transactions — as alice (expense on account 1)
**Request:**
```bash
curl -X POST {{base_url}}/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}" \
  -d '{
        "accountId": 1,
        "categoryId": 4,
        "type": "expense",
        "amount": 100,
        "description": "Groceries",
        "transaction_date": "2026-08-07"
      }'
```
**Response (201):**
```json
{
  "id": 21,
  "account_id": 1,
  "category_id": 4,
  "type": "expense",
  "amount": 100,
  "description": "Groceries",
  "transaction_date": "2026-08-07T00:00:00.000Z",
  "created_at": "2026-08-07T10:10:00.000Z"
}
```
> 💡 **Balance check:** `GET /accounts/1` now shows `balance: 2400` (2500 − 100).

### GET /transactions — as alice (only hers)
**Response (200):** *(array of her transactions)*

### GET /transactions?include=category — relational query
**Response (200):**
```json
[
  {
    "id": 21,
    "account_id": 1,
    "category_id": 4,
    "type": "expense",
    "amount": 100,
    "description": "Groceries",
    "transaction_date": "2026-08-07T00:00:00.000Z",
    "created_at": "2026-08-07T10:10:00.000Z",
    "category": { "id": 4, "name": "Groceries", "type": "expense" }
  }
]
```

### GET /transactions/21?include=category — as alice
**Response (200):** *(single object with nested `category` as above)*

### ❌ Blocked: GET /transactions/8 (Bob's) as alice
**Response (403):**
```json
{ "statusCode": 403, "message": "You do not own this transaction", "error": "Forbidden" }
```

### PATCH /transactions/21 — as alice (balance recalculated)
**Request:**
```bash
curl -X PATCH {{base_url}}/transactions/21 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}" \
  -d '{ "amount": 150 }'
```
**Response (200):** *(amount: 150)*
> 💡 Account 1 balance goes 2400 → 2350 (old 100 reversed, new 150 applied).

### DELETE /transactions/21 — as alice (balance reversed)
**Response (200):**
```json
{ "message": "Transaction 21 deleted successfully" }
```
> 💡 Account 1 balance returns to 2500.

---

## 🧱 Security headers & rate limiting

- All responses include **helmet** security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options`, etc.).
- 6th `POST /auth/login` within a minute from the same IP:
  **Response (429):**
  ```json
  { "statusCode": 429, "message": "ThrottlerException: Too Many Requests", "error": "Too Many Requests" }
  ```