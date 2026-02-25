import { useState } from "react";
import { useTeamReimbursements } from "../../context/TeamReimbursementsContext";
import PageHeader from "../../components/ui/PageHeader";
import Badge from "../../components/ui/Badge";

const STATUSES = ["all", "pending", "approved", "rejected", "paid"];
const ROLES = ["all", "employee", "manager"];

const CATEGORY_COLORS = {
    travel: "bg-blue-50 text-blue-700",
    meals: "bg-orange-50 text-orange-700",
    accommodation: "bg-purple-50 text-purple-700",
    medical: "bg-red-50 text-red-600",
    equipment: "bg-teal-50 text-teal-700",
    training: "bg-indigo-50 text-indigo-700",
    other: "bg-[#f0f4ea] text-[#6b7c5a]"
};

const CategoryChip = ({ category }) => {
    const cls = CATEGORY_COLORS[category?.toLowerCase()] ?? CATEGORY_COLORS.other;
    return (
        <span
            className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full capitalize ${cls}`}
        >
            {category}
        </span>
    );
};

const fmt = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// ── Reject inline ─────────────────────────────────────────────────────────────
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

// ── Mobile card ───────────────────────────────────────────────────────────────
const ReimbCard = ({ reimb, onApprove, onReject, actionLoading }) => {
    const [rejecting, setRejecting] = useState(false);
    const isAction = actionLoading === reimb._id;
    const isPending = reimb.status === "pending";

    return (
        <div className="bg-white border border-[#cfdbbf] rounded-xl p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#2d3a22] capitalize truncate">
                        {reimb.requesterId?.name}
                    </p>
                    <p className="text-xs text-[#6b7c5a] truncate">{reimb.requesterId?.email}</p>
                </div>
                <Badge status={reimb.status} />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6b7c5a] mb-2">
                <CategoryChip category={reimb.category} />
                <span className="font-semibold text-[#2d3a22]">${reimb.amount.toFixed(2)}</span>
                <span>{fmt(reimb.createdAt)}</span>
            </div>

            {reimb.description && (
                <p className="text-xs text-[#6b7c5a] mb-2 line-clamp-2">{reimb.description}</p>
            )}

            {reimb.rejectionReason && (
                <p className="text-xs text-red-500 mb-2">Rejected: {reimb.rejectionReason}</p>
            )}

            {reimb.receipts?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {reimb.receipts.map((_, i) => (
                        <a
                            key={i}
                            href={`/api/reimbursements/${reimb._id}/receipts/${i}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-[#3d4f2f] bg-[#e8eedf] hover:bg-[#d4dfc7] px-2 py-1 rounded-md transition-colors"
                        >
                            Receipt {i + 1}
                        </a>
                    ))}
                </div>
            )}

            {isPending && !rejecting && (
                <div className="flex gap-2">
                    <button
                        onClick={() => onApprove(reimb._id)}
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
                    onConfirm={(r) => onReject(reimb._id, r)}
                    onCancel={() => setRejecting(false)}
                    loading={isAction}
                />
            )}
        </div>
    );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const TeamReimbursementsPage = () => {
    const {
        teamReimbursements,
        loading,
        error,
        actionLoading,
        approveTeamReimbursement,
        rejectTeamReimbursement
    } = useTeamReimbursements();
    const [status, setStatus] = useState("all");
    const [role, setRole] = useState("all");
    const [rejectingId, setRejectingId] = useState(null);

    const byRole =
        role === "all"
            ? teamReimbursements
            : teamReimbursements.filter((r) => r.requesterId?.role === role);
    const filtered = status === "all" ? byRole : byRole.filter((r) => r.status === status);

    const handleApprove = async (id) => {
        try {
            await approveTeamReimbursement(id);
        } catch {
            /* handled in context */
        }
    };

    const handleReject = async (id, reason) => {
        try {
            await rejectTeamReimbursement(id, reason);
            setRejectingId(null);
        } catch {
            /* handled in context */
        }
    };

    return (
        <div>
            <PageHeader
                title="Team Reimbursements"
                subtitle="Review and action reimbursement requests from your team."
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
                                ? teamReimbursements.length
                                : teamReimbursements.filter((r2) => r2.requesterId?.role === r)
                                      .length}
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
                                ({byRole.filter((r) => r.status === s).length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Mobile cards */}
            {loading ? (
                <div className="lg:hidden space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-40 bg-[#e8eedf] rounded-xl animate-pulse" />
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
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                    <p className="text-sm text-[#8fa07a]">
                        No {status === "all" ? "" : status} reimbursements.
                    </p>
                </div>
            ) : (
                <div className="lg:hidden space-y-3">
                    {filtered.map((r) => (
                        <ReimbCard
                            key={r._id}
                            reimb={r}
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
                                "Category",
                                "Amount",
                                "Description",
                                "Receipts",
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
                                    {[...Array(8)].map((__, j) => (
                                        <td key={j} className="px-4 py-3">
                                            <div className="h-4 bg-[#e8eedf] rounded animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-4 py-16 text-center text-sm text-[#8fa07a]"
                                >
                                    No {status === "all" ? "" : status} reimbursements.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((r) => {
                                const isAction = actionLoading === r._id;
                                const isPending = r.status === "pending";
                                const isRejecting = rejectingId === r._id;

                                return (
                                    <>
                                        <tr
                                            key={r._id}
                                            className="border-b border-[#e8eedf] hover:bg-[#fafcf8] transition-colors"
                                        >
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-[#2d3a22] capitalize">
                                                    {r.requesterId?.name}
                                                </p>
                                                <p className="text-xs text-[#8fa07a]">
                                                    {r.requesterId?.email}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <CategoryChip category={r.category} />
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-[#2d3a22]">
                                                ${r.amount.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-[#6b7c5a] max-w-[180px]">
                                                {r.rejectionReason ? (
                                                    <span className="text-red-500 text-xs">
                                                        Rejected: {r.rejectionReason}
                                                    </span>
                                                ) : (
                                                    <span className="truncate block">
                                                        {r.description || "—"}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {r.receipts?.length > 0 ? (
                                                        r.receipts.map((_, i) => (
                                                            <a
                                                                key={i}
                                                                href={`/api/reimbursements/${r._id}/receipts/${i}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-xs text-[#3d4f2f] bg-[#e8eedf] hover:bg-[#d4dfc7] px-2 py-0.5 rounded-md transition-colors"
                                                            >
                                                                {i + 1}
                                                            </a>
                                                        ))
                                                    ) : (
                                                        <span className="text-[#cfdbbf] text-xs">
                                                            —
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge status={r.status} />
                                            </td>
                                            <td className="px-4 py-3 text-[#6b7c5a]">
                                                {fmt(r.createdAt)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {isPending && !isRejecting && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleApprove(r._id)}
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
                                                {isPending && isRejecting && (
                                                    <span className="text-xs text-[#8fa07a]">
                                                        See below ↓
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                        {isRejecting && (
                                            <tr
                                                key={`reject-${r._id}`}
                                                className="border-b border-[#e8eedf] bg-[#fafcf8]"
                                            >
                                                <td colSpan={8} className="px-4 pb-4">
                                                    <RejectInline
                                                        onConfirm={(reason) =>
                                                            handleReject(r._id, reason)
                                                        }
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

export default TeamReimbursementsPage;
