import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

// ── Sun / Moon icons ─────────────────────────────────────────────────────────
const SunIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-6.07-.71.71M6.34 17.66l-.71.71m12.73 0-.71-.71M6.34 6.34l-.71-.71M12 7a5 5 0 100 10A5 5 0 0012 7z"
        />
    </svg>
);

const MoonIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        />
    </svg>
);

const formatDate = (iso) => {
    if (!iso) return null;
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
};

const RoleBadge = ({ role }) => {
    const styles = {
        admin: "bg-[#2d3a22] text-white",
        manager: "bg-[#3d4f2f] text-white",
        employee: "bg-[#e8eedf] text-[#3d4f2f]"
    };
    return (
        <span
            className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                styles[role] ?? "bg-[#e8eedf] text-[#3d4f2f]"
            }`}
        >
            {role}
        </span>
    );
};

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
    const { dark, toggle: toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        if (!profileOpen) return;
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [profileOpen]);

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

                    {/* Dark-mode toggle */}
                    <button
                        onClick={toggleTheme}
                        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                        className="p-2 rounded-lg text-[#6b7c5a] hover:bg-[#e8eedf] transition-colors shrink-0"
                    >
                        {dark ? <SunIcon /> : <MoonIcon />}
                    </button>

                    {/* User chip – clickable profile */}
                    <div ref={profileRef} className="relative">
                        <button
                            onClick={() => setProfileOpen((v) => !v)}
                            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-[#f0f4ea] transition-colors"
                            aria-label="View profile"
                        >
                            <div className="w-8 h-8 rounded-full bg-[#e8eedf] border border-[#cfdbbf] flex items-center justify-center shrink-0">
                                <span className="text-[#3d4f2f] text-xs font-semibold">
                                    {initials}
                                </span>
                            </div>
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-[#2d3a22] leading-none">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-[#8fa07a] capitalize mt-0.5">
                                    {user?.role}
                                </p>
                            </div>
                            {/* chevron */}
                            <svg
                                className={`w-3.5 h-3.5 text-[#8fa07a] transition-transform shrink-0 ${
                                    profileOpen ? "rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {/* Profile dropdown */}
                        {profileOpen && (
                            <div className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl border border-[#cfdbbf] z-50 overflow-hidden">
                                {/* Header */}
                                <div className="flex items-center gap-3 px-4 py-4 bg-[#f5f7f2] border-b border-[#e8eedf]">
                                    <div className="w-11 h-11 rounded-full bg-[#3d4f2f] flex items-center justify-center shrink-0">
                                        <span className="text-white text-sm font-bold">
                                            {initials}
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-[#2d3a22] truncate">
                                            {user?.name}
                                        </p>
                                        <RoleBadge role={user?.role} />
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="px-4 py-3 flex flex-col gap-2.5">
                                    {/* Email */}
                                    <div className="flex items-start gap-2.5">
                                        <svg
                                            className="w-4 h-4 text-[#8fa07a] mt-0.5 shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.75}
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span className="text-sm text-[#2d3a22] break-all">
                                            {user?.email}
                                        </span>
                                    </div>

                                    {/* Joined date */}
                                    {user?.createdAt && (
                                        <div className="flex items-center gap-2.5">
                                            <svg
                                                className="w-4 h-4 text-[#8fa07a] shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.75}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            <span className="text-sm text-[#6b7c5a]">
                                                Joined {formatDate(user.createdAt)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Department */}
                                    {user?.department && (
                                        <div className="flex items-center gap-2.5">
                                            <svg
                                                className="w-4 h-4 text-[#8fa07a] shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.75}
                                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                />
                                            </svg>
                                            <span className="text-sm text-[#6b7c5a]">
                                                {user.department}
                                            </span>
                                        </div>
                                    )}

                                    {/* Manager (employee only) */}
                                    {user?.role === "employee" && user?.manager && (
                                        <div className="flex items-start gap-2.5">
                                            <svg
                                                className="w-4 h-4 text-[#8fa07a] mt-0.5 shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.75}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                            <div>
                                                <p className="text-xs text-[#8fa07a] mb-0.5">
                                                    Reports to
                                                </p>
                                                <p className="text-sm text-[#2d3a22] font-medium">
                                                    {user.manager.name}
                                                </p>
                                                <p className="text-xs text-[#8fa07a]">
                                                    {user.manager.email}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
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
