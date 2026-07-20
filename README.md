# 💰 ExpenseFlow

ExpenseFlow is a **Full Stack MERN Expense Tracker** application that helps users securely manage their income and expenses. It provides JWT Authentication, transaction management, and a dashboard that displays income, expenses, and current balance.

> 🚧 **Backend Completed** | Frontend Coming Soon

---

# 🚀 Tech Stack

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Joi Validation
- Bcrypt
- Cookie Parser
- CORS

## Frontend

- React.js *(Coming Soon)*

---

# 📂 Project Structure

```
ExpenseFlow/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── package.json
│   └── .gitignore
│
├── frontend/ (Coming Soon)
│
└── README.md
```

---

# ⚙️ Backend Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
```

### 2. Navigate to Backend Folder

```bash
cd backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Create a `.env` File

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 5. Start the Development Server

```bash
npm run dev
```

Server will start at:

```text
http://localhost:5000
```

---

# ✨ Features

## 🔐 Authentication

- User Signup
- User Login
- JWT Authentication
- Protected Routes
- Get Logged-in User
- Logout API
- Password Hashing using Bcrypt

---

## 💸 Transaction Management

- Add Transaction
- Get All Transactions
- Get Transaction By ID
- Update Transaction
- Delete Transaction

---

## 📊 Dashboard

- Total Income
- Total Expense
- Current Balance
- MongoDB Aggregation Pipeline

---

## 🛠 Backend Highlights

- RESTful API Design
- MVC Architecture
- MongoDB Atlas Integration
- Mongoose ODM
- Joi Request Validation
- JWT Authorization
- Secure Password Hashing
- Environment Variables
- Error Handling
- Clean Folder Structure

---

# 🌐 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/v1/auth/signup` |
| POST | `/api/v1/auth/login` |
| GET | `/api/v1/auth/me` |
| POST | `/api/v1/auth/logout` |

---

## Transactions

| Method | Endpoint |
|---------|----------|
| POST | `/api/v1/transactions` |
| GET | `/api/v1/transactions` |
| GET | `/api/v1/transactions/:id` |
| PUT | `/api/v1/transactions/:id` |
| DELETE | `/api/v1/transactions/:id` |

---

## Dashboard

| Method | Endpoint |
|---------|----------|
| GET | `/api/v1/dashboard` |

---

# 📋 Project Status

### ✅ Backend

- Authentication Module
- Transaction CRUD APIs
- Dashboard APIs
- MongoDB Integration
- JWT Security
- Validation
- API Testing using Thunder Client

### 🚧 Frontend

- React UI
- API Integration
- Charts & Analytics
- Responsive Dashboard

---

# 🚀 Future Enhancements

- Transaction Search
- Filters
- Pagination
- Sorting
- Budget Planning
- Monthly Analytics
- Charts & Graphs
- Receipt Upload
- Email Notifications
- Deployment (Render + Vercel)

---

# 👩‍💻 Author

**Shreya Mishra**

B.Tech CSE Student

MERN Stack Developer

---

# ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.