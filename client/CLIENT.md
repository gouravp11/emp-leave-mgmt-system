# Frontend Documentation

## Tech Stack

| Layer          | Technology                                          |
| -------------- | --------------------------------------------------- |
| Framework      | React 19                                            |
| Routing        | React Router v7                                     |
| Styling        | Tailwind CSS v4 (Vite plugin)                       |
| HTTP client    | Axios (shared `client.js` instance)                 |
| Build tool     | Vite                                                |
| Fonts          | DM Sans (body), DM Serif Display (headings) via CDN |

---

## Folder Structure

```
client/src/
├── api/                    # Axios call modules, one file per domain
├── assets/                 # Static assets (images, svgs)
├── components/
│   ├── landing/            # Components used only on the landing page
│   └── ui/                 # Reusable UI primitives (Badge, Select, etc.)
│   └── utils/              # Utility components (ProtectedRoute)
├── context/                # React Context providers + hooks
├── layouts/                # Shared page shells (DashboardLayout)
└── pages/
    ├── admin/              # Admin-role pages
    ├── employee/           # Employee-role pages
    ├── manager/            # Manager-role pages
    ├── LandingPage.jsx
    ├── LoginPage.jsx
    └── RegisterPage.jsx
```

---

## Routes

All routes are defined in `App.jsx`. Role-restricted routes are wrapped in `<ProtectedRoute>`.

### Public Routes

| Path        | Component       | Description                                         |
| ----------- | --------------- | --------------------------------------------------- |
| `/`         | `LandingPage`   | Marketing landing page with features overview.      |
| `/login`    | `LoginPage`     | Login form. Redirects to the correct dashboard on success based on role. |
| `/register` | `RegisterPage`  | Registration form. Account starts as `pending` until admin approves. |

### Admin Routes — `/dashboard/*`

Requires `role === "admin"`. All nested under `AdminDashboard` → `DashboardLayout`.

| Path                       | Component              | Description                                          |
| -------------------------- | ---------------------- | ---------------------------------------------------- |
| `/dashboard`               | `AdminOverview`        | Summary stats + pending approvals quick list.        |
| `/dashboard/users`         | `UsersPage`            | Manage users (approve, change role, assign manager, delete). Teams viewer. |
| `/dashboard/leaves`        | `LeavesPage`           | All leaves across the org with filtering + cancel.   |
| `/dashboard/reimbursements`| `ReimbursementsPage`   | All reimbursements across the org + mark paid.       |

### Employee Routes — `/employee-dashboard/*`

Requires `role === "employee"`. Nested under `EmployeeDashboard` → `DashboardLayout`.

| Path                                   | Component               | Description                                       |
| -------------------------------------- | ----------------------- | ------------------------------------------------- |
| `/employee-dashboard`                  | `EmployeeOverview`      | Personal stats (leave balance, pending requests). |
| `/employee-dashboard/leaves`           | `MyLeavesPage`          | Submit, view, and delete own leaves.              |
| `/employee-dashboard/reimbursements`   | `MyReimbursementsPage`  | Submit, view, upload receipts, delete own reimbursements. |

### Manager Routes — `/manager-dashboard/*`

Requires `role === "manager"`. Nested under `ManagerDashboard` → `DashboardLayout`.

| Path                                      | Component                  | Description                                                     |
| ----------------------------------------- | -------------------------- | --------------------------------------------------------------- |
| `/manager-dashboard`                      | `ManagerOverview`          | Team stats + quick approve/reject lists for pending items.      |
| `/manager-dashboard/my-team`              | `MyTeamPage`               | Grid of team members. Click any member to view their leaves and reimbursements in a drawer. |
| `/manager-dashboard/team-leaves`          | `TeamLeavesPage`           | All team leaves. Filter by role (employee/manager) and by status. Inline approve/reject. |
| `/manager-dashboard/team-reimbursements`  | `TeamReimbursementsPage`   | All team reimbursements. Filter by role and by status. Inline approve/reject. |
| `/manager-dashboard/my-leaves`            | `MyLeavesPage`             | Manager's own leaves (same component as employee).              |
| `/manager-dashboard/my-reimbursements`    | `MyReimbursementsPage`     | Manager's own reimbursements (same component as employee).      |

> **Note:** Managers can only submit their own leaves/reimbursements when they have a manager assigned to them in the system.

---

## Route Protection

`ProtectedRoute` in `src/components/utils/ProtectedRoute.jsx` guards every dashboard route.

