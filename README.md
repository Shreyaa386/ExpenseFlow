# 💰 ExpenseFlow — Enterprise Dark Fintech MERN SaaS

ExpenseFlow is a full-stack personal finance and expense management platform engineered with the MERN stack (MongoDB, Express, React, Node.js) and integrated with Google Gemini AI. It provides an executive dark fintech experience featuring real-time transaction ledgers, weekly and monthly spending caps with threshold alarms, peer bill splitting with zero-sum debt reconciliation, and an authoritative AI financial assistant.

---

## ⚡ Key Feature Modules

### 1. 🔐 Authentication & Session Security
- **JWT Authentication**: Secure stateless token authentication with expiration enforcement.
- **Bcrypt Password Security**: Passwords hashed with salt factor 10 before database writes; passwords excluded by default (`select: false`).
- **Protected Routing**: React Router v7 guarded routes redirect unauthenticated users to `/login`.
- **Granular User Isolation**: Every ledger operation, budget calculation, and split debt query is strictly scoped to the authenticated user ID (`req.user._id`).

### 2. 📊 Executive Financial Dashboard
- **Real-Time Liquidity KPI Cards**: Total Balance, Inflow (Income), Outflow (Expenses), and Derived Savings Rate.
- **Dynamic Horizon Filtering**: Switch between All Time, This Month, Last 30 Days, and This Year.
- **Visual Analytics**: Interactive Recharts bar chart comparing monthly credits vs. debits, alongside categorical expense pie distribution.
- **Spending Limit Alert Banner**: Proactive warnings when any active budget crosses critical thresholds (e.g. 80%, 90%, 100%).
- **Split Bills & IOUs Summary**: Real-time summary cards for "You are owed" and "You owe".
- **Live Notifications Feed**: Real-time dropdown showing threshold alarms and settlement updates.

### 3. 💸 Transaction Ledger
- **Complete CRUD Lifecycle**: Record, view, edit, and delete income and expense transactions.
- **Comprehensive Filtering**: Search by keyword, filter by transaction type, category, date horizon, and sort order.
- **Pagination**: Scalable server/client pagination preventing UI lag.
- **Automated Budget Synchronization**: Adding or updating an expense immediately triggers budget usage re-evaluation.

### 4. 🏷️ Category Management & Safe Deletion
- **Default & Custom Categories**: Pre-seeded with standard categories; supports user-defined custom categories with custom icons and color tokens.
- **Safe Deletion Policy**: Prevents deleting categories assigned to active transactions to protect ledger integrity.
- **Cascading Name Updates**: Renaming a category automatically updates existing transaction tags.

### 5. 🎯 Weekly & Monthly Budgets
- **Flexible Timeframes**: Supports both calendar monthly and Monday-to-Sunday ISO weekly budgets.
- **Category & Global Caps**: Set limits for specific categories or an overall aggregate ceiling.
- **Multi-Threshold Alarms**: Configurable thresholds (50%, 75%, 90%, 100%) with real-time percentage consumption bars.
- **Duplicate Alarm Suppression**: Tracks alerted thresholds per period cycle (`periodKey` e.g. `2026-10` or `2026-W42`) to prevent duplicate spam.

### 6. 👥 Split Expenses & Shared Bills
- **Equal & Custom Splits**: Splits bills across multiple participants with penny-exact rounding (no floating-point cents lost).
- **Zero-Sum Balances**: Mathematical balance invariant where sum of all participant net balances equals zero.
- **Pairwise Debt Minimization**: Automatically calculates who owes whom directly.
- **Settlement Recording**: Records partial or full settlements, adjusts debtor and creditor balances, and automatically transitions status to "Settled" once all debts clear.
- **Participant Access Control**: Only registered participants of a shared bill can record settlements.

### 7. 🔔 Live Notifications
- **Navbar Bell Dropdown**: Live unread badge with ping animation and 30-second polling.
- **Granular Actions**: Mark individual alerts as read, "Mark all as read", and dismiss.

