# Playto Payout Engine

A minimal payout engine for Indian merchants collecting international payments.

## Stack
- **Backend**: Django 4.2 + Django REST Framework
- **Database**: PostgreSQL 16
- **Background Jobs**: Celery 5 + Redis (real worker processes)
- **Frontend**: React 18 + Vite + Tailwind CSS

## One-command setup

```bash
docker-compose up --build
```

Then open **http://localhost:5173**

> The backend auto-runs migrations and seeds 3 demo merchants on first start.

## Architecture Highlights

### Money Integrity
- All amounts stored as `BigIntegerField` in **paise** (integer, never float)
- Balance computed via `SUM()` DB aggregation — never Python arithmetic

### Concurrency
- `SELECT FOR UPDATE` on the merchant row inside `transaction.atomic()`
- Two simultaneous requests on insufficient balance → exactly one succeeds

### Idempotency
- `Idempotency-Key` header (UUID) scoped per merchant
- Second call with same key returns identical `(status_code, body)` — no duplicate payout
- Keys expire after 24 hours

### State Machine
```
pending → processing → completed
                    → failed
```
Illegal transitions raise `InvalidStateTransition` and are rejected.

### Celery Tasks
| Task | Schedule | Purpose |
|------|----------|---------|
| `process_pending_payouts` | Every 10s | pending → processing, dispatches workers |
| `process_single_payout` | On demand | 70% success / 20% fail / 10% hang |
| `retry_stuck_payouts` | Every 30s | Exponential backoff, max 3 attempts, then fail |

## API Reference

### `GET /api/v1/merchants/`
List all merchants.

### `GET /api/v1/merchants/{id}/balance/`
Returns `available_paise`, `held_paise`, `total_credited_paise`.

### `GET /api/v1/merchants/{id}/ledger/`
Paginated ledger entries.

### `POST /api/v1/payouts/`
```
Headers:
  Idempotency-Key: <uuid>
  Content-Type: application/json

Body:
  { "merchant_id": "...", "amount_paise": 10000, "bank_account_id": "HDFC0001" }
```

### `GET /api/v1/payouts/?merchant_id={id}`
List payouts for a merchant.

## Demo Merchants (seeded)

| Merchant | Credits | Notes |
|----------|---------|-------|
| Priya Sharma | ₹45,000 | Clean balance |
| Raj Patel | ₹1,20,000 | 1 completed payout of ₹25,000 |
| Ananya Tech | ₹75,000 | 1 failed payout (funds returned) |