| Condition                      | Behaviour                                   |
| ------------------------------ | ------------------------------------------- |
| Auth still initialising        | Renders nothing (no flash)                  |
| Not logged in                  | Redirects to `/login`                       |
| Logged in, wrong role          | Redirects to `/`                            |
| Logged in, correct role        | Renders children                            |

```jsx
<ProtectedRoute role="admin">
    <AdminDashboard />
</ProtectedRoute>
```

The `role` prop accepts a single string or an array of strings. Omitting `role` allows any authenticated user.

After login, `LoginPage` reads `user.role` and redirects:

| Role       | Redirect destination      |
| ---------- | ------------------------- |
| `admin`    | `/dashboard`              |
| `manager`  | `/manager-dashboard`      |
| `employee` | `/employee-dashboard`     |

---

## Context Providers

All providers are composed in the React tree. Hooks throw if called outside their provider.

### `AuthContext` — `src/context/AuthContext.jsx`

Wraps the entire app. Calls `GET /api/auth/me` on mount to rehydrate session from the cookie.

| Export        | Type       | Description                                                    |
| ------------- | ---------- | -------------------------------------------------------------- |
| `AuthProvider`| Component  | Top-level provider. Wrap the app root.                         |
| `useAuth()`   | Hook       | Returns `{ user, setUser, login, register, logout, initializing }` |

**`user` shape returned by the API:**

| Field        | Type        | Description                                         |
| ------------ | ----------- | --------------------------------------------------- |
| `id`         | string      | MongoDB `_id`                                       |
| `name`       | string      |                                                     |
| `email`      | string      |                                                     |
| `role`       | string      | `admin` / `manager` / `employee`                    |
| `userStatus` | string      | `pending` / `approved`                              |
| `createdAt`  | ISO string  | Account creation date                               |
| `department` | string|null | From `user.profile.department`                      |
| `manager`    | object|null | `{ name, email }` — populated manager (employees only) |

### `ThemeContext` — `src/context/ThemeContext.jsx`

Controls dark / light mode for the whole app. Persisted to `localStorage` under key `"theme"`.

| Export          | Type      | Description                                                      |
| --------------- | --------- | ---------------------------------------------------------------- |
| `ThemeProvider` | Component | Wraps the app (outside `AuthProvider`).                          |
| `useTheme()`    | Hook      | Returns `{ dark: boolean, toggle: () => void }`                  |

On mount, reads `localStorage.getItem("theme")`. If not set, falls back to `window.matchMedia("(prefers-color-scheme: dark)")`. Adds or removes the `.dark` class on `<html>` whenever `dark` changes.

### `UsersContext` — `src/context/UsersContext.jsx`

Used by the admin dashboard.

| Export       | Type      | Description                                                      |
| ------------ | --------- | ---------------------------------------------------------------- |
| `UsersProvider` | Component | Wraps admin routes.                                           |
| `useUsers()` | Hook      | Returns `{ approvedUsers, pendingUsers, loading, actionLoading, error, fetchUsers, approveUser, deleteUser, changeRole, assignUserManager }` |

### `LeavesContext` — `src/context/LeavesContext.jsx`

All leaves for admin view.

| Export         | Type      | Description                                                           |
| -------------- | --------- | --------------------------------------------------------------------- |
| `LeavesProvider` | Component | Wraps admin routes.                                                 |
| `useLeaves()`  | Hook      | Returns `{ leaves, loading, actionLoading, error, fetchLeaves, cancelAdminLeave }` |

### `ReimbursementsContext` — `src/context/ReimbursementsContext.jsx`

All reimbursements for admin view.

| Export                    | Type      | Description                                                          |
| ------------------------- | --------- | -------------------------------------------------------------------- |
| `ReimbursementsProvider`  | Component | Wraps admin routes.                                                  |
| `useReimbursements()`     | Hook      | Returns `{ reimbursements, loading, actionLoading, error, fetchReimbursements, markPaid }` |

### `MyLeavesContext` — `src/context/MyLeavesContext.jsx`

Own leaves for employee and manager.

| Export            | Type      | Description                                                                      |
| ----------------- | --------- | -------------------------------------------------------------------------------- |
| `MyLeavesProvider`| Component | Wraps employee/manager routes.                                                   |
| `useMyLeaves()`   | Hook      | Returns `{ myLeaves, loading, actionLoading, error, fetchMyLeaves, createLeave, deleteLeave }` |

### `MyReimbursementsContext` — `src/context/MyReimbursementsContext.jsx`

