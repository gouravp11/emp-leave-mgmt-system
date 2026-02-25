import { useState } from "react";
import { useTeamLeaves } from "../../context/TeamLeavesContext";
import PageHeader from "../../components/ui/PageHeader";
import Badge from "../../components/ui/Badge";

const STATUSES = ["all", "pending", "approved", "rejected", "cancelled"];
const ROLES = ["all", "employee", "manager"];

const fmt = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// ── Reject modal (inline) ─────────────────────────────────────────────────────
const RejectInline = ({ onConfirm, onCancel, loading }) => {
    const [reason, setReason] = useState("");
    const [err, setErr] = useState("");

    const submit = () => {
        if (!reason.trim()) return setErr("Reason is required.");
        onConfirm(reason.trim());
    };

    return (
        <div className="flex flex-col gap-2 mt-2">
            <textarea
                rows={2}
                value={reason}
                onChange={(e) => {
                    setReason(e.target.value);
                    setErr("");
                }}
                placeholder="Rejection reason…"
                className="w-full text-xs bg-[#f5f7f2] border border-[#cfdbbf] rounded-lg px-3 py-2 outline-none focus:border-[#6b7c5a] resize-none"
            />
            {err && <p className="text-xs text-red-600">{err}</p>}
            <div className="flex gap-2">
                <button
                    onClick={submit}
                    disabled={loading}
                    className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md disabled:opacity-50 transition-colors"
                >
                    {loading ? "…" : "Confirm Reject"}
                </button>
                <button
                    onClick={onCancel}
                    className="text-xs font-medium text-[#6b7c5a] bg-[#f0f4ea] hover:bg-[#e8eedf] px-3 py-1.5 rounded-md transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

// ── Single leave card (mobile) ────────────────────────────────────────────────
const LeaveCard = ({ leave, onApprove, onReject, actionLoading }) => {
    const [rejecting, setRejecting] = useState(false);
    const isAction = actionLoading === leave._id;
    const isPending = leave.status === "pending";

    return (
        <div className="bg-white border border-[#cfdbbf] rounded-xl p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#2d3a22] capitalize truncate">
                        {leave.requesterId?.name}
                    </p>
                    <p className="text-xs text-[#6b7c5a] truncate">{leave.requesterId?.email}</p>
                </div>
                <Badge status={leave.status} />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-[#6b7c5a] mb-3">
                <span>
                    <span className="text-[#8fa07a]">Type</span> ·{" "}
                    <span className="capitalize text-[#2d3a22]">{leave.leaveType}</span>
                </span>
                <span>
                    <span className="text-[#8fa07a]">Days</span> ·{" "}
                    <span className="text-[#2d3a22]">{leave.totalDays}</span>
                </span>
                <span>
                    <span className="text-[#8fa07a]">From</span> · {fmt(leave.startDate)}
                </span>
                <span>
                    <span className="text-[#8fa07a]">To</span> · {fmt(leave.endDate)}
                </span>
                {leave.reason && (
                    <span className="col-span-2">
                        <span className="text-[#8fa07a]">Reason</span> · {leave.reason}
                    </span>
                )}
                {leave.rejectionReason && (
                    <span className="col-span-2 text-red-500">
                        <span className="text-[#8fa07a]">Rejection</span> · {leave.rejectionReason}
                    </span>
                )}
            </div>
            {isPending && !rejecting && (
                <div className="flex gap-2">
                    <button
                        onClick={() => onApprove(leave._id)}
                        disabled={isAction}
                        className="text-xs font-medium text-white bg-[#3d4f2f] hover:bg-[#2d3a22] px-3 py-1.5 rounded-md disabled:opacity-50 transition-colors"
                    >
                        {isAction ? "…" : "Approve"}
                    </button>
                    <button
                        onClick={() => setRejecting(true)}
                        disabled={isAction}
                        className="text-xs font-medium text-[#6b7c5a] bg-[#f0f4ea] hover:bg-red-50 hover:text-red-600 px-3 py-1.5 rounded-md disabled:opacity-50 transition-colors"
                    >
                        Reject
                    </button>
                </div>
            )}
            {rejecting && (
                <RejectInline
                    onConfirm={(r) => onReject(leave._id, r)}
                    onCancel={() => setRejecting(false)}
                    loading={isAction}
                />
            )}
        </div>
    );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const TeamLeavesPage = () => {
    const { teamLeaves, loading, error, actionLoading, approveTeamLeave, rejectTeamLeave } =
        useTeamLeaves();
    const [status, setStatus] = useState("all");
    const [role, setRole] = useState("all");
    const [rejectingId, setRejectingId] = useState(null);

    const byRole =
        role === "all" ? teamLeaves : teamLeaves.filter((l) => l.requesterId?.role === role);
    const filtered = status === "all" ? byRole : byRole.filter((l) => l.status === status);

    const handleApprove = async (id) => {
        try {
            await approveTeamLeave(id);
        } catch {
            /* error shown via context */
        }
    };

    const handleReject = async (id, reason) => {
        try {
            await rejectTeamLeave(id, reason);
            setRejectingId(null);
        } catch {
            /* error shown via context */
        }
    };

    return (
        <div>
            <PageHeader
                title="Team Leaves"
                subtitle="Review and action leave requests from your team."
            />

            {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Role filter */}
            <div className="flex gap-2 mb-3">
                {ROLES.map((r) => (
                    <button
                        key={r}
                        onClick={() => setRole(r)}
                        className={`text-xs font-medium px-3.5 py-1.5 rounded-full capitalize transition-colors border ${
                            role === r
                                ? "bg-[#2d3a22] text-white border-[#2d3a22]"
                                : "bg-white text-[#6b7c5a] border-[#cfdbbf] hover:border-[#8fa07a] hover:text-[#2d3a22]"
                        }`}
                    >
                        {r === "all" ? "All Roles" : r.charAt(0).toUpperCase() + r.slice(1)}
                        <span className="ml-1.5 opacity-60">
                            (
                            {r === "all"
                                ? teamLeaves.length
                                : teamLeaves.filter((l) => l.requesterId?.role === r).length}
                            )
                        </span>
                    </button>
                ))}
            </div>

            {/* Status filter tabs */}
            <div className="flex flex-wrap gap-2 mb-5 w-full">
                {STATUSES.map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatus(s)}
                        className={`flex-1 min-w-[80px] text-xs font-medium px-3 py-2 rounded-lg capitalize transition-colors ${
                            status === s
                                ? "bg-[#3d4f2f] text-white"
                                : "bg-[#f0f4ea] text-[#6b7c5a] hover:bg-[#e8eedf] hover:text-[#2d3a22]"
                        }`}
                    >
                        {s}
                        {s !== "all" && (
                            <span className="ml-1 opacity-60">
                                ({byRole.filter((l) => l.status === s).length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Mobile cards */}
            {loading ? (
                <div className="lg:hidden space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-36 bg-[#e8eedf] rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="lg:hidden flex flex-col items-center justify-center py-16 gap-3">
                    <svg
                        className="w-9 h-9 text-[#cfdbbf]"
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
                    <p className="text-sm text-[#8fa07a]">
                        No {status === "all" ? "" : status} leaves.
                    </p>
                </div>
            ) : (
                <div className="lg:hidden space-y-3">
                    {filtered.map((l) => (
                        <LeaveCard
                            key={l._id}
                            leave={l}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            actionLoading={actionLoading}
                        />
                    ))}
                </div>
            )}

            {/* Desktop table */}
            <div className="hidden lg:block bg-white border border-[#cfdbbf] rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-[#f5f7f2] border-b border-[#e8eedf]">
                            {[
                                "Employee",
                                "Type",
                                "From",
                                "To",
                                "Days",
                                "Reason",
                                "Status",
                                "Submitted",
                                "Action"
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="text-left text-xs font-semibold text-[#6b7c5a] px-4 py-3"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            [...Array(4)].map((_, i) => (
                                <tr key={i} className="border-b border-[#e8eedf]">
                                    {[...Array(9)].map((__, j) => (
                                        <td key={j} className="px-4 py-3">
                                            <div className="h-4 bg-[#e8eedf] rounded animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="px-4 py-16 text-center text-sm text-[#8fa07a]"
                                >
                                    No {status === "all" ? "" : status} leaves.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((l) => {
                                const isAction = actionLoading === l._id;
                                const isPending = l.status === "pending";
                                const isRejecting = rejectingId === l._id;

                                return (
                                    <>
                                        <tr
                                            key={l._id}
                                            className="border-b border-[#e8eedf] hover:bg-[#fafcf8] transition-colors"
                                        >
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-[#2d3a22] capitalize">
                                                    {l.requesterId?.name}
                                                </p>
                                                <p className="text-xs text-[#8fa07a]">
                                                    {l.requesterId?.email}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 capitalize text-[#2d3a22]">
                                                {l.leaveType}
                                            </td>
                                            <td className="px-4 py-3 text-[#2d3a22]">
                                                {fmt(l.startDate)}
                                            </td>
                                            <td className="px-4 py-3 text-[#2d3a22]">
                                                {fmt(l.endDate)}
                                            </td>
                                            <td className="px-4 py-3 text-[#2d3a22]">
                                                {l.totalDays}
                                            </td>
                                            <td className="px-4 py-3 text-[#6b7c5a] max-w-[160px] truncate">
                                                {l.rejectionReason ? (
                                                    <span className="text-red-500">
                                                        {l.rejectionReason}
                                                    </span>
                                                ) : (
                                                    l.reason || "—"
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge status={l.status} />
                                            </td>
                                            <td className="px-4 py-3 text-[#6b7c5a]">
                                                {fmt(l.createdAt)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {isPending && !isRejecting && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleApprove(l._id)}
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
                                                {isPending && isRejecting && (
                                                    <span className="text-xs text-[#8fa07a]">
                                                        See below ↓
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                        {isRejecting && (
                                            <tr
                                                key={`reject-${l._id}`}
                                                className="border-b border-[#e8eedf] bg-[#fafcf8]"
                                            >
                                                <td colSpan={9} className="px-4 pb-4">
                                                    <RejectInline
                                                        onConfirm={(r) => handleReject(l._id, r)}
                                                        onCancel={() => setRejectingId(null)}
                                                        loading={isAction}
                                                    />
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeamLeavesPage;
