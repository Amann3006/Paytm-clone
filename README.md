# Paytm Clone (Full-Stack Digital Wallet)

A full-stack digital wallet and peer-to-peer payment application built using **React**, **Node.js**, **Express**, **MongoDB (Mongoose)**, and styled with **Tailwind CSS v4**.

---

## 🚀 Features

- **User Authentication**: Secure token-based authentication using **JWT** (JSON Web Tokens) with email validation and encrypted session persistence.
- **Dynamic Wallet Balance**: Every newly registered user receives an initial randomized starting wallet balance, with dynamic balance retrieval and on-demand refresh.
- **Instant Money Transfers**: Peer-to-peer money transfers between users with input validation and atomic database updates.
- **Searchable User Directory**: Real-time user directory with search debouncing to find recipients quickly by name.
- **Database Resilience**: Supports both standalone MongoDB (atomic updates with rollback) and MongoDB replica sets (multi-document ACID transactions).
- **Modern Responsive UI**: Clean fintech design built using Tailwind CSS v4, with accessible forms, error alerts, loading spinners, and responsive mobile-first layouts.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios

### **Backend**
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB via Mongoose
- **Validation**: Zod schema validation
- **Authentication**: JSON Web Token (`jsonwebtoken`)
- **CORS**: Express CORS middleware

---

## 📂 Project Structure

```text
Paytm-clone/
├── README.md
├── paytm/
│   ├── backend/
│   │   ├── config.js          # App & JWT secret configuration
│   │   ├── db.js              # Mongoose schemas & MongoDB connection
│   │   ├── main.js            # Express server initialization (Port 3000)
│   │   ├── middleware.js      # JWT authentication middleware
│   │   └── routes/
│   │       ├── account.js     # Balance check & money transfer endpoints
│   │       ├── index.js       # Main API router (/api/v1)
│   │       └── user.js        # Signup, Signin, Me, and Bulk search endpoints
│   └── frontend/
│       ├── index.html         # HTML root document
│       ├── vite.config.js     # Vite configuration with Tailwind CSS v4
│       └── src/
│           ├── App.jsx        # Routing & auth redirection
│           ├── index.css      # Tailwind CSS entrypoint (@import "tailwindcss")
│           ├── components/
│           │   ├── AppbarTemp.jsx    # Top navigation bar with user profile & logout
│           │   ├── Balance.jsx       # Wallet balance card with refresh action
│           │   ├── BottomWarning.jsx # Auth page link toggle
│           │   ├── Button.jsx        # Reusable button with spinner & states
│           │   ├── Heading.jsx       # Section & page heading typography
│           │   ├── InputBox.jsx      # Accessible form input field
│           │   ├── SubHeading.jsx    # Sub-text description
│           │   └── Userstemp.jsx     # Searchable user list with Send Money buttons
│           └── pages/
│               ├── Dashboard.jsx     # Main user dashboard
│               ├── SendMoney.jsx     # Transfer initiation & receipt screen
│               ├── SigninTemp.jsx    # Login page
│               └── SignupTemp.jsx    # Registration page
```

---

## ⚙️ Prerequisites

Before running the application, make sure you have:
1. **Node.js** (v18 or higher) - [Download Node.js](https://nodejs.org/)
2. **Docker** (for MongoDB) or a local MongoDB installation running on port `27017`.

---

## 🏃 Quick Start Guide

### 1. Start MongoDB in Docker

Open your terminal and start a MongoDB container:

```bash
docker run -d --name mongodb -p 27017:27017 -v mongodb_data:/data/db mongo:latest
```

Verify that the container is running:
```bash
docker ps
```

---

### 2. Start the Backend Server

Open a terminal and run:

```bash
# Navigate to backend directory
cd "paytm/backend"

# Install dependencies (only required once)
npm install

# Start the server
node main.js
```

The backend will start on **`http://localhost:3000`**:
```text
Server running on port 3000
MongoDB connected successfully
```

---

### 3. Start the Frontend Server

Open a **separate** terminal window and run:

```bash
# Navigate to frontend directory
cd "paytm/frontend"

# Install dependencies (only required once)
npm install

# Start the Vite development server
npm run dev
```

The frontend will start on **`http://localhost:5173`**:
```text
  VITE v5.4.21  ready in ... ms

  ➜  Local:   http://localhost:5173/
```

---

## 🌐 API Reference

Base URL: `http://localhost:3000/api/v1`

### **User Endpoints (`/user`)**

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/user/signup` | No | Register a new user and create an initial wallet balance |
| `POST` | `/user/signin` | No | Authenticate user credentials and return JWT token |
| `GET` | `/user/me` | Yes (`Bearer <token>`) | Get logged-in user profile (`firstName`, `lastName`, `username`, `id`) |
| `GET` | `/user/bulk?filter=<name>` | Optional | Search users by name (automatically excludes logged-in user if token provided) |
| `PUT` | `/user/` | Yes (`Bearer <token>`) | Update user profile fields (`password`, `firstName`, `lastName`) |

### **Account Endpoints (`/account`)**

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/account/balance` | Yes (`Bearer <token>`) | Retrieve the user's available wallet balance |
| `POST` | `/account/transfer` | Yes (`Bearer <token>`) | Transfer money to another user by ID (`to`, `amount`) |

---

## 🧪 Testing the Payment Flow

1. **Sign Up**:
   - Go to `http://localhost:5173/signup`.
   - Create user 1: `alice@example.com` / `password123`.
   - Observe the initial credited balance on the Dashboard.
2. **Log Out**:
   - Click the **Logout** button in the top-right corner.
3. **Sign Up Second User**:
   - Create user 2: `bob@example.com` / `password123`.
4. **Transfer Money**:
   - On Bob's dashboard, search for "Alice".
   - Click **Send Money** next to Alice's card.
   - Enter ₹`200` and click **Initiate Transfer**.
   - See the green confirmation checkmark.
5. **Verify**:
   - Return to the Dashboard and verify Bob's balance decreased by ₹`200`.
   - Log out and log back in as Alice to see her balance increased by ₹`200`.

---

## 🔒 Security & Validation Details

- **Safe Amount Constraints**: Negative amounts, non-numeric values, or $0$ transfers are strictly rejected.
- **Self-Transfer Prevention**: Users cannot send money to their own accounts.
- **Session Cleanup**: Database transaction sessions automatically close in a `finally` block to prevent connection leaks.
- **Regex Sanitization**: Special regex characters in search queries are escaped to avoid regex injection and server crashes.

