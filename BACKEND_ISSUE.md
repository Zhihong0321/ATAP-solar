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

### 6. Category Update FAIL (Sat, 06 Dec 2025 08:15 GMT)
The `PUT /api/v1/news/{id}` endpoint **ignores** category updates completely.

We tested the following payloads against a live news item:
1. `category_id: "uuid"` -> **Result: Ignored (null)**
2. `categoryId: "uuid"` -> **Result: Ignored (null)**
3. `category: "uuid"` -> **Result: Ignored (null)**
4. `category: { connect: { id: "uuid" } }` -> **Result: Ignored (null)**

**Conclusion**: The backend `UPDATE` logic is broken. It is likely stripping the category field before saving to the database, or the Prisma update query is missing the relation update.

**Action Required for Backend Team**:
Fix the `PUT` handler to actually accept and save the category relation. Check your controller/service code.
