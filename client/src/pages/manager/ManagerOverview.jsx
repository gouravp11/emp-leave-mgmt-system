import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTeamLeaves } from "../../context/TeamLeavesContext";
import { useTeamReimbursements } from "../../context/TeamReimbursementsContext";
import { getMyTeam } from "../../api/user.api";
import PageHeader from "../../components/ui/PageHeader";
import Badge from "../../components/ui/Badge";

const fmt = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, loading, icon, accent = false }) => (
    <div
        className={`rounded-xl border p-4 flex items-center gap-4 ${accent ? "bg-[#3d4f2f] border-[#3d4f2f]" : "bg-white border-[#cfdbbf]"}`}
    >
        <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${accent ? "bg-white/15 text-white" : "bg-[#e8eedf] text-[#3d4f2f]"}`}
        >
            {icon}
        </div>
        <div>
            <p className={`text-xs font-medium ${accent ? "text-white/70" : "text-[#6b7c5a]"}`}>
                {label}
            </p>
            {loading ? (
                <div className="h-6 w-10 bg-[#cfdbbf] rounded animate-pulse mt-1" />
            ) : (
                <p
                    className={`text-2xl font-bold leading-tight ${accent ? "text-white" : "text-[#2d3a22]"}`}
                >
                    {value}
                </p>
            )}
        </div>
    </div>
);

// ── Recent pending leaves ─────────────────────────────────────────────────────
const PendingLeavesList = ({
    leaves,
    loading,
    approveTeamLeave,
    rejectTeamLeave,
    actionLoading
}) => {
    const [rejectingId, setRejectingId] = useState(null);
    const [reason, setReason] = useState("");
    const [reasonError, setReasonError] = useState("");

    const pending = leaves.filter((l) => l.status === "pending").slice(0, 5);

    const handleReject = async (id) => {
        if (!reason.trim()) return setReasonError("Reason is required.");
        try {
            await rejectTeamLeave(id, reason.trim());
            setRejectingId(null);
            setReason("");
        } catch {
            /* error handled in context */
        }
    };

    return (
        <div className="bg-white border border-[#cfdbbf] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8eedf]">
                <h3 className="text-sm font-semibold text-[#2d3a22]">Pending Team Leaves</h3>
                <Link
                    to="/manager-dashboard/team-leaves"
                    className="text-xs text-[#6b7c5a] hover:text-[#2d3a22] font-medium transition-colors"
                >
                    View all →
                </Link>
            </div>
            {loading ? (
                <div className="flex items-center justify-center py-10 text-sm text-[#6b7c5a]">
                    Loading…
                </div>
            ) : pending.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <svg
                        className="w-7 h-7 text-[#cfdbbf]"
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
                    <p className="text-sm text-[#8fa07a]">No pending leaves.</p>
                </div>
            ) : (
                <ul className="divide-y divide-[#e8eedf]">
                    {pending.map((l) => {
                        const isAction = actionLoading === l._id;
                        const isRejecting = rejectingId === l._id;
                        return (
                            <li key={l._id} className="px-5 py-3.5">
                                <div className="flex items-start justify-between gap-3 mb-1.5">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-[#2d3a22] capitalize">
                                            {l.requesterId?.name}
                                        </p>
                                        <p className="text-xs text-[#6b7c5a]">
                                            {l.leaveType} · {fmt(l.startDate)} – {fmt(l.endDate)} ·{" "}
                                            {l.totalDays}d
                                        </p>
                                    </div>
                                    <Badge status={l.status} />
                                </div>
                                {isRejecting ? (
                                    <div className="mt-2 flex flex-col gap-2">
                                        <textarea
                                            rows={2}
                                            value={reason}
                                            onChange={(e) => {
                                                setReason(e.target.value);
                                                setReasonError("");
                                            }}
                                            placeholder="Rejection reason…"
                                            className="w-full text-xs bg-[#f5f7f2] border border-[#cfdbbf] rounded-lg px-3 py-2 outline-none focus:border-[#6b7c5a] resize-none"
                                        />
                                        {reasonError && (
                                            <p className="text-xs text-red-600">{reasonError}</p>
                                        )}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleReject(l._id)}
                                                disabled={isAction}
                                                className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md disabled:opacity-50 transition-colors"
                                            >
                                                Confirm Reject
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setRejectingId(null);
                                                    setReason("");
                                                    setReasonError("");
                                                }}
                                                className="text-xs font-medium text-[#6b7c5a] bg-[#f0f4ea] px-3 py-1.5 rounded-md"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => approveTeamLeave(l._id)}
                                            disabled={isAction}
                                            className="text-xs font-medium text-white bg-[#3d4f2f] hover:bg-[#2d3a22] px-3 py-1.5 rounded-md disabled:opacity-50 transition-colors"
                                        >
                                            {isAction ? "…" : "Approve"}
                                        </button>
                                        <button
                                            onClick={() => setRejectingId(l._id)}
                                            disabled={isAction}
                                            className="text-xs font-medium text-[#6b7c5a] bg-[#f0f4ea] hover:bg-red-50 hover:text-red-600 px-3 py-1.5 rounded-md disabled:opacity-50 transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

// ── Recent pending reimbursements ─────────────────────────────────────────────
const PendingReimbursementsList = ({
    reimbursements,
    loading,
    approveTeamReimbursement,
    rejectTeamReimbursement,
    actionLoading
}) => {
    const [rejectingId, setRejectingId] = useState(null);
    const [reason, setReason] = useState("");
    const [reasonError, setReasonError] = useState("");

    const pending = reimbursements.filter((r) => r.status === "pending").slice(0, 5);

    const handleReject = async (id) => {
        if (!reason.trim()) return setReasonError("Reason is required.");
        try {
            await rejectTeamReimbursement(id, reason.trim());
            setRejectingId(null);
            setReason("");
        } catch {
            /* error handled in context */
        }
    };

    return (
        <div className="bg-white border border-[#cfdbbf] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8eedf]">
                <h3 className="text-sm font-semibold text-[#2d3a22]">Pending Reimbursements</h3>
                <Link
                    to="/manager-dashboard/team-reimbursements"
                    className="text-xs text-[#6b7c5a] hover:text-[#2d3a22] font-medium transition-colors"
                >
                    View all →
                </Link>
            </div>
            {loading ? (
                <div className="flex items-center justify-center py-10 text-sm text-[#6b7c5a]">
                    Loading…
                </div>
            ) : pending.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <svg
                        className="w-7 h-7 text-[#cfdbbf]"
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
                    <p className="text-sm text-[#8fa07a]">No pending reimbursements.</p>
                </div>
            ) : (
                <ul className="divide-y divide-[#e8eedf]">
                    {pending.map((r) => {
                        const isAction = actionLoading === r._id;
                        const isRejecting = rejectingId === r._id;
                        return (
                            <li key={r._id} className="px-5 py-3.5">
                                <div className="flex items-start justify-between gap-3 mb-1.5">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-[#2d3a22]">
                                            {r.requesterId?.name}
                                        </p>
                                        <p className="text-xs text-[#6b7c5a] capitalize">
                                            {r.category} · ${r.amount.toFixed(2)}
                                        </p>
                                    </div>
                                    <Badge status={r.status} />
                                </div>
                                {isRejecting ? (
                                    <div className="mt-2 flex flex-col gap-2">
                                        <textarea
                                            rows={2}
                                            value={reason}
                                            onChange={(e) => {
                                                setReason(e.target.value);
                                                setReasonError("");
                                            }}
                                            placeholder="Rejection reason…"
                                            className="w-full text-xs bg-[#f5f7f2] border border-[#cfdbbf] rounded-lg px-3 py-2 outline-none focus:border-[#6b7c5a] resize-none"
                                        />
                                        {reasonError && (
                                            <p className="text-xs text-red-600">{reasonError}</p>
                                        )}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleReject(r._id)}
                                                disabled={isAction}
                                                className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md disabled:opacity-50 transition-colors"
                                            >
                                                Confirm Reject
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setRejectingId(null);
                                                    setReason("");
                                                    setReasonError("");
                                                }}
                                                className="text-xs font-medium text-[#6b7c5a] bg-[#f0f4ea] px-3 py-1.5 rounded-md"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => approveTeamReimbursement(r._id)}
                                            disabled={isAction}
                                            className="text-xs font-medium text-white bg-[#3d4f2f] hover:bg-[#2d3a22] px-3 py-1.5 rounded-md disabled:opacity-50 transition-colors"
                                        >
                                            {isAction ? "…" : "Approve"}
                                        </button>
                                        <button
                                            onClick={() => setRejectingId(r._id)}
                                            disabled={isAction}
                                            className="text-xs font-medium text-[#6b7c5a] bg-[#f0f4ea] hover:bg-red-50 hover:text-red-600 px-3 py-1.5 rounded-md disabled:opacity-50 transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

// ── Overview ──────────────────────────────────────────────────────────────────
const ManagerOverview = () => {
    const {
        teamLeaves,
        loading: leavesLoading,
        actionLoading: leaveActionLoading,
        approveTeamLeave,
        rejectTeamLeave
    } = useTeamLeaves();
    const {
        teamReimbursements,
        loading: reimbLoading,
        actionLoading: reimbActionLoading,
        approveTeamReimbursement,
        rejectTeamReimbursement
    } = useTeamReimbursements();
    const [teamSize, setTeamSize] = useState(null);
    const [teamLoading, setTeamLoading] = useState(true);

    useEffect(() => {
        getMyTeam()
            .then(({ users }) => setTeamSize(users.length))
            .catch(() => setTeamSize("—"))
            .finally(() => setTeamLoading(false));
    }, []);

    const loading = leavesLoading || reimbLoading;

    const pendingLeaves = teamLeaves.filter((l) => l.status === "pending").length;
    const pendingReimb = teamReimbursements.filter((r) => r.status === "pending").length;
    const pendingAmount = teamReimbursements
        .filter((r) => r.status === "pending")
        .reduce((sum, r) => sum + r.amount, 0);

    return (
        <div>
            <PageHeader title="Team Dashboard" subtitle="Review and action your team's requests." />

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Team Members"
                    value={teamSize ?? "—"}
                    loading={teamLoading}
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
                                d="M17 20H7m10 0a3 3 0 003-3v-1a3 3 0 00-3-3H7a3 3 0 00-3 3v1a3 3 0 003 3m10 0H7M9 7a3 3 0 106 0A3 3 0 009 7z"
                            />
                        </svg>
                    }
                />
                <StatCard
                    label="Pending Leaves"
                    value={pendingLeaves}
                    loading={loading}
                    accent={pendingLeaves > 0}
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
                    label="Pending Reimbursements"
                    value={pendingReimb}
                    loading={loading}
                    accent={pendingReimb > 0}
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
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                    }
                />
                <StatCard
                    label="Pending Amount"
                    value={`$${pendingAmount.toFixed(0)}`}
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
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    }
                />
            </div>

            {/* Action lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <PendingLeavesList
                    leaves={teamLeaves}
                    loading={leavesLoading}
                    approveTeamLeave={approveTeamLeave}
                    rejectTeamLeave={rejectTeamLeave}
                    actionLoading={leaveActionLoading}
                />
                <PendingReimbursementsList
                    reimbursements={teamReimbursements}
                    loading={reimbLoading}
                    approveTeamReimbursement={approveTeamReimbursement}
                    rejectTeamReimbursement={rejectTeamReimbursement}
                    actionLoading={reimbActionLoading}
                />
            </div>
        </div>
    );
};

export default ManagerOverview;
