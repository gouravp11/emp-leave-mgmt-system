import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { UsersProvider } from "../../context/UsersContext";
import { LeavesProvider } from "../../context/LeavesContext";
import { ReimbursementsProvider } from "../../context/ReimbursementsContext";
import AdminOverview from "./AdminOverview";
import UsersPage from "./UsersPage";
import LeavesPage from "./LeavesPage";
import ReimbursementsPage from "./ReimbursementsPage";

// ── Icons ────────────────────────────────────────────────────────────────────
const HomeIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"
        />
    </svg>
);
const UsersIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M17 20H7m10 0a3 3 0 003-3v-1a3 3 0 00-3-3H7a3 3 0 00-3 3v1a3 3 0 003 3m10 0H7M9 7a3 3 0 106 0A3 3 0 009 7z"
        />
    </svg>
);
const CalendarIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
    </svg>
);
const ReceiptIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
    </svg>
);

// ── Nav items for admin ──────────────────────────────────────────────────────
const adminNavItems = [
    { label: "Overview", icon: <HomeIcon />, to: "/dashboard", end: true },
    { label: "Manage Users", icon: <UsersIcon />, to: "/dashboard/users" },
    { label: "Leaves", icon: <CalendarIcon />, to: "/dashboard/leaves" },
    { label: "Reimbursements", icon: <ReceiptIcon />, to: "/dashboard/reimbursements" }
];

// ── AdminDashboard ────────────────────────────────────────────────────────────
const AdminDashboard = () => {
    return (
        <UsersProvider>
            <LeavesProvider>
                <ReimbursementsProvider>
                    <Routes>
                        <Route element={<DashboardLayout navItems={adminNavItems} />}>
                            <Route index element={<AdminOverview />} />
                            <Route path="users" element={<UsersPage />} />
                            <Route path="leaves" element={<LeavesPage />} />
                            <Route path="reimbursements" element={<ReimbursementsPage />} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Route>
                    </Routes>
                </ReimbursementsProvider>
            </LeavesProvider>
        </UsersProvider>
    );
};

export default AdminDashboard;
