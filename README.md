<<<<<<< HEAD
# NexFi

Cash-flow early warning platform for small Sri Lankan businesses.

NexFi watches the money a small business owes and expects to receive, projects the bank
balance day by day, and warns the owner **before** the balance goes negative. Every number
is plain addition and subtraction of the records the owner enters — no AI, no black box.

## Project layout

```
backend/    Spring Boot 4 REST API (Java 17+), in-memory storage
frontend/   React 19 + Vite + Tailwind CSS 4 dashboard
```

## Running the app

Two terminals are needed.

### 1. Backend (port 8080)

```bash
cd backend
./mvnw.cmd spring-boot:run      # Windows
./mvnw spring-boot:run          # macOS / Linux
```

On startup the backend loads a demo book for a small Colombo trading business so every
screen has realistic numbers straight away. Data is held in memory, so it resets when the
backend restarts.

Run the tests with `./mvnw.cmd test`.

### 2. Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173>. Vite proxies `/api` to `http://localhost:8080`, so the
frontend talks to the backend automatically.

## What each screen does

| Screen | Purpose |
| --- | --- |
| Dashboard | Current cash, money customers owe, upcoming supplier payments, recurring expenses, projected balance, cash-flow status |
| Transactions | Add, edit and delete income and expenses with description, amount, date and category |
| Receivables | Customer invoices with due dates, payment status and overdue highlighting |
| Payables | Supplier bills with due dates, payment status and overdue highlighting |
| Recurring expenses | Monthly bills such as rent, salaries, electricity and internet |
| Forecast | 30/60/90-day projection with shortage warning and rule-based advice |

## How the forecast is calculated

Plain arithmetic, no model:

```
projected balance = current cash
                  + customer payments expected (unpaid receivables, on or after their due date)
                  - supplier payments due (unpaid payables, on or after their due date)
                  - recurring expenses (on their due day, every month)
                  - other expenses already entered with a future date
```

- **Current cash** = opening balance (Rs. 500,000, set in `application.properties`) plus all
  recorded transactions up to today.
- **Overdue** receivables and payables are treated as settling the day after today.
- **Safety buffer** is Rs. 50,000. Status is `SAFE` while the lowest projected balance stays
  above it, `WARNING` when it dips below the buffer, and `SHORTAGE` when it goes negative.
- The warning shows the expected shortage date, the estimated shortage amount and the
  current projected balance, followed by rule-based suggestions (collect overdue payments,
  review supplier bills, delay non-urgent spending).

## Demo scenario

Cash starts at **Rs. 500,000**. Rent, salaries and two supplier invoices land first, while
the bigger customer payments only arrive later in the month. The balance therefore drops
below the Rs. 50,000 safety buffer around day 8 and briefly goes negative around day 11
before recovering — which is exactly the situation NexFi exists to warn about.

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/dashboard` | Summary, forecast, shortage warning and advice |
| GET | `/api/forecast?days=30` | Same snapshot for a custom horizon (1–180 days) |
| GET/POST/PUT/DELETE | `/api/transactions` | Income and expenses |
| GET/POST/PUT/DELETE | `/api/receivables` | Customer receivables |
| GET/POST/PUT/DELETE | `/api/payables` | Supplier payables |
| GET/POST/PUT/DELETE | `/api/recurring-expenses` | Monthly recurring expenses |

## Configuration

`backend/src/main/resources/application.properties`:

```properties
nexfi.opening-balance=500000   # cash in the bank before any recorded transaction
nexfi.safety-buffer=50000      # minimum balance the business wants to keep
nexfi.forecast-days=30         # default forecast horizon
nexfi.timezone=Asia/Colombo    # "today" is resolved in Sri Lanka time
```

## Not included in this MVP

Authentication, AI or OCR features, payment integration, database persistence and
deployment. Data is in memory only.
=======
# NexFi-Final
AI-powered cash-flow early warning and forecasting web app for small Sri Lankan businesses
>>>>>>> 4363d3666cd334409a2034ddf4bceb0a5e8bfd3b
