import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Reusable dashboard shell.
 *
 * Props:
 *  - navItems  {Array}  — [{ label, icon: JSX, to, end? }]
 *                         `end` should be true for the root dashboard route to
 *                         prevent it matching all nested paths.
 */
const DashboardLayout = ({ navItems = [] }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const initials = user?.name
        ? user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
        : "?";

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-5 h-16 flex items-center border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-[#d4dfc7] rounded-md flex items-center justify-center shrink-0">
                        <span className="text-[#2d3a22] font-bold text-xs">EL</span>
                    </div>
                    <span className="font-semibold text-white text-base tracking-tight">
                        LeaveSync
                    </span>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                            [
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-[#3d4f2f] text-white"
                                    : "text-white/60 hover:text-white hover:bg-white/8"
                            ].join(" ")
                        }
                    >
                        <span className="w-5 h-5 shrink-0 flex items-center justify-center">
                            {item.icon}
                        </span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* User + logout */}
            <div className="px-3 py-4 border-t border-white/10 shrink-0">
                <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
                    <div className="w-7 h-7 rounded-full bg-[#d4dfc7] flex items-center justify-center shrink-0">
                        <span className="text-[#2d3a22] text-xs font-semibold">{initials}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm text-white font-medium truncate">{user?.name}</p>
                        <p className="text-xs text-white/50 capitalize">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/8 transition-colors"
                >
                    <svg
                        className="w-5 h-5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.75}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                        />
                    </svg>
                    Log out
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#f5f7f2] overflow-hidden">
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex flex-col w-60 bg-[#2d3a22] shrink-0">
                <SidebarContent />
            </aside>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 flex lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/40"
                        onClick={() => setSidebarOpen(false)}
                    />
                    {/* Drawer */}
                    <aside className="relative z-50 flex flex-col w-60 bg-[#2d3a22]">
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-[#cfdbbf] flex items-center px-6 gap-4 shrink-0">
                    {/* Hamburger (mobile) */}
                    <button
                        className="lg:hidden p-1.5 rounded-md text-[#6b7c5a] hover:bg-[#e8eedf] transition-colors"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open menu"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>

                    <div className="flex-1" />

                    {/* User chip */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#e8eedf] border border-[#cfdbbf] flex items-center justify-center">
                            <span className="text-[#3d4f2f] text-xs font-semibold">{initials}</span>
                        </div>
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-medium text-[#2d3a22] leading-none">
                                {user?.name}
                            </p>
                            <p className="text-xs text-[#8fa07a] capitalize mt-0.5">{user?.role}</p>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
