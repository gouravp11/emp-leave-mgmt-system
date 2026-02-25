import { useEffect, useState, useCallback } from "react";
import { getMyTeam } from "../../api/user.api";
import { getUserLeaves, approveLeave, rejectLeave } from "../../api/leave.api";
import {
    getUserReimbursements,
    approveReimbursement,
    rejectReimbursement
} from "../../api/reimbursement.api";
import PageHeader from "../../components/ui/PageHeader";
import Badge from "../../components/ui/Badge";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const initials = (name = "") =>
    name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("");

const ROLE_STYLES = {
    manager: "bg-[#3d4f2f] text-white",
    employee: "bg-[#e8eedf] text-[#3d4f2f]"
};

const CATEGORY_COLORS = {
    travel: "bg-blue-50 text-blue-700",
    food: "bg-orange-50 text-orange-700",
    medical: "bg-red-50 text-red-600",
    fuel: "bg-yellow-50 text-yellow-700",
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

// ── Inline reject form ────────────────────────────────────────────────────────
const RejectInline = ({ onConfirm, onCancel, loading }) => {
    const [reason, setReason] = useState("");
    const [err, setErr] = useState("");

    const submit = () => {
        if (!reason.trim()) return setErr("Reason is required.");
        onConfirm(reason.trim());
    };

    return (
        <div className="flex flex-col gap-2 mt-2 p-3 bg-[#f5f7f2] rounded-lg border border-[#cfdbbf]">
            <textarea
                rows={2}
                value={reason}
                onChange={(e) => {
                    setReason(e.target.value);
                    setErr("");
                }}
                placeholder="Rejection reason…"
                className="w-full text-xs bg-white border border-[#cfdbbf] rounded-lg px-3 py-2 outline-none focus:border-[#6b7c5a] resize-none"
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
                    className="text-xs font-medium text-[#6b7c5a] bg-white border border-[#cfdbbf] px-3 py-1.5 rounded-md transition-colors hover:bg-[#e8eedf]"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

// ── Leaves tab ────────────────────────────────────────────────────────────────
const LeavesTab = ({ userId }) => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [rejectingId, setRejectingId] = useState(null);
    const [error, setError] = useState("");

    const fetchLeaves = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getUserLeaves(userId);
            setLeaves(data.leaves ?? data);
        } catch (e) {
            setError(e.message || "Failed to load leaves.");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchLeaves();
    }, [fetchLeaves]);

    const handleApprove = async (id) => {
        setActionLoading(id);
        try {
            await approveLeave(id);
            setLeaves((prev) => prev.map((l) => (l._id === id ? { ...l, status: "approved" } : l)));
        } catch (e) {
            setError(e.message || "Action failed.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id, reason) => {
        setActionLoading(id);
        try {
            await rejectLeave(id, reason);
            setLeaves((prev) =>
                prev.map((l) =>
                    l._id === id ? { ...l, status: "rejected", rejectionReason: reason } : l
                )
            );
            setRejectingId(null);
        } catch (e) {
            setError(e.message || "Action failed.");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading)
        return (
            <div className="space-y-2 pt-2">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-[#e8eedf] rounded-xl animate-pulse" />
                ))}
            </div>
        );

    if (error) return <p className="text-xs text-red-600 pt-2">{error}</p>;

    if (leaves.length === 0)
        return (
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
                <p className="text-sm text-[#8fa07a]">No leaves found.</p>
            </div>
        );

    return (
        <div className="space-y-2 pt-2">
            {leaves.map((l) => {
                const isAction = actionLoading === l._id;
                const isRejecting = rejectingId === l._id;
                return (
                    <div
                        key={l._id}
                        className="bg-[#f5f7f2] border border-[#e8eedf] rounded-xl p-3"
                    >
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <div>
                                <span className="text-xs font-semibold text-[#2d3a22] capitalize">
                                    {l.leaveType} Leave
                                </span>
                                <span className="text-xs text-[#8fa07a] ml-2">
                                    · {l.totalDays}d
                                </span>
                            </div>
                            <Badge status={l.status} />
                        </div>
                        <p className="text-xs text-[#6b7c5a] mb-1">
                            {fmt(l.startDate)} → {fmt(l.endDate)}
                        </p>
                        {l.reason && (
                            <p className="text-xs text-[#8fa07a] mb-1 line-clamp-1">{l.reason}</p>
                        )}
                        {l.rejectionReason && (
                            <p className="text-xs text-red-500 mb-1">
                                Rejected: {l.rejectionReason}
                            </p>
                        )}
                        {l.status === "pending" && !isRejecting && (
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => handleApprove(l._id)}
                                    disabled={isAction}
                                    className="text-xs font-medium text-white bg-[#3d4f2f] hover:bg-[#2d3a22] px-3 py-1 rounded-md disabled:opacity-50 transition-colors"
                                >
                                    {isAction ? "…" : "Approve"}
                                </button>
                                <button
                                    onClick={() => setRejectingId(l._id)}
                                    disabled={isAction}
                                    className="text-xs font-medium text-[#6b7c5a] bg-white border border-[#cfdbbf] hover:bg-red-50 hover:text-red-600 hover:border-red-200 px-3 py-1 rounded-md disabled:opacity-50 transition-colors"
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                        {isRejecting && (
                            <RejectInline
                                onConfirm={(r) => handleReject(l._id, r)}
                                onCancel={() => setRejectingId(null)}
                                loading={isAction}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// ── Reimbursements tab ────────────────────────────────────────────────────────
const ReimbursementsTab = ({ userId }) => {
    const [reimbs, setReimbs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [rejectingId, setRejectingId] = useState(null);
    const [error, setError] = useState("");

    const fetchReimbs = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getUserReimbursements(userId);
            setReimbs(data.reimbursements ?? data);
        } catch (e) {
            setError(e.message || "Failed to load reimbursements.");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchReimbs();
    }, [fetchReimbs]);

    const handleApprove = async (id) => {
        setActionLoading(id);
        try {
            await approveReimbursement(id);
            setReimbs((prev) => prev.map((r) => (r._id === id ? { ...r, status: "approved" } : r)));
        } catch (e) {
            setError(e.message || "Action failed.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id, reason) => {
        setActionLoading(id);
        try {
            await rejectReimbursement(id, reason);
            setReimbs((prev) =>
                prev.map((r) =>
                    r._id === id ? { ...r, status: "rejected", rejectionReason: reason } : r
                )
            );
            setRejectingId(null);
        } catch (e) {
            setError(e.message || "Action failed.");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading)
        return (
            <div className="space-y-2 pt-2">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-[#e8eedf] rounded-xl animate-pulse" />
                ))}
            </div>
        );

    if (error) return <p className="text-xs text-red-600 pt-2">{error}</p>;

    if (reimbs.length === 0)
        return (
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                </svg>
                <p className="text-sm text-[#8fa07a]">No reimbursements found.</p>
            </div>
        );

    return (
        <div className="space-y-2 pt-2">
            {reimbs.map((r) => {
                const isAction = actionLoading === r._id;
                const isRejecting = rejectingId === r._id;
                return (
                    <div
                        key={r._id}
                        className="bg-[#f5f7f2] border border-[#e8eedf] rounded-xl p-3"
                    >
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                                <CategoryChip category={r.category} />
                                <span className="text-sm font-bold text-[#2d3a22]">
                                    ${r.amount.toFixed(2)}
                                </span>
                            </div>
                            <Badge status={r.status} />
                        </div>
                        {r.description && (
                            <p className="text-xs text-[#6b7c5a] mb-1 line-clamp-1">
                                {r.description}
                            </p>
                        )}
                        <p className="text-xs text-[#8fa07a] mb-1">Submitted {fmt(r.createdAt)}</p>
                        {r.receipts?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-1">
                                {r.receipts.map((_, i) => (
                                    <a
                                        key={i}
                                        href={`/api/reimbursements/${r._id}/receipts/${i}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-[#3d4f2f] bg-[#e8eedf] hover:bg-[#d4dfc7] px-2 py-0.5 rounded-md transition-colors"
                                    >
                                        Receipt {i + 1}
                                    </a>
                                ))}
                            </div>
                        )}
                        {r.rejectionReason && (
                            <p className="text-xs text-red-500 mb-1">
                                Rejected: {r.rejectionReason}
                            </p>
                        )}
                        {r.status === "pending" && !isRejecting && (
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => handleApprove(r._id)}
                                    disabled={isAction}
                                    className="text-xs font-medium text-white bg-[#3d4f2f] hover:bg-[#2d3a22] px-3 py-1 rounded-md disabled:opacity-50 transition-colors"
                                >
                                    {isAction ? "…" : "Approve"}
                                </button>
                                <button
                                    onClick={() => setRejectingId(r._id)}
                                    disabled={isAction}
                                    className="text-xs font-medium text-[#6b7c5a] bg-white border border-[#cfdbbf] hover:bg-red-50 hover:text-red-600 hover:border-red-200 px-3 py-1 rounded-md disabled:opacity-50 transition-colors"
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                        {isRejecting && (
                            <RejectInline
                                onConfirm={(reason) => handleReject(r._id, reason)}
                                onCancel={() => setRejectingId(null)}
                                loading={isAction}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// ── Member detail drawer ──────────────────────────────────────────────────────
const MemberDrawer = ({ member, onClose }) => {
    const [tab, setTab] = useState("leaves");

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e8eedf] shrink-0">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-[#3d4f2f] flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {initials(member.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#2d3a22] capitalize truncate">
                            {member.name}
                        </p>
                        <p className="text-xs text-[#6b7c5a] truncate">{member.email}</p>
                    </div>
                    <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${ROLE_STYLES[member.role] ?? "bg-[#e8eedf] text-[#6b7c5a]"}`}
                    >
                        {member.role}
                    </span>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-[#8fa07a] hover:bg-[#f0f4ea] transition-colors shrink-0"
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

                {/* Tabs */}
                <div className="flex border-b border-[#e8eedf] shrink-0 px-5">
                    {[
                        { key: "leaves", label: "Leaves" },
                        { key: "reimbursements", label: "Reimbursements" }
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            className={`py-3 text-sm font-medium border-b-2 mr-6 transition-colors ${
                                tab === key
                                    ? "border-[#3d4f2f] text-[#2d3a22]"
                                    : "border-transparent text-[#8fa07a] hover:text-[#2d3a22]"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-5 pb-6">
                    {tab === "leaves" ? (
                        <LeavesTab key={`leaves-${member._id}`} userId={member._id} />
                    ) : (
                        <ReimbursementsTab key={`reimbs-${member._id}`} userId={member._id} />
                    )}
                </div>
            </div>
        </>
    );
};

// ── Member card ───────────────────────────────────────────────────────────────
const MemberCard = ({ member, onSelect }) => (
    <div className="bg-white border border-[#cfdbbf] rounded-xl p-4 flex items-center gap-4 hover:border-[#8fa07a] hover:shadow-sm transition-all">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-[#3d4f2f] flex items-center justify-center text-white text-base font-bold shrink-0">
            {initials(member.name)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#2d3a22] capitalize truncate">
                {member.name}
            </p>
            <p className="text-xs text-[#6b7c5a] truncate">{member.email}</p>
            <span
                className={`inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${ROLE_STYLES[member.role] ?? "bg-[#e8eedf] text-[#6b7c5a]"}`}
            >
                {member.role}
            </span>
        </div>

        {/* Action */}
        <button
            onClick={() => onSelect(member)}
            className="shrink-0 text-xs font-medium text-[#3d4f2f] bg-[#e8eedf] hover:bg-[#d4dfc7] px-3 py-2 rounded-lg transition-colors"
        >
            View Details
        </button>
    </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const ROLE_FILTERS = ["all", "employee", "manager"];

const MyTeamPage = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        getMyTeam()
            .then((data) => setMembers(data.users ?? data))
            .catch((e) => setError(e.message || "Failed to load team."))
            .finally(() => setLoading(false));
    }, []);

    const filtered = roleFilter === "all" ? members : members.filter((m) => m.role === roleFilter);

    return (
        <div>
            <PageHeader
                title="My Team"
                subtitle="View and manage your team members, their leaves and reimbursements."
            />

            {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Role filter + count */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div className="flex gap-2">
                    {ROLE_FILTERS.map((r) => (
                        <button
                            key={r}
                            onClick={() => setRoleFilter(r)}
                            className={`text-xs font-medium px-3.5 py-1.5 rounded-full capitalize transition-colors border ${
                                roleFilter === r
                                    ? "bg-[#2d3a22] text-white border-[#2d3a22]"
                                    : "bg-white text-[#6b7c5a] border-[#cfdbbf] hover:border-[#8fa07a] hover:text-[#2d3a22]"
                            }`}
                        >
                            {r === "all" ? "All" : r.charAt(0).toUpperCase() + r.slice(1) + "s"}
                            <span className="ml-1.5 opacity-60">
                                (
                                {r === "all"
                                    ? members.length
                                    : members.filter((m) => m.role === r).length}
                                )
                            </span>
                        </button>
                    ))}
                </div>
                {!loading && (
                    <p className="text-xs text-[#8fa07a]">
                        {filtered.length} {filtered.length === 1 ? "member" : "members"}
                    </p>
                )}
            </div>

            {/* Cards grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-24 bg-[#e8eedf] rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <svg
                        className="w-10 h-10 text-[#cfdbbf]"
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
                    <p className="text-sm text-[#8fa07a]">No team members found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {filtered.map((m) => (
                        <MemberCard key={m._id} member={m} onSelect={setSelected} />
                    ))}
                </div>
            )}

            {/* Drawer */}
            {selected && <MemberDrawer member={selected} onClose={() => setSelected(null)} />}
        </div>
    );
};

export default MyTeamPage;