### 8. 🤖 Google Gemini AI Financial Insights & Conversational Assistant
- **Authoritative Backend Computation**: Financial numbers are calculated strictly in trusted backend code before Gemini is invoked. Gemini never calculates financial figures from scratch.
- **Distinction of Observations vs Suggestions**: Clear badges separating verified ledger facts from practical financial recommendations.
- **Cost Control & Caching**: Insights are cached in-memory per user for 10 minutes to minimize API quota usage, with explicit manual refresh support.
- **Sliding-Window Rate Limiting**: Built-in rate limiters (10 refreshes / 10m, 25 chat messages / 10m).
- **Conversational Assistant (`/ai-assistant`)**:
  - Interactive chat interface with quick suggestion chips.
  - Sandboxed read-only permissions (no arbitrary code execution or DB mutations).
  - Grounded in live metrics with persistent chat history in MongoDB.
  - Informative configuration guides if `GEMINI_API_KEY` is not set (returns 503 with setup steps; never returns fabricated data).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, TailwindCSS v4, Recharts, Lucide Icons, React Hook Form, React Hot Toast, React Router v7 |
| **Backend** | Node.js (v24), Express.js (v5), MongoDB Atlas, Mongoose, JWT, Bcrypt, Joi |
| **AI Integration** | Official Google Gen AI SDK (`@google/genai` v2.30.0), `gemini-2.5-flash` model |
| **Testing** | Node.js native assert test runner, live HTTP ephemeral test harness, ESLint |

---

## 📂 Project Architecture

```
ExpenseFlow/
├── backend/
│   ├── src/
│   │   ├── config/             # Environment & MongoDB Atlas connection
│   │   ├── controllers/        # Auth, Transactions, Budgets, Splits, AI, Dashboard
│   │   ├── middleware/         # JWT Bearer authentication guard
│   │   ├── models/             # User, Transaction, Budget, SplitExpense, Notification, ChatMessage
│   │   ├── routes/             # RESTful API route definitions
│   │   ├── services/           # Financial summary aggregator & Gemini SDK service
│   │   ├── utils/              # Budget threshold evaluators & date boundary helpers
│   │   ├── validators/         # Joi schema input validators
│   │   ├── app.js              # Express app configuration & middleware
│   │   └── server.js           # Server bootstrap
│   ├── .env.example            # Documented backend environment template
│   ├── package.json            # Backend dependencies & npm test script
│   └── test_e2e_suite.js       # Automated 16-test E2E integration test suite
│
├── frontend/
│   ├── src/
│   │   ├── components/         # UI primitives, charts, transaction forms, widgets
│   │   ├── context/            # AuthContext, TransactionContext, ThemeContext
│   │   ├── layouts/            # MainLayout, AuthLayout, OnboardingLayout
│   │   ├── pages/              # Dashboard, Transactions, Budgets, Splits, AI Assistant, Analytics, Profile, Settings
│   │   ├── routes/             # AppRoutes, ProtectedRoute, PublicRoute
│   │   ├── services/           # Axios API client services
│   │   ├── index.css           # TailwindCSS v4 theme tokens
│   │   └── main.jsx            # Application entry point
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore                  # Git protection excluding .env and dependencies
└── README.md
```

---

## 🌐 API Reference

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/signup` | Public | Register new user account with validated credentials |
| `POST` | `/login` | Public | Authenticate user and receive signed JWT token |
| `GET` | `/me` | Bearer | Retrieve authenticated user session data |
| `POST` | `/logout` | Public | Clear user session |

### Transactions (`/api/v1/transactions`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/` | Bearer | Retrieve user transactions with filtering & pagination |
| `POST` | `/` | Bearer | Create a new income or expense transaction |
| `GET` | `/:id` | Bearer | Retrieve a single transaction by ID |
| `PUT` | `/:id` | Bearer | Update an existing transaction |
| `DELETE` | `/:id` | Bearer | Delete a transaction |

### Budgets (`/api/v1/budgets`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/` | Bearer | List active/inactive budgets with live spending usage |
| `POST` | `/` | Bearer | Create a weekly or monthly budget limit |
| `PUT` | `/:id` | Bearer | Update budget limit, thresholds, or period |
| `PATCH` | `/:id/toggle` | Bearer | Toggle active/disabled status |
| `DELETE` | `/:id` | Bearer | Remove budget |

