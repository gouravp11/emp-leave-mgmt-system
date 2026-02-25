import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { MyLeavesProvider } from "../../context/MyLeavesContext";
import { MyReimbursementsProvider } from "../../context/MyReimbursementsContext";
import EmployeeOverview from "./EmployeeOverview";
import MyLeavesPage from "./MyLeavesPage";
import MyReimbursementsPage from "./MyReimbursementsPage";

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

// ── Nav items ────────────────────────────────────────────────────────────────
const employeeNavItems = [
    { label: "Overview", icon: <HomeIcon />, to: "/employee-dashboard", end: true },
    { label: "My Leaves", icon: <CalendarIcon />, to: "/employee-dashboard/leaves" },
    { label: "My Reimbursements", icon: <ReceiptIcon />, to: "/employee-dashboard/reimbursements" }
];

// ── Component ────────────────────────────────────────────────────────────────
const EmployeeDashboard = () => (
    <MyLeavesProvider>
        <MyReimbursementsProvider>
            <Routes>
                <Route element={<DashboardLayout navItems={employeeNavItems} />}>
                    <Route index element={<EmployeeOverview />} />
                    <Route path="leaves" element={<MyLeavesPage />} />
                    <Route path="reimbursements" element={<MyReimbursementsPage />} />
                    <Route path="*" element={<Navigate to="/employee-dashboard" replace />} />
                </Route>
            </Routes>
        </MyReimbursementsProvider>
    </MyLeavesProvider>
);

export default EmployeeDashboard;
