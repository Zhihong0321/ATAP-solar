# Backend Issue Report (Updated)

**Severity**: Critical  
**Impact**: Application is completely non-functional.

## Latest Diagnostics (Sat, 06 Dec 2025)

The backend is exhibiting **inconsistent** and critical errors:

### 1. Missing Tables (Persistent)
Endpoint: `GET /api/v1/categories`
```json
{
  "statusCode": 500,
  "code": "P2021",
  "message": "The table `public.Category` does not exist in the current database."
}
```
**Meaning**: The database migration for the new Category/Tag features has **NOT** been applied.

### 4. Regression (Sat, 06 Dec 2025 06:18 GMT)
The API has **failed again** after briefly working.

Endpoint: `GET /api/v1/news`
```json
{
  "statusCode": 500,
  "code": "P1001",
  "message": "Can't reach database server at `postgres.railway.internal:5432`"
}
```
**Meaning**: The database connection has dropped again. It seems the backend service or database is unstable and restarting/crashing periodically.

### 5. CORS Missing
The headers returned by the API do **not** include `Access-Control-Allow-Origin`.
This will cause the frontend to fail with "Network Error" even when the API returns 200, because the browser blocks the response.

## Action Required for Backend Team
1.  **Fix Database Stability**: The connection is flapping.
2.  **Enable CORS**: You must set `Access-Control-Allow-Origin: *` (or the specific frontend domain) in your backend configuration. Without this, the frontend cannot load data.
