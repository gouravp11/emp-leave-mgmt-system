# API Documentation

## Roles

The system has three roles. Each role has a different level of access.

- **admin** — manages the org structure. Approves accounts, assigns managers, changes roles, and deletes users.
- **manager** — manages a team. Approves/rejects leaves and reimbursements for direct reports. Can also submit their own leaves and reimbursements if they have a manager assigned.
- **employee** — submits leave and reimbursement requests. Can view and delete their own pending requests.

---

## Authentication

All routes except `/auth/register` and `/auth/login` require a valid session cookie set at login.

| Method | Route                | Access             | Description                                                     |
| ------ | -------------------- | ------------------ | --------------------------------------------------------------- |
| POST   | `/api/auth/register` | Public             | Create a new account. Status is `pending` until admin approves. |
| POST   | `/api/auth/login`    | Public             | Log in and receive a session cookie.                            |
| POST   | `/api/auth/logout`   | Any logged-in user | Clear the session cookie.                                       |

---

## Users

### Admin-only

| Method | Route                        | Description                                                                                                                                                                 |
| ------ | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/users`                 | Get all non-admin users.                                                                                                                                                    |
| PATCH  | `/api/users/:userId/approve` | Approve a pending user account.                                                                                                                                             |
| PATCH  | `/api/users/:userId/role`    | Change a user's role between `employee` and `manager`. Also clears their assigned manager.                                                                                  |
| DELETE | `/api/users/:userId`         | Delete a user. If the user is a manager, all their direct reports are unassigned.                                                                                           |
| PATCH  | `/api/users/:userId/manager` | Assign or unassign a manager for a user. Enforces caps (max 10 employees, max 2 managers per manager) and blocks circular chains. Send `{ "managerId": null }` to unassign. |

### Manager-only

| Method | Route             | Description                                               |
| ------ | ----------------- | --------------------------------------------------------- |
| GET    | `/api/users/team` | Get all users whose `managerId` is the logged-in manager. |

---

## Leaves

### Employee + Manager (own leaves)

| Method | Route                  | Description                                                                                                                |
| ------ | ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/leaves/my`       | Get own leave history. Filter by `?status=pending\|approved\|rejected\|cancelled`.                                         |
| POST   | `/api/leaves`          | Submit a leave request. Requires a manager to be assigned. Body: `leaveType`, `startDate`, `endDate`, `reason` (optional). |
| DELETE | `/api/leaves/:leaveId` | Delete own leave. Only `pending` leaves can be deleted.                                                                    |

### Manager-only (team leaves)

| Method | Route                          | Description                                                                    |
| ------ | ------------------------------ | ------------------------------------------------------------------------------ |
| GET    | `/api/leaves/team`             | Get all leaves submitted by direct reports. Filter by `?status=`.              |
| GET    | `/api/leaves/user/:userId`     | Get leaves for a specific direct report. Filter by `?status=`.                 |
| PATCH  | `/api/leaves/:leaveId/approve` | Approve a pending leave. Body: `note` (optional).                              |
| PATCH  | `/api/leaves/:leaveId/reject`  | Reject a pending leave. Body: `rejectionReason` (required), `note` (optional). |

### Admin-only (all leaves)

| Method | Route                         | Description                                            |
| ------ | ----------------------------- | ------------------------------------------------------ |
| GET    | `/api/leaves`                 | Get all leaves across all users. Filter by `?status=`. |
| PATCH  | `/api/leaves/:leaveId/cancel` | Cancel any approved leave. Body: `note` (optional).    |

**Leave types:** `casual`, `sick`, `earned`, `unpaid`

**Leave statuses:** `pending` → `approved` or `rejected`. `approved` → `cancelled` (by admin only).

---

## Reimbursements

### Employee + Manager (own reimbursements)

| Method | Route                                           | Description                                                                                                                                                                        |
| ------ | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/reimbursements/my`                        | Get own reimbursement history. Filter by `?status=`.                                                                                                                               |
| POST   | `/api/reimbursements`                           | Submit a reimbursement. Requires a manager to be assigned. Body: `multipart/form-data` with `category`, `amount`, `description` (optional), `receipts` (files, optional, up to 5). |
| PATCH  | `/api/reimbursements/:reimbursementId/receipts` | Upload more receipts to an existing pending reimbursement. Body: `multipart/form-data` with `receipts` files.                                                                      |
| DELETE | `/api/reimbursements/:reimbursementId`          | Delete own reimbursement. Only `pending` ones can be deleted.                                                                                                                      |

### Manager-only (team reimbursements)

| Method | Route                                          | Description                                                                            |
| ------ | ---------------------------------------------- | -------------------------------------------------------------------------------------- |
| GET    | `/api/reimbursements/team`                     | Get all reimbursements from direct reports. Filter by `?status=`.                      |
| GET    | `/api/reimbursements/user/:userId`             | Get reimbursements for a specific direct report. Filter by `?status=`.                 |
| PATCH  | `/api/reimbursements/:reimbursementId/approve` | Approve a pending reimbursement. Body: `note` (optional).                              |
| PATCH  | `/api/reimbursements/:reimbursementId/reject`  | Reject a pending reimbursement. Body: `rejectionReason` (required), `note` (optional). |

### Admin-only (all reimbursements)

| Method | Route                                       | Description                                                      |
| ------ | ------------------------------------------- | ---------------------------------------------------------------- |
| GET    | `/api/reimbursements`                       | Get all reimbursements across all users. Filter by `?status=`.   |
| PATCH  | `/api/reimbursements/:reimbursementId/paid` | Mark an approved reimbursement as paid. Body: `note` (optional). |

**Categories:** `travel`, `food`, `medical`, `fuel`, `other`

**Reimbursement statuses:** `pending` → `approved` or `rejected`. `approved` → `paid` (by admin). `approved` → `paid` (by manager).

**File uploads:** Accepted formats are `jpg`, `jpeg`, `png`, `pdf`. Max 5 MB per file. Up to 5 files per request. Files are stored on Cloudinary.

---

## Typical Workflows

**Onboarding a new employee:**

1. Employee registers → account is `pending`
2. Admin approves account → `PATCH /api/users/:id/approve`
3. Admin assigns a manager → `PATCH /api/users/:id/manager`
4. Employee can now submit leaves and reimbursements

**Leave request:**

1. Employee submits → `POST /api/leaves`
2. Manager reviews team queue → `GET /api/leaves/team?status=pending`
3. Manager approves or rejects → `PATCH /api/leaves/:id/approve` or `/reject`
4. If plans change after approval, admin cancels → `PATCH /api/leaves/:id/cancel`

**Reimbursement request:**

1. Employee submits with or without receipts → `POST /api/reimbursements`
2. Employee uploads receipts later if needed → `PATCH /api/reimbursements/:id/receipts`
3. Manager approves or rejects → `PATCH /api/reimbursements/:id/approve` or `/reject`
4. Admin marks as paid → `PATCH /api/reimbursements/:id/paid`