Own reimbursements for employee and manager.

| Export                       | Type      | Description                                                                                   |
| ---------------------------- | --------- | --------------------------------------------------------------------------------------------- |
| `MyReimbursementsProvider`   | Component | Wraps employee/manager routes.                                                                |
| `useMyReimbursements()`      | Hook      | Returns `{ myReimbursements, loading, actionLoading, error, fetchMyReimbursements, createReimbursement, deleteReimbursement }` |

### `TeamLeavesContext` — `src/context/TeamLeavesContext.jsx`

Team leaves for manager view.

| Export               | Type      | Description                                                                                          |
| -------------------- | --------- | ---------------------------------------------------------------------------------------------------- |
| `TeamLeavesProvider` | Component | Wraps manager routes.                                                                                |
| `useTeamLeaves()`    | Hook      | Returns `{ teamLeaves, loading, actionLoading, error, setError, fetchTeamLeaves, approveTeamLeave, rejectTeamLeave }` |

### `TeamReimbursementsContext` — `src/context/TeamReimbursementsContext.jsx`

Team reimbursements for manager view.

| Export                        | Type      | Description                                                                                                             |
| ----------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------- |
| `TeamReimbursementsProvider`  | Component | Wraps manager routes.                                                                                                   |
| `useTeamReimbursements()`     | Hook      | Returns `{ teamReimbursements, loading, actionLoading, error, setError, fetchTeamReimbursements, approveTeamReimbursement, rejectTeamReimbursement }` |

---

## API Module

All files live in `src/api/`. Every function returns a Promise that resolves directly to the response data (the Axios interceptor in `client.js` unwraps `response.data`). Errors are normalised to `new Error(message)`.

### `client.js`

Shared Axios instance — `baseURL: "/api"`, `withCredentials: true`. The Vite dev server proxies `/api` to `http://localhost:5000`. In production, set the same prefix on the Express server.

### `auth.api.js`

| Function      | Signature                                    | API call                   |
| ------------- | -------------------------------------------- | -------------------------- |
| `loginApi`    | `(credentials) => Promise`                   | `POST /auth/login`         |
| `registerApi` | `(userData) => Promise`                      | `POST /auth/register`      |
| `logoutApi`   | `() => Promise`                              | `POST /auth/logout`        |
| `getMeApi`    | `() => Promise`                              | `GET /auth/me`             |

### `user.api.js`

| Function        | Signature                                  | API call                             |
| --------------- | ------------------------------------------ | ------------------------------------ |
| `getUsers`      | `() => Promise`                            | `GET /users`                         |
| `approveUser`   | `(userId) => Promise`                      | `PATCH /users/:userId/approve`       |
| `deleteUser`    | `(userId) => Promise`                      | `DELETE /users/:userId`              |
| `changeRole`    | `(userId, role) => Promise`                | `PATCH /users/:userId/role`          |
| `assignManager` | `(userId, managerId) => Promise`           | `PATCH /users/:userId/manager`       |
| `getMyTeam`     | `() => Promise`                            | `GET /users/team`                    |

### `leave.api.js`

| Function        | Signature                                        | API call                           |
| --------------- | ------------------------------------------------ | ---------------------------------- |
| `getAllLeaves`   | `(params?) => Promise`                           | `GET /leaves`                      |
| `getMyLeaves`   | `(params?) => Promise`                           | `GET /leaves/my`                   |
| `getTeamLeaves` | `(params?) => Promise`                           | `GET /leaves/team`                 |
| `getUserLeaves` | `(userId, params?) => Promise`                   | `GET /leaves/user/:userId`         |
| `createLeave`   | `(data) => Promise`                              | `POST /leaves`                     |
| `approveLeave`  | `(leaveId) => Promise`                           | `PATCH /leaves/:leaveId/approve`   |
| `rejectLeave`   | `(leaveId, rejectionReason) => Promise`          | `PATCH /leaves/:leaveId/reject`    |
| `cancelLeave`   | `(leaveId) => Promise`                           | `PATCH /leaves/:leaveId/cancel`    |
| `deleteLeave`   | `(leaveId) => Promise`                           | `DELETE /leaves/:leaveId`          |

`params` is a plain object forwarded as query string, e.g. `{ status: "pending" }`.

### `reimbursement.api.js`

