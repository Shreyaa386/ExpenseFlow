# ExpenseFlow 💰

ExpenseFlow is a MERN Stack Expense Tracker application that helps users manage their income and expenses securely.

## 🚀 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Joi Validation
- Bcrypt
- Cookie Parser
- CORS

### Frontend
- React.js (Coming Soon)

---

## 📂 Project Structure

```
ExpenseFlow/
│
├── backend/
├── frontend/
└── README.md
```

---

## ⚙️ Backend Setup

1. Clone the repository

```bash
git clone <repository-url>
```

2. Go to backend

```bash
cd backend
```

3. Install dependencies

```bash
npm install
```

4. Create a `.env` file

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

5. Start the backend server

```bash
npm run dev
```

---

## ✅ Features Completed

### Authentication
- User Signup
- User Login
- JWT Authentication
- Protected Routes
- Logout API

### Transactions
- Add Transaction API

---

## 🚧 Upcoming Features

- Get All Transactions
- Get Single Transaction
- Update Transaction
- Delete Transaction
- Dashboard APIs
- Analytics APIs
- Receipt Upload
- React Frontend