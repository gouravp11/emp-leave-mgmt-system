# LeaveSync — Employee Leave & Reimbursement Management System

A full-stack web application for managing employee leave requests and expense reimbursements across three roles: **admin**, **manager**, and **employee**. Includes team management, receipt uploads, dark mode, and a fully responsive UI.

---

## Tech Stack

| Layer          | Technology                                                      |
| -------------- | --------------------------------------------------------------- |
| **Frontend**   | React 19, React Router v7, Tailwind CSS v4, Vite                |
| **Backend**    | Node.js, Express 5                                              |
| **Database**   | MongoDB + Mongoose                                              |
| **Auth**       | JWT stored in `httpOnly` cookies, bcrypt password hashing       |
| **File storage** | Cloudinary (receipt uploads)                                  |
| **Fonts**      | DM Sans (body), DM Serif Display (headings)                     |

---

## Features

### All roles
- Secure cookie-based authentication (register → pending → admin approval → login)
- Dark / light mode toggle with `localStorage` persistence and system preference fallback
- Fully responsive — mobile sidebar drawer, adaptive layouts

### Employee
- Submit leave requests (casual, sick, earned, unpaid) with overlap detection
- Submit expense reimbursements with optional receipt uploads (JPEG / PNG / PDF, up to 5 files, 5 MB each)
- Upload additional receipts to existing pending requests
- View, filter by status, and delete own pending requests

### Manager
- Approve or reject team leave requests with optional rejection reason
- Approve or reject team reimbursements; download attached receipts
- **My Team** page — member grid with per-member leaves & reimbursements drawer
- Team Leaves and Team Reimbursements pages with dual-level filtering (role + status)
- Also manage own leaves and reimbursements (when a manager is assigned to them)

### Admin
- Approve pending user accounts
- Change user roles (employee ↔ manager) and delete users
- Assign/unassign managers with cap and circular-chain enforcement
- View and cancel any leave across the entire organisation
- View all reimbursements and mark approved ones as paid
- Manage teams via the Teams tab

---

## Project Structure

```
emp-leave-mgmt-system/
├── client/               # React frontend (Vite)
│   ├── src/
│   │   ├── api/          # Axios modules (auth, user, leave, reimbursement)
│   │   ├── components/   # Reusable UI components + landing section components
│   │   ├── context/      # React Context providers (Auth, Theme, per-domain data)
│   │   ├── layouts/      # DashboardLayout shell
│   │   └── pages/        # admin/, employee/, manager/, and public pages
│   └── FRONTEND.md       # Frontend documentation (routes, contexts, API module, components)
└── server/               # Express backend
    ├── src/
    │   ├── config/       # DB connection, Cloudinary config
    │   ├── controllers/  # Route handlers
    │   ├── middleware/    # authenticate, authorize, multer upload
    │   ├── models/       # Mongoose schemas (User, Leave, Reimbursement)
    │   ├── routes/       # Express routers
    │   ├── scripts/      # One-off CLI scripts (seedAdmin)
    │   └── utils/        # createAdmin helper
    └── API.md            # API documentation (all routes, roles, workflows)
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A running MongoDB instance (local or Atlas)
- A Cloudinary account (free tier is sufficient)

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/emp-leave-mgmt-system.git
cd emp-leave-mgmt-system
```

---

### 2. Configure the server

Create `server/.env`:

```env
MONGO_URI=mongodb://localhost:27017/leavesync

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

---

### 3. Install dependencies and start the server

```bash
cd server
npm install
npm run dev
```

The server starts on **http://localhost:5000**.

A default admin account is created automatically on first startup:

| Field    | Value             |
| -------- | ----------------- |
| Email    | `admin@email.com` |
| Password | `admin1`          |

> Change these credentials immediately in a production environment.

---

### 4. Install dependencies and start the client

```bash
cd client
npm install
npm run dev
```

The client starts on **http://localhost:5173**.

---

## Available Scripts

### Server (`/server`)

| Command                                       | Description                                           |
| --------------------------------------------- | ----------------------------------------------------- |
| `npm run dev`                                 | Start Express with nodemon (hot reload)               |
| `npm run seed:admin <name> <email> <password>`| Create an additional admin account from the CLI       |
| `npm run format`                              | Format all server files with Prettier                 |

### Client (`/client`)

| Command          | Description                                  |
| ---------------- | -------------------------------------------- |
| `npm run dev`    | Start Vite dev server with HMR               |
| `npm run build`  | Production build to `dist/`                  |
| `npm run preview`| Preview the production build locally         |
| `npm run lint`   | Run ESLint                                   |
| `npm run format` | Format all client files with Prettier        |

---

## Default Ports

| Service | URL                    |
| ------- | ---------------------- |
| Client  | http://localhost:5173  |
| Server  | http://localhost:5000  |

The Vite dev server proxies all `/api/*` requests to the Express server, so no CORS configuration is needed during development.

---

## Documentation

- **[server/API.md](server/API.md)** — All REST API endpoints, roles, request/response shapes, and typical workflows.
- **[client/CLIENT.md](client/CLIENT.md)** — Frontend routes, context providers, API module functions, UI components, theme system, and page-by-page descriptions.

---

## Typical User Journey

1. Employee and manager accounts **register** at `/register` — status is `pending`.
2. **Admin** logs in, approves accounts, and assigns a manager to each employee.
3. **Employee** logs in → submits leave or reimbursement requests.
4. **Manager** reviews their team's queue → approves or rejects with a reason.
5. **Admin** cancels approved leaves if needed, and marks approved reimbursements as `paid`.