### Split Expenses (`/api/v1/splits`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/` | Bearer | List shared expenses, participant shares, and net IOUs |
| `POST` | `/` | Bearer | Create equal or custom split bill |
| `POST` | `/:id/settle` | Bearer | Record settlement between participants |
| `DELETE` | `/:id` | Bearer | Delete shared bill (creator only) |

### Notifications (`/api/v1/notifications`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/` | Bearer | Fetch notification feed and unread count |
| `PATCH` | `/:id/read` | Bearer | Mark single alert as read |
| `PATCH` | `/read-all` | Bearer | Mark all notifications as read |
| `DELETE` | `/:id` | Bearer | Dismiss notification |

### Gemini AI (`/api/v1/ai`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/status` | Bearer | Check Gemini API key configuration status |
| `GET` | `/insights` | Bearer | Generate or retrieve cached authoritative monthly insights |
| `POST` | `/chat` | Bearer | Send question to AI assistant grounded in ledger data |
| `GET` | `/chat/history` | Bearer | Retrieve user conversation history |
| `DELETE` | `/chat/history` | Bearer | Clear chat thread |

---

## ⚙️ Local Development Setup

### 1. Prerequisites
- **Node.js**: v20 or higher (tested on v24)
- **MongoDB**: MongoDB Atlas connection URI or local MongoDB instance
- **Google Gemini API Key**: Free key from [Google AI Studio](https://aistudio.google.com/app/apikey) (optional; core features run without AI)

### 2. Backend Setup
1. Open a terminal and navigate to the backend:
   ```bash
   cd backend
   npm install
   ```
2. Configure environment variables by creating `backend/.env`:
   ```bash
   cp .env.example .env
   ```
3. Update `backend/.env` with your parameters:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret_key
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```
4. Start the backend:
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

### 3. Frontend Setup
1. Open a second terminal and navigate to the frontend:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Vite dev server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

---

## 🧪 Testing & Code Quality

### Running Backend E2E Test Suite
The automated test suite runs 16 end-to-end tests covering bcrypt hashing, JWT validation, financial arithmetic, date boundaries, split rounding, pairwise debt settlements, threshold alarms, rate limiting, and HTTP middleware guards:
```bash
cd backend
npm test
```

### Running Frontend Linter & Production Build
```bash
cd frontend

# Run ESLint checks
npm run lint

# Build production bundle
npm run build
```

---

## 🚀 Deployment Guide

### Backend Deployment (Render / Railway / DigitalOcean)
1. Set the root directory to `backend`.
2. Set Build Command: `npm install`.
3. Set Start Command: `npm start`.
4. Configure Environment Variables in your hosting dashboard:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `MONGODB_URI`: Your MongoDB Atlas connection URI.
   - `JWT_SECRET`: A cryptographically random secret string.
   - `JWT_EXPIRES_IN`: `7d`
   - `CLIENT_URL`: The production URL of your frontend (e.g. `https://expenseflow.vercel.app`).
   - `GEMINI_API_KEY`: Your Google AI Studio API key.

### Frontend Deployment (Vercel / Netlify / Cloudflare Pages)
1. Set the root directory to `frontend`.
2. Set Build Command: `npm run build`.
3. Set Output Directory: `dist`.
4. Update `frontend/src/services/api.js` or define `VITE_API_BASE_URL` pointing to your deployed backend URL (e.g. `https://expenseflow-api.onrender.com/api/v1`).

---

## 🔒 Security Best Practices Implemented
- **No Client-Side Secrets**: `GEMINI_API_KEY` and database credentials exist exclusively on the server.
- **Zero Sensitive Logging**: Authorization headers, JWT payloads, and raw user passwords are excluded from production server logs.
- **IDOR Protection**: Database mutations and queries enforce ownership through `user: req.user._id`.
- **Shared-Bill Participant Verification**: Only designated participants or creators can record settlements or view detailed participant IOUs.
- **Input Sanitization & Validation**: All incoming requests are validated against strict Joi schemas before hitting controller logic.
- **Rate-Limited AI Endpoints**: Sliding-window rate limiters prevent API quota exhaustion and denial-of-service attempts.