import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { TeamLeavesProvider } from "../../context/TeamLeavesContext";
import { TeamReimbursementsProvider } from "../../context/TeamReimbursementsContext";
import { MyLeavesProvider } from "../../context/MyLeavesContext";
import { MyReimbursementsProvider } from "../../context/MyReimbursementsContext";
import ManagerOverview from "./ManagerOverview";
import MyTeamPage from "./MyTeamPage";
import TeamLeavesPage from "./TeamLeavesPage";
import TeamReimbursementsPage from "./TeamReimbursementsPage";
import MyLeavesPage from "../employee/MyLeavesPage";
import MyReimbursementsPage from "../employee/MyReimbursementsPage";

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

const TeamIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M17 20H7m10 0a3 3 0 003-3v-1a3 3 0 00-3-3H7a3 3 0 00-3 3v1a3 3 0 003 3m10 0H7M9 7a3 3 0 106 0A3 3 0 009 7z"
        />
    </svg>
);

const PeopleIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
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

// ── Nav items ─────────────────────────────────────────────────────────────────
const managerNavItems = [
    { label: "Overview", icon: <HomeIcon />, to: "/manager-dashboard", end: true },
    { label: "My Team", icon: <PeopleIcon />, to: "/manager-dashboard/my-team" },
    { label: "Team Leaves", icon: <TeamIcon />, to: "/manager-dashboard/team-leaves" },
    {
        label: "Team Reimbursements",
        icon: <ReceiptIcon />,
        to: "/manager-dashboard/team-reimbursements"
    },
    { label: "My Leaves", icon: <CalendarIcon />, to: "/manager-dashboard/my-leaves" },
    {
        label: "My Reimbursements",
        icon: <ReceiptIcon />,
        to: "/manager-dashboard/my-reimbursements"
    }
];

// ── Component ─────────────────────────────────────────────────────────────────
const ManagerDashboard = () => (
    <TeamLeavesProvider>
        <TeamReimbursementsProvider>
            <MyLeavesProvider>
                <MyReimbursementsProvider>
                    <Routes>
                        <Route element={<DashboardLayout navItems={managerNavItems} />}>
                            <Route index element={<ManagerOverview />} />
                            <Route path="my-team" element={<MyTeamPage />} />
                            <Route path="team-leaves" element={<TeamLeavesPage />} />
                            <Route
                                path="team-reimbursements"
                                element={<TeamReimbursementsPage />}
                            />
                            <Route path="my-leaves" element={<MyLeavesPage />} />
                            <Route path="my-reimbursements" element={<MyReimbursementsPage />} />
                            <Route
                                path="*"
                                element={<Navigate to="/manager-dashboard" replace />}
                            />
                        </Route>
                    </Routes>
                </MyReimbursementsProvider>
            </MyLeavesProvider>
        </TeamReimbursementsProvider>
    </TeamLeavesProvider>
);

export default ManagerDashboard;
