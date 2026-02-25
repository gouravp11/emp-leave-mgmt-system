import { Link } from "react-router-dom";
import { useUsers } from "../../context/UsersContext";
import { useLeaves } from "../../context/LeavesContext";
import { useReimbursements } from "../../context/ReimbursementsContext";
import StatCard from "../../components/ui/StatCard";
import PageHeader from "../../components/ui/PageHeader";
import Badge from "../../components/ui/Badge";

const UsersIcon = () => (
    <svg className="w-5 h-5 text-[#3d4f2f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
        />
    </svg>
);
const ClockIcon = () => (
    <svg className="w-5 h-5 text-[#b45309]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M12 8v4l3 3M12 2a10 10 0 100 20A10 10 0 0012 2z"
        />
    </svg>
);
const CalendarIcon = () => (
    <svg className="w-5 h-5 text-[#1d4ed8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
    </svg>
);
const ReceiptIcon = () => (
    <svg className="w-5 h-5 text-[#7c3aed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M9 14H7a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2h-2m-4 6l-3-3m0 0l3-3m-3 3h12"
        />
    </svg>
);

const AdminOverview = () => {
    const {
        users,
        pendingUsers,
        loading: usersLoading,
        actionLoading,
        error,
        approveUser,
        rejectUser
    } = useUsers();
    const { leaves, loading: leavesLoading } = useLeaves();
    const { reimbursements, loading: reimbLoading } = useReimbursements();

    const loading = usersLoading || leavesLoading || reimbLoading;

    const stats = !loading
        ? {
              totalUsers: users.length,
              pendingApprovals: pendingUsers.length,
              activeLeaves: leaves.filter((l) => l.status === "approved").length,
              pendingLeaves: leaves.filter((l) => l.status === "pending").length,
              pendingReimbursements: reimbursements.filter((r) => r.status === "pending").length,
              pendingPayments: reimbursements.filter((r) => r.status === "approved").length
          }
        : null;

    const cards = stats
        ? [
              {
                  title: "Total Users",
                  value: stats.totalUsers,
                  subtitle: `${stats.pendingApprovals} awaiting approval`,
                  icon: <UsersIcon />,
                  accent: "#e8eedf",
                  to: "/dashboard/users"
              },
              {
                  title: "Pending Approvals",
                  value: stats.pendingApprovals,
                  subtitle: "New registrations",
                  icon: <ClockIcon />,
                  accent: "#fef3c7",
                  to: "/dashboard/users"
              },
              {
                  title: "Active Leaves",
                  value: stats.activeLeaves,
                  subtitle: `${stats.pendingLeaves} pending review`,
                  icon: <CalendarIcon />,
                  accent: "#dbeafe",
                  to: "/dashboard/leaves"
              },
              {
                  title: "Pending Reimbursements",
                  value: stats.pendingReimbursements,
                  subtitle: `${stats.pendingPayments} approved, awaiting payment`,
                  icon: <ReceiptIcon />,
                  accent: "#ede9fe",
                  to: "/dashboard/reimbursements"
              }
          ]
        : [];

    return (
        <div>
            <PageHeader
                title="Overview"
                subtitle="A summary of activity across your organisation."
            />

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white border border-[#cfdbbf] rounded-xl h-24 animate-pulse"
                        />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {cards.map((card) => (
                        <Link key={card.title} to={card.to} className="block">
                            <StatCard
                                title={card.title}
                                value={card.value}
                                subtitle={card.subtitle}
                                icon={card.icon}
                                accent={card.accent}
                            />
                        </Link>
                    ))}
                </div>
            )}

            {/* Pending Accounts */}
            <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-semibold text-[#2d3a22]">
                        Pending Accounts
                        {!loading && pendingUsers.length > 0 && (
                            <span className="ml-2 text-xs font-medium bg-[#fef3c7] text-[#854d0e] px-2 py-0.5 rounded-full">
                                {pendingUsers.length}
                            </span>
                        )}
                    </h2>
                </div>

                {error && (
                    <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="bg-white border border-[#cfdbbf] rounded-xl overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-10 text-sm text-[#6b7c5a]">
                            Loading…
                        </div>
                    ) : pendingUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-2">
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
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <p className="text-sm text-[#8fa07a]">
                                No pending accounts — you're all caught up.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#e8eedf]">
                            {pendingUsers.map((user) => {
                                const isLoading = actionLoading === user._id;
                                return (
                                    <div
                                        key={user._id}
                                        className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4"
                                    >
                                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#e8eedf] flex items-center justify-center shrink-0">
                                            <span className="text-sm font-semibold text-[#3d4f2f]">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <p className="text-sm font-medium text-[#2d3a22] truncate">
                                                    {user.name}
                                                </p>
                                                <Badge status={user.role} />
                                            </div>
                                            <p className="text-xs text-[#6b7c5a] truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                                            <button
                                                onClick={() => approveUser(user._id)}
                                                disabled={isLoading}
                                                className="text-xs font-medium text-white bg-[#3d4f2f] hover:bg-[#2d3a22] px-2.5 sm:px-3 py-1.5 rounded-md disabled:opacity-50 transition-colors"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => rejectUser(user._id)}
                                                disabled={isLoading}
                                                className="text-xs font-medium text-red-600 hover:bg-red-50 px-2.5 sm:px-3 py-1.5 rounded-md disabled:opacity-50 transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
