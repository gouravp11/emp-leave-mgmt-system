import { useEffect, useRef, useState } from "react";
import { useUsers } from "../../context/UsersContext";
import PageHeader from "../../components/ui/PageHeader";
import Badge from "../../components/ui/Badge";

//  Helpers
const Avatar = ({ name, size = "sm" }) => {
    const s = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
    return (
        <div
            className={`${s} rounded-full bg-[#e8eedf] flex items-center justify-center shrink-0 font-semibold text-[#3d4f2f]`}
        >
            {name?.charAt(0).toUpperCase()}
        </div>
    );
};

//  Row action menu (kebab)
const ActionMenu = ({ user, onRoleToggle, onDelete, disabled }) => {
    const [open, setOpen] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
                setConfirming(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleDelete = () => {
        onDelete(user._id);
        setOpen(false);
        setConfirming(false);
    };

    return (
        <div ref={ref} className="relative inline-block">
            <button
                onClick={() => {
                    setOpen((p) => !p);
                    setConfirming(false);
                }}
                disabled={disabled}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-[#8fa07a] hover:text-[#2d3a22] hover:bg-[#f0f4ea] disabled:opacity-40 transition-all"
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="5" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="19" r="1.5" />
                </svg>
            </button>

            {open && (
                <div className="absolute z-20 right-0 mt-1 w-44 bg-white border border-[#cfdbbf] rounded-xl shadow-lg overflow-hidden">
                    {/* Change role */}
                    <button
                        onClick={() => {
                            onRoleToggle(user);
                            setOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-[#2d3a22] hover:bg-[#f5f7f2] transition-colors"
                    >
                        <svg
                            className="w-3.5 h-3.5 shrink-0 text-[#6b7c5a]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                            />
                        </svg>
                        {user.role === "employee" ? "Make Manager" : "Make Employee"}
                    </button>

                    <div className="border-t border-[#e8eedf]" />

                    {/* Delete */}
                    {confirming ? (
                        <div className="flex items-center gap-2 px-3.5 py-2.5">
                            <span className="text-xs text-[#6b7c5a] flex-1">Sure?</span>
                            <button
                                onClick={handleDelete}
                                className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-2.5 py-1 rounded-md transition-colors"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setConfirming(false)}
                                className="text-xs font-medium text-[#6b7c5a] bg-[#f0f4ea] hover:bg-[#e8eedf] px-2.5 py-1 rounded-md transition-colors"
                            >
                                No
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setConfirming(true)}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <svg
                                className="w-3.5 h-3.5 shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.75}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                            Delete user
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

//  Users tab
const UsersTab = () => {
    const { approvedUsers: users, loading, actionLoading, changeUserRole, removeUser } = useUsers();
    const [roleFilter, setRoleFilter] = useState("All");

    const filtered = users.filter((u) => {
        if (roleFilter === "Employee") return u.role === "employee";
        if (roleFilter === "Manager") return u.role === "manager";
        return true;
    });

    const handleRoleToggle = (user) => {
        changeUserRole(user._id, user.role === "employee" ? "manager" : "employee");
    };

    const handleDelete = (userId) => {
        removeUser(userId);
    };

    const formatDate = (d) =>
        new Date(d).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    const thClass =
        "text-left text-xs font-semibold text-[#6b7c5a] uppercase tracking-wider px-4 py-3";
    const tdClass = "px-4 py-3.5 text-sm text-[#2d3a22]";

    return (
        <>
            <div className="flex gap-1 mb-4 bg-white border border-[#cfdbbf] rounded-lg p-1 w-fit max-w-full overflow-x-auto">
                {["All", "Employee", "Manager"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setRoleFilter(f)}
                        className={[
                            "px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                            roleFilter === f
                                ? "bg-[#3d4f2f] text-white"
                                : "text-[#6b7c5a] hover:text-[#2d3a22] hover:bg-[#f0f4ea]"
                        ].join(" ")}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden flex flex-col gap-2">
                {loading ? (
                    <div className="bg-white border border-[#cfdbbf] rounded-xl flex items-center justify-center py-14 text-sm text-[#6b7c5a]">
                        Loading users
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white border border-[#cfdbbf] rounded-xl flex items-center justify-center py-14 text-sm text-[#8fa07a]">
                        No users found.
                    </div>
                ) : (
                    filtered.map((user) => (
                        <div
                            key={user._id}
                            className="bg-white border border-[#cfdbbf] rounded-xl px-4 py-3.5 flex items-center gap-3"
                        >
                            <Avatar name={user.name} size="md" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <p className="text-sm font-semibold text-[#2d3a22] truncate">
                                        {user.name}
                                    </p>
                                    <Badge status={user.role} />
                                </div>
                                <p className="text-xs text-[#8fa07a] truncate">{user.email}</p>
                                <p className="text-xs text-[#a8b89a] mt-0.5">
                                    Joined {formatDate(user.createdAt)}
                                </p>
                            </div>
                            <ActionMenu
                                user={user}
                                onRoleToggle={handleRoleToggle}
                                onDelete={handleDelete}
                                disabled={actionLoading === user._id}
                            />
                        </div>
                    ))
                )}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block bg-white border border-[#cfdbbf] rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16 text-sm text-[#6b7c5a]">
                        Loading users
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex items-center justify-center py-16 text-sm text-[#8fa07a]">
                        No users found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#f5f7f2] border-b border-[#cfdbbf]">
                                <tr>
                                    <th className={thClass}>Name</th>
                                    <th className={thClass}>Email</th>
                                    <th className={thClass}>Role</th>
                                    <th className={thClass}>Joined</th>
                                    <th className="px-4 py-3 w-12" />
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((user) => (
                                    <tr
                                        key={user._id}
                                        className="border-b border-[#e8eedf] last:border-0 hover:bg-[#fafcf7] transition-colors"
                                    >
                                        <td className={tdClass}>
                                            <div className="flex items-center gap-2.5">
                                                <Avatar name={user.name} />
                                                <span className="font-medium">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className={`${tdClass} text-[#6b7c5a]`}>
                                            {user.email}
                                        </td>
                                        <td className={tdClass}>
                                            <Badge status={user.role} />
                                        </td>
                                        <td className={`${tdClass} text-[#6b7c5a]`}>
                                            {formatDate(user.createdAt)}
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <ActionMenu
                                                user={user}
                                                onRoleToggle={handleRoleToggle}
                                                onDelete={handleDelete}
                                                disabled={actionLoading === user._id}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

//  Manage Team Modal
const ManageTeamModal = ({ manager, allUsers, onAssign, onUnassign, actionLoading, onClose }) => {
    const [search, setSearch] = useState("");

    const team = allUsers.filter((u) => u.managerId === manager._id);
    const candidates = allUsers.filter(
        (u) =>
            u._id !== manager._id &&
            u.managerId !== manager._id &&
            u.name.toLowerCase().includes(search.toLowerCase())
    );

    // Lock body scroll while open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
                {/* Modal header – manager info */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8eedf] shrink-0">
                    <div className="flex items-center gap-3">
                        <Avatar name={manager.name} size="md" />
                        <div>
                            <p className="text-sm font-semibold text-[#2d3a22]">{manager.name}</p>
                            <p className="text-xs text-[#8fa07a]">{manager.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center w-8 h-8 rounded-lg text-[#8fa07a] hover:text-[#2d3a22] hover:bg-[#f0f4ea] transition-all"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col gap-0 overflow-hidden flex-1">
                    {/* Current team members */}
                    <div className="px-5 pt-4 pb-2 shrink-0">
                        <p className="text-xs font-semibold text-[#6b7c5a] uppercase tracking-wider mb-2">
                            Team members · {team.length}
                        </p>
                    </div>
                    <div className="overflow-y-auto px-5 shrink-0" style={{ maxHeight: "200px" }}>
                        {team.length === 0 ? (
                            <p className="text-xs text-[#8fa07a] py-3">No members yet.</p>
                        ) : (
                            <div className="flex flex-col gap-1">
                                {team.map((member) => (
                                    <div
                                        key={member._id}
                                        className="flex items-center gap-3 px-3 py-2.5 bg-[#f5f7f2] rounded-lg"
                                    >
                                        <Avatar name={member.name} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-[#2d3a22] truncate">
                                                {member.name}
                                            </p>
                                            <p className="text-xs text-[#8fa07a] truncate">
                                                {member.email}
                                            </p>
                                        </div>
                                        <Badge status={member.role} />
                                        <button
                                            onClick={() => onUnassign(member._id)}
                                            disabled={actionLoading === member._id}
                                            title="Remove from team"
                                            className="flex items-center justify-center w-7 h-7 rounded-lg text-[#8fa07a] hover:text-red-500 hover:bg-red-50 disabled:opacity-40 transition-all shrink-0"
                                        >
                                            <svg
                                                className="w-3.5 h-3.5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="mx-5 my-3 border-t border-[#e8eedf] shrink-0" />

                    {/* Add members section */}
                    <div className="px-5 shrink-0">
                        <p className="text-xs font-semibold text-[#6b7c5a] uppercase tracking-wider mb-2">
                            Add members
                        </p>
                        <div className="flex items-center gap-2 bg-[#f5f7f2] border border-[#e8eedf] rounded-lg px-3 py-2 mb-2">
                            <svg
                                className="w-3.5 h-3.5 text-[#8fa07a] shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z"
                                />
                            </svg>
                            <input
                                autoFocus
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name…"
                                className="flex-1 text-sm text-[#2d3a22] placeholder-[#a8b89a] bg-transparent outline-none"
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1 px-5 pb-4">
                        {candidates.length === 0 ? (
                            <p className="text-xs text-[#8fa07a] py-3">
                                No users available to add.
                            </p>
                        ) : (
                            <div className="flex flex-col gap-1">
                                {candidates.map((u) => (
                                    <div
                                        key={u._id}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                                    >
                                        <Avatar name={u.name} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-[#2d3a22] truncate">
                                                {u.name}
                                            </p>
                                            <p className="text-xs text-[#8fa07a] truncate">
                                                {u.email}
                                            </p>
                                        </div>
                                        <Badge status={u.role} />
                                        <button
                                            onClick={() => onAssign(u._id, manager._id)}
                                            disabled={actionLoading === u._id}
                                            title="Add to team"
                                            className="flex items-center justify-center w-6 h-6 rounded-full bg-[#e8eedf] hover:bg-[#3d4f2f] text-[#3d4f2f] hover:text-white disabled:opacity-50 transition-colors shrink-0"
                                        >
                                            <svg
                                                className="w-3 h-3"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2.5}
                                                    d="M12 4v16m8-8H4"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

//  Teams tab
const TeamsTab = () => {
    const { approvedUsers: users, loading, actionLoading, assignUserManager } = useUsers();
    const [modalManager, setModalManager] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    const managers = users.filter((u) => u.role === "manager");
    const getTeam = (managerId) => users.filter((u) => u.managerId === managerId);

    const handleAssign = (userId, managerId) => assignUserManager(userId, managerId);
    const handleUnassign = (userId) => assignUserManager(userId, null);

    // Keep modal's view of users in sync after mutations
    const modalManagerSync = modalManager
        ? (users.find((u) => u._id === modalManager._id) ?? modalManager)
        : null;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16 text-sm text-[#6b7c5a]">
                Loading teams
            </div>
        );
    }

    if (managers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
                <svg
                    className="w-8 h-8 text-[#cfdbbf]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 20H7m10 0a3 3 0 003-3v-1a3 3 0 00-3-3H7a3 3 0 00-3 3v1a3 3 0 003 3m10 0H7M9 7a3 3 0 106 0A3 3 0 009 7z"
                    />
                </svg>
                <p className="text-sm text-[#8fa07a]">
                    No managers yet. Promote an employee to manager first.
                </p>
            </div>
        );
    }

    return (
        <>
            {modalManagerSync && (
                <ManageTeamModal
                    manager={modalManagerSync}
                    allUsers={users}
                    onAssign={handleAssign}
                    onUnassign={handleUnassign}
                    actionLoading={actionLoading}
                    onClose={() => setModalManager(null)}
                />
            )}

            <div className="flex flex-col gap-3">
                {managers.map((manager) => {
                    const team = getTeam(manager._id);
                    const expanded = expandedId === manager._id;
                    return (
                        <div
                            key={manager._id}
                            className="bg-white border border-[#cfdbbf] rounded-xl overflow-hidden"
                        >
                            {/* Manager header */}
                            <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-3.5 sm:py-4 bg-[#fafcf7]">
                                {/* Left: clickable area to expand */}
                                <button
                                    type="button"
                                    onClick={() => setExpandedId(expanded ? null : manager._id)}
                                    className="flex items-center gap-2.5 sm:gap-3 flex-1 text-left min-w-0"
                                >
                                    <Avatar name={manager.name} size="md" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-[#2d3a22] truncate">
                                            {manager.name}
                                        </p>
                                        <p className="text-xs text-[#8fa07a] truncate hidden sm:block">
                                            {manager.email}
                                        </p>
                                    </div>
                                </button>
                                {/* Right: controls */}
                                <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-2 sm:ml-3">
                                    <span className="text-xs text-[#6b7c5a] hidden sm:inline">
                                        {team.length} {team.length === 1 ? "member" : "members"}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setModalManager(manager)}
                                        className="text-xs font-medium text-[#3d4f2f] bg-[#e8eedf] hover:bg-[#d4dfc7] px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                                    >
                                        Manage
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setExpandedId(expanded ? null : manager._id)}
                                        className="flex items-center justify-center w-7 h-7 rounded-lg text-[#8fa07a] hover:bg-[#f0f4ea] transition-colors"
                                    >
                                        <svg
                                            className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Team members – collapsible */}
                            {expanded && (
                                <div className="border-t border-[#e8eedf]">
                                    {team.length === 0 ? (
                                        <p className="text-xs text-[#8fa07a] text-center py-4">
                                            No members assigned yet.
                                        </p>
                                    ) : (
                                        <div className="divide-y divide-[#e8eedf]">
                                            {team.map((member) => (
                                                <div
                                                    key={member._id}
                                                    className="flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-2.5"
                                                >
                                                    <Avatar name={member.name} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-[#2d3a22] truncate">
                                                            {member.name}
                                                        </p>
                                                        <p className="text-xs text-[#8fa07a] truncate hidden sm:block">
                                                            {member.email}
                                                        </p>
                                                    </div>
                                                    <Badge status={member.role} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

//  Main page
const UsersPage = () => {
    const { error } = useUsers();
    const [mainTab, setMainTab] = useState("Users");

    return (
        <div>
            <PageHeader title="Manage Users" subtitle="Roles, permissions, and team assignments." />

            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Main tabs */}
            <div className="flex gap-1 mb-5 bg-white border border-[#cfdbbf] rounded-lg p-1 w-fit max-w-full overflow-x-auto">
                {["Users", "Teams"].map((t) => (
                    <button
                        key={t}
                        onClick={() => setMainTab(t)}
                        className={[
                            "px-4 sm:px-5 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                            mainTab === t
                                ? "bg-[#3d4f2f] text-white"
                                : "text-[#6b7c5a] hover:text-[#2d3a22] hover:bg-[#f0f4ea]"
                        ].join(" ")}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {mainTab === "Users" ? <UsersTab /> : <TeamsTab />}
        </div>
    );
};

export default UsersPage;