| Function                   | Signature                                      | API call                                    |
| -------------------------- | ---------------------------------------------- | ------------------------------------------- |
| `getAllReimbursements`      | `(params?) => Promise`                         | `GET /reimbursements`                       |
| `getMyReimbursements`      | `(params?) => Promise`                         | `GET /reimbursements/my`                    |
| `getTeamReimbursements`    | `(params?) => Promise`                         | `GET /reimbursements/team`                  |
| `getUserReimbursements`    | `(userId, params?) => Promise`                 | `GET /reimbursements/user/:userId`          |
| `createReimbursement`      | `(formData: FormData) => Promise`              | `POST /reimbursements` (multipart)          |
| `approveReimbursement`     | `(id) => Promise`                              | `PATCH /reimbursements/:id/approve`         |
| `rejectReimbursement`      | `(id, rejectionReason) => Promise`             | `PATCH /reimbursements/:id/reject`          |
| `markReimbursementPaid`    | `(id) => Promise`                              | `PATCH /reimbursements/:id/paid`            |
| `deleteReimbursement`      | `(id) => Promise`                              | `DELETE /reimbursements/:id`                |

---

## Layouts

### `DashboardLayout` — `src/layouts/DashboardLayout.jsx`

The shared shell for all three dashboard roles. Accepts `navItems` as a prop.

```jsx
<DashboardLayout navItems={[{ label, icon: <JSX />, to, end? }]} />
```

| Prop       | Type    | Description                                                                 |
| ---------- | ------- | --------------------------------------------------------------------------- |
| `navItems` | Array   | `[{ label: string, icon: JSX, to: string, end?: boolean }]`. `end: true` prevents the root route from matching all nested paths. |

**Features:**
- Collapsible sidebar on mobile (`< lg`) via overlay drawer. Hamburger button in the topbar.
- Active nav link styled via React Router's `NavLink` `isActive`.
- User profile chip in the topbar (top-right) — click to open a popover showing email, joined date, department (if set), and manager info (employees only).
- Dark mode toggle button (sun/moon icon) in the topbar.
- Logout button in the sidebar footer.

---

## UI Components

All in `src/components/ui/`.

### `Badge`

Status pill with a coloured dot. Supports light and dark palettes (reads `useTheme()`).

```jsx
<Badge status="pending" />   // pending | approved | rejected | cancelled | paid | employee | manager
```

### `StatCard`

Dashboard metric card.

```jsx
<StatCard
    title="Pending Leaves"
    value={3}
    subtitle="awaiting review"   // optional
    icon={<SomeIcon />}
    accent="#fef9c3"             // icon background colour, defaults to #e8eedf
/>
```

### `Select`

Custom styled dropdown (replaces native `<select>`). Fires a synthetic `{ target: { name, value } }` event so it is a drop-in replacement in form `onChange` handlers.

```jsx
<Select
    name="leaveType"
    value={form.leaveType}
    onChange={handleChange}
    options={[{ label: "Sick", value: "sick" }, ...]}
    placeholder="Select type…"
    disabled={false}
/>
```

### `DateInput`

Custom calendar date picker. Opens a `position: fixed` calendar so it is never clipped by `overflow: hidden` ancestors. Returns an ISO date string.

```jsx
<DateInput
    name="startDate"
    value={form.startDate}
    onChange={handleChange}
    placeholder="Start date"
    min="2024-01-01"   // optional ISO date string
    max="2025-12-31"   // optional ISO date string
/>
```

### `PageHeader`

Top-of-page title block with an optional action slot.

```jsx
<PageHeader
    title="My Leaves"
    subtitle="View and manage your leave requests."
    action={<button>New Request</button>}   // optional
/>
```

---

## Theme System

Dark mode uses Tailwind v4's class-based variant (`@variant dark`). The `.dark` class is toggled on `<html>`.

### How it works

1. `ThemeProvider` reads `localStorage("theme")` on first render. Falls back to `prefers-color-scheme`.
2. It adds/removes `.dark` on `<html>` and writes back to `localStorage` on every toggle.
3. `index.css` contains ~70 global CSS overrides (`.dark .bg-white { … }`, etc.) that remap every hardcoded hex color class used in the codebase. This means **no individual page component needs dark-mode variants** — they all theme automatically.
4. Components that use **inline `style` props** for colour (like `Badge`) read `useTheme().dark` directly and swap to an alternate palette object.

### Customising dark colours

All overrides are in `src/index.css` under the comment block `/* Dark mode — global colour overrides */`. The mapping follows this pattern:

| Light token    | Dark equivalent |
| -------------- | --------------- |
| `#f5f7f2`      | `#0f1409`       |
| `#e8eedf`      | `#1f2d18`       |
| `#d4dfc7`      | `#263a1b`       |
| `bg-white`     | `#192313`       |
| `#2d3a22` text | `#d4dfc7`       |
| `#6b7c5a` text | `#7e9570`       |
| `#8fa07a` text | `#617759`       |

---

## Pages

### Public

#### `LandingPage`
Marketing page. Composed of `Navbar`, `Hero`, `Features`, `HowItWorks`, `Footer` landing components. No auth required.

#### `LoginPage`
Email + password form. On success, reads `user.role` and pushes to the matching dashboard route. Displays API error messages inline.

#### `RegisterPage`
Name, email, password, and role (employee/manager) form. On success shows a confirmation message — account remains `pending` until an admin approves it.

---

### Admin Pages

#### `AdminOverview`
- 4 stat cards: Total Users, Pending Approvals, Pending Leaves, Pending Reimbursements.
- Two quick-action lists: pending users (approve button) and latest pending leaves/reimbursements.

#### `UsersPage`
Two main tabs:

- **Users tab** — searchable + filterable (role, status) table/card list. Per-row actions: approve, change role, delete. Mobile: card layout.
- **Teams tab** — expandable manager cards showing assigned direct reports. Assign/unassign members via modal.

#### `LeavesPage`
- Filterable by status (`all` / `pending` / `approved` / `rejected` / `cancelled`).
- Admin can cancel any `approved` leave.
- Table on desktop, card list on mobile.

#### `ReimbursementsPage`
- Filterable by status.
- Admin can mark any `approved` reimbursement as `paid`.
- Receipt download links per reimbursement.

---

### Employee Pages

#### `EmployeeOverview`
- 4 stat cards: Total Leaves, Approved Leaves, Pending Leaves, Total Reimbursements.
- Quick-view of recent leaves and reimbursements.

#### `MyLeavesPage`
- Status filter tabs (All / Pending / Approved / Rejected / Cancelled).
- New leave form (drawer/modal): `leaveType`, `startDate`, `endDate`, `reason`.
- Delete button on own `pending` leaves.
- Rejection reason shown on rejected cards.

#### `MyReimbursementsPage`
- Status filter tabs.
- New reimbursement form: `category`, `amount`, `description`, receipt file upload (up to 5 files).
- Upload additional receipts to existing `pending` reimbursements.
- Download receipt files via API route.
- Delete own `pending` reimbursements.

---

### Manager Pages

#### `ManagerOverview`
- 4 stat cards: Team Members, Pending Leaves, Pending Reimbursements, Pending Amount (£).
- Two quick-action lists (top 5 each): pending team leaves and pending team reimbursements with inline approve/reject.

#### `MyTeamPage`
- Role filter pills: All / Employees / Managers.
- Grid of member cards (avatar, name, email, role badge).
- Click a card → right-side drawer opens showing:
  - **Leaves tab** — member's full leave history with inline approve/reject for `pending` items.
  - **Reimbursements tab** — member's full reimbursement history with inline approve/reject + receipt download links.

#### `TeamLeavesPage`
- Two-level filter: role pills (All / Employee / Manager) on top, status tabs below.
- Status counts update relative to the active role filter.
- Inline approve/reject with rejection reason textarea.

#### `TeamReimbursementsPage`
- Identical filter pattern to `TeamLeavesPage`.
- Inline approve/reject. Receipt download links.

---

## Typical Workflows

**First login (employee):**
1. Register at `/register`.
2. Admin approves account and assigns a manager.
3. Employee logs in → redirected to `/employee-dashboard`.

**Submitting a leave:**
1. Employee opens `/employee-dashboard/leaves` → clicks "New Request".
2. Fills in type, dates, optional reason → submits.
3. Manager sees it in `TeamLeavesPage` (status: `pending`).
4. Manager approves or rejects (with reason) inline.
5. Updated status appears on employee's `MyLeavesPage`.

**Submitting a reimbursement:**
1. Employee opens `/employee-dashboard/reimbursements` → clicks "New Request".
2. Fills in category, amount, description; optionally attaches receipts → submits.
3. More receipts can be uploaded later from the same page while the request is `pending`.
4. Manager approves or rejects.
5. Admin marks as `paid` from `ReimbursementsPage`.

**Manager reviewing their team at a glance:**
1. Opens `/manager-dashboard/my-team`.
2. Clicks any member card → drawer opens.
3. Uses Leaves or Reimbursements tabs to review and act without leaving the page.
