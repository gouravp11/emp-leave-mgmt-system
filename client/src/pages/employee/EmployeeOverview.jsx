import { Link } from "react-router-dom";
import { useMyLeaves } from "../../context/MyLeavesContext";
import { useMyReimbursements } from "../../context/MyReimbursementsContext";
import Badge from "../../components/ui/Badge";
import PageHeader from "../../components/ui/PageHeader";

// ── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, loading, accent = false }) => (
    <div
        className={`rounded-xl border p-5 flex items-start gap-4 ${
            accent ? "bg-[#2d3a22] border-[#2d3a22]" : "bg-white border-[#cfdbbf]"
        }`}
    >
        <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                accent ? "bg-white/10 text-white" : "bg-[#e8eedf] text-[#3d4f2f]"
            }`}
        >
            {icon}
        </div>
        <div>
            <p
                className={`text-xs font-medium mb-1 ${accent ? "text-white/60" : "text-[#6b7c5a]"}`}
            >
                {label}
            </p>
            {loading ? (
                <div
                    className={`h-7 w-10 rounded animate-pulse ${accent ? "bg-white/20" : "bg-[#e8eedf]"}`}
                />
            ) : (
                <p className={`text-2xl font-bold ${accent ? "text-white" : "text-[#2d3a22]"}`}>
                    {value}
                </p>
            )}
        </div>
    </div>
);

// ── Recent list ───────────────────────────────────────────────────────────────
const RecentLeaves = ({ leaves, loading }) => {
    const fmt = (d) =>
        new Date(d).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });

    return (
        <div className="bg-white border border-[#cfdbbf] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8eedf]">
                <h3 className="text-sm font-semibold text-[#2d3a22]">Recent Leaves</h3>
                <Link
                    to="/employee-dashboard/leaves"
                    className="text-xs text-[#6b7c5a] hover:text-[#2d3a22] font-medium transition-colors"
                >
                    View all →
                </Link>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12 text-sm text-[#6b7c5a]">
                    Loading…
                </div>
            ) : leaves.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <p className="text-sm text-[#8fa07a]">No leave requests yet.</p>
                </div>
            ) : (
                <div className="divide-y divide-[#e8eedf]">
                    {leaves.slice(0, 5).map((l) => (
                        <div key={l._id} className="flex items-center gap-3 px-5 py-3.5">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#2d3a22] capitalize">
                                    {l.leaveType} Leave
                                </p>
                                <p className="text-xs text-[#8fa07a] mt-0.5">
                                    {fmt(l.startDate)} → {fmt(l.endDate)} · {l.totalDays}{" "}
                                    {l.totalDays === 1 ? "day" : "days"}
                                </p>
                            </div>
                            <Badge status={l.status} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const RecentReimbursements = ({ reimbursements, loading }) => {
    const fmt = (d) =>
        new Date(d).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });

    return (
        <div className="bg-white border border-[#cfdbbf] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8eedf]">
                <h3 className="text-sm font-semibold text-[#2d3a22]">Recent Reimbursements</h3>
                <Link
                    to="/employee-dashboard/reimbursements"
                    className="text-xs text-[#6b7c5a] hover:text-[#2d3a22] font-medium transition-colors"
                >
                    View all →
                </Link>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12 text-sm text-[#6b7c5a]">
                    Loading…
                </div>
            ) : reimbursements.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
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
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                    <p className="text-sm text-[#8fa07a]">No reimbursements yet.</p>
                </div>
            ) : (
                <div className="divide-y divide-[#e8eedf]">
                    {reimbursements.slice(0, 5).map((r) => (
                        <div key={r._id} className="flex items-center gap-3 px-5 py-3.5">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#2d3a22] capitalize">
                                    {r.category}
                                </p>
                                <p className="text-xs text-[#8fa07a] mt-0.5">
                                    ${r.amount.toFixed(2)} · {fmt(r.createdAt)}
                                </p>
                            </div>
                            <Badge status={r.status} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ── Page ─────────────────────────────────────────────────────────────────────
const EmployeeOverview = () => {
    const { leaves, loading: leavesLoading } = useMyLeaves();
    const { reimbursements, loading: reimbLoading } = useMyReimbursements();

    const loading = leavesLoading || reimbLoading;

    const pendingLeaves = leaves.filter((l) => l.status === "pending").length;
    const approvedLeaves = leaves.filter((l) => l.status === "approved").length;
    const pendingReimb = reimbursements.filter((r) => r.status === "pending").length;
    const pendingAmount = reimbursements
        .filter((r) => r.status === "pending")
        .reduce((sum, r) => sum + r.amount, 0);

    return (
        <div>
            <PageHeader
                title="My Dashboard"
                subtitle="Track your leaves and reimbursement requests."
            />

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Total Leaves"
                    value={leaves.length}
                    loading={loading}
                    icon={
                        <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.75}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    }
                />
                <StatCard
                    label="Pending Leaves"
                    value={pendingLeaves}
                    loading={loading}
                    accent
                    icon={
                        <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.75}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    }
                />
                <StatCard
                    label="Approved Leaves"
                    value={approvedLeaves}
                    loading={loading}
                    icon={
                        <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.75}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    }
                />
                <StatCard
                    label="Pending Reimbursements"
                    value={pendingReimb}
                    loading={loading}
                    icon={
                        <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.75}
                                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                    }
                />
            </div>

            {/* Pending reimbursement amount banner */}
            {!loading && pendingAmount > 0 && (
                <div className="mb-6 bg-[#fef9c3] border border-[#fde68a] rounded-xl px-5 py-3.5 flex items-center gap-3">
                    <svg
                        className="w-5 h-5 text-[#854d0e] shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.75}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                    <p className="text-sm text-[#854d0e]">
                        You have <span className="font-semibold">${pendingAmount.toFixed(2)}</span>{" "}
                        in pending reimbursements awaiting review.
                    </p>
                </div>
            )}

            {/* Recent activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <RecentLeaves leaves={leaves} loading={leavesLoading} />
                <RecentReimbursements reimbursements={reimbursements} loading={reimbLoading} />
            </div>
        </div>
    );
};

export default EmployeeOverview;
