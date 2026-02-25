import { useEffect, useState } from "react";
import { useMyLeaves } from "../../context/MyLeavesContext";
import PageHeader from "../../components/ui/PageHeader";
import Badge from "../../components/ui/Badge";
import DateInput from "../../components/ui/DateInput";
import Select from "../../components/ui/Select";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const calcDays = (start, end) => {
    if (!start || !end) return 0;
    const diff = new Date(end) - new Date(start);
    return diff < 0 ? 0 : Math.floor(diff / 86400000) + 1;
};

const todayISO = () => new Date().toISOString().split("T")[0];

const LEAVE_TYPES = ["casual", "sick", "earned", "unpaid"];
const LEAVE_TYPE_OPTIONS = LEAVE_TYPES.map((t) => ({
    label: t.charAt(0).toUpperCase() + t.slice(1),
    value: t
}));
const STATUSES = ["All", "Pending", "Approved", "Rejected", "Cancelled"];

// ── Request leave modal ───────────────────────────────────────────────────────
const RequestLeaveModal = ({ onClose, onSubmit, submitting }) => {
    const [form, setForm] = useState({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: ""
    });
    const [formError, setFormError] = useState("");

    const totalDays = calcDays(form.startDate, form.endDate);

    const handleChange = (e) => {
        setFormError("");
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.leaveType) return setFormError("Please select a leave type.");
        if (!form.startDate) return setFormError("Start date is required.");
        if (!form.endDate) return setFormError("End date is required.");
        if (new Date(form.endDate) < new Date(form.startDate))
            return setFormError("End date cannot be before start date.");

        try {
            await onSubmit({ ...form, totalDays });
            onClose();
        } catch (e) {
            setFormError(e.message || "Failed to submit request.");
        }
    };

    const labelClass = "block text-xs font-semibold text-[#3d4f2f] mb-1.5";
    const inputClass =
        "w-full text-sm text-[#2d3a22] bg-[#f5f7f2] border border-[#cfdbbf] rounded-lg px-3.5 py-2.5 outline-none focus:border-[#6b7c5a] focus:ring-2 focus:ring-[#6b7c5a]/10 transition placeholder-[#a8b89a]";

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="fixed inset-0 bg-black/40" onClick={onClose} />
            <div className="relative z-10 w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8eedf] shrink-0">
                    <h2 className="text-base font-semibold text-[#2d3a22]">Request Leave</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-[#8fa07a] hover:bg-[#f0f4ea] transition-colors"
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

                {/* Body */}
                <form
                    onSubmit={handleSubmit}
                    className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4"
                >
                    {/* Leave type */}
                    <div>
                        <label className={labelClass}>Leave Type</label>
                        <Select
                            name="leaveType"
                            value={form.leaveType}
                            onChange={handleChange}
                            options={LEAVE_TYPE_OPTIONS}
                            placeholder="Select type…"
                        />
                    </div>

                    {/* Date range */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass}>Start Date</label>
                            <DateInput
                                name="startDate"
                                value={form.startDate}
                                min={todayISO()}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>End Date</label>
                            <DateInput
                                name="endDate"
                                value={form.endDate}
                                min={form.startDate || todayISO()}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Duration preview */}
                    {totalDays > 0 && (
                        <div className="flex items-center gap-2 bg-[#e8eedf] rounded-lg px-4 py-2.5">
                            <svg
                                className="w-4 h-4 text-[#3d4f2f] shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <p className="text-xs text-[#3d4f2f] font-medium">
                                Duration:{" "}
                                <span className="font-bold">
                                    {totalDays} {totalDays === 1 ? "day" : "days"}
                                </span>
                            </p>
                        </div>
                    )}

                    {/* Reason */}
                    <div>
                        <label className={labelClass}>
                            Reason <span className="text-[#8fa07a] font-normal">(optional)</span>
                        </label>
                        <textarea
                            name="reason"
                            value={form.reason}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Add a note for your manager…"
                            className={`${inputClass} resize-none`}
                        />
                    </div>

                    {formError && (
                        <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                            {formError}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 text-sm font-medium text-[#6b7c5a] bg-[#f0f4ea] hover:bg-[#e8eedf] rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#3d4f2f] hover:bg-[#2d3a22] rounded-lg disabled:opacity-50 transition-colors"
                        >
                            {submitting ? "Submitting…" : "Submit Request"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ── Page ─────────────────────────────────────────────────────────────────────
const MyLeavesPage = () => {
    const { leaves, loading, actionLoading, error, setError, submitLeave, deleteMyLeave } =
        useMyLeaves();

    const [statusFilter, setStatusFilter] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    // Prevent body scroll while modal is open
    useEffect(() => {
        document.body.style.overflow = showModal ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [showModal]);

    const filtered = leaves.filter((l) =>
        statusFilter === "All" ? true : l.status === statusFilter.toLowerCase()
    );

    const handleSubmit = async (data) => {
        setSubmitting(true);
        try {
            await submitLeave(data);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (leaveId) => {
        await deleteMyLeave(leaveId);
        setDeleteConfirmId(null);
    };

    const thClass =
        "text-left text-xs font-semibold text-[#6b7c5a] uppercase tracking-wider px-4 py-3";
    const tdClass = "px-4 py-3.5 text-sm text-[#2d3a22]";

    return (
        <div>
            <PageHeader
                title="My Leaves"
                subtitle="Request and track your leave applications."
                action={
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 text-sm font-semibold text-white bg-[#3d4f2f] hover:bg-[#2d3a22] px-4 py-2.5 rounded-lg transition-colors"
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
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        <span className="hidden sm:inline">Request Leave</span>
                        <span className="sm:hidden">Request</span>
                    </button>
                }
            />

            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center justify-between">
                    {error}
                    <button
                        onClick={() => setError("")}
                        className="text-red-400 hover:text-red-600 ml-2"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Status filter */}
            <div className="flex flex-wrap gap-1 mb-4 bg-white border border-[#cfdbbf] rounded-lg p-1 w-full sm:w-fit">
                {STATUSES.map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={[
                            "flex-1 sm:flex-none px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap text-center",
                            statusFilter === s
                                ? "bg-[#3d4f2f] text-white"
                                : "text-[#6b7c5a] hover:text-[#2d3a22] hover:bg-[#f0f4ea]"
                        ].join(" ")}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden flex flex-col gap-3">
                {loading ? (
                    <div className="flex items-center justify-center py-16 text-sm text-[#6b7c5a]">
                        Loading…
                    </div>
                ) : filtered.length === 0 ? (
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
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <p className="text-sm text-[#8fa07a]">No leaves found.</p>
                    </div>
                ) : (
                    filtered.map((l) => {
                        const isLoading = actionLoading === l._id;
                        const confirming = deleteConfirmId === l._id;
                        return (
                            <div
                                key={l._id}
                                className="bg-white border border-[#cfdbbf] rounded-xl p-4"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-semibold text-[#2d3a22] capitalize">
                                        {l.leaveType} Leave
                                    </p>
                                    <Badge status={l.status} />
                                </div>
                                <p className="text-xs text-[#6b7c5a] mb-0.5">
                                    {fmt(l.startDate)} → {fmt(l.endDate)}
                                </p>
                                <p className="text-xs text-[#8fa07a]">
                                    {l.totalDays} {l.totalDays === 1 ? "day" : "days"} · Submitted{" "}
                                    {fmt(l.createdAt)}
                                </p>
                                {l.reason && (
                                    <p className="text-xs text-[#6b7c5a] mt-2 line-clamp-2">
                                        {l.reason}
                                    </p>
                                )}
                                {l.rejectionReason && (
                                    <p className="text-xs text-red-600 mt-2 bg-red-50 px-2 py-1 rounded">
                                        Reason: {l.rejectionReason}
                                    </p>
                                )}
                                {l.status === "pending" && (
                                    <div className="mt-3 pt-3 border-t border-[#e8eedf]">
                                        {confirming ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-[#6b7c5a]">
                                                    Delete this request?
                                                </span>
                                                <button
                                                    onClick={() => handleDelete(l._id)}
                                                    disabled={isLoading}
                                                    className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-2.5 py-1 rounded-md disabled:opacity-50 transition-colors"
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirmId(null)}
                                                    className="text-xs font-medium text-[#6b7c5a] bg-[#f0f4ea] px-2.5 py-1 rounded-md"
                                                >
                                                    No
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setDeleteConfirmId(l._id)}
                                                disabled={isLoading}
                                                className="text-xs font-medium text-[#6b7c5a] hover:text-red-600 bg-[#f0f4ea] hover:bg-red-50 border border-transparent hover:border-red-200 px-3 py-1.5 rounded-lg disabled:opacity-50 transition-all"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block bg-white border border-[#cfdbbf] rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16 text-sm text-[#6b7c5a]">
                        Loading…
                    </div>
                ) : filtered.length === 0 ? (
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
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <p className="text-sm text-[#8fa07a]">No leaves found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#f5f7f2] border-b border-[#cfdbbf]">
                                <tr>
                                    <th className={thClass}>Type</th>
                                    <th className={thClass}>From</th>
                                    <th className={thClass}>To</th>
                                    <th className={thClass}>Days</th>
                                    <th className={thClass}>Status</th>
                                    <th className={thClass}>Submitted</th>
                                    <th className={thClass}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((l) => {
                                    const isLoading = actionLoading === l._id;
                                    const confirming = deleteConfirmId === l._id;
                                    return (
                                        <tr
                                            key={l._id}
                                            className="border-b border-[#e8eedf] last:border-0 hover:bg-[#fafcf7] transition-colors"
                                        >
                                            <td className={tdClass}>
                                                <span className="font-medium capitalize">
                                                    {l.leaveType}
                                                </span>
                                                {l.reason && (
                                                    <p className="text-xs text-[#8fa07a] truncate max-w-[160px]">
                                                        {l.reason}
                                                    </p>
                                                )}
                                            </td>
                                            <td className={`${tdClass} text-[#6b7c5a]`}>
                                                {fmt(l.startDate)}
                                            </td>
                                            <td className={`${tdClass} text-[#6b7c5a]`}>
                                                {fmt(l.endDate)}
                                            </td>
                                            <td className={`${tdClass} text-[#6b7c5a]`}>
                                                {l.totalDays}
                                            </td>
                                            <td className={tdClass}>
                                                <div>
                                                    <Badge status={l.status} />
                                                    {l.rejectionReason && (
                                                        <p className="text-xs text-red-500 mt-1 max-w-[160px] truncate">
                                                            {l.rejectionReason}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className={`${tdClass} text-[#6b7c5a]`}>
                                                {fmt(l.createdAt)}
                                            </td>
                                            <td className={tdClass}>
                                                {l.status === "pending" &&
                                                    (confirming ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-[#6b7c5a]">
                                                                Delete?
                                                            </span>
                                                            <button
                                                                onClick={() => handleDelete(l._id)}
                                                                disabled={isLoading}
                                                                className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-2.5 py-1 rounded-md disabled:opacity-50 transition-colors"
                                                            >
                                                                Yes
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    setDeleteConfirmId(null)
                                                                }
                                                                className="text-xs font-medium text-[#6b7c5a] bg-[#f0f4ea] px-2.5 py-1 rounded-md"
                                                            >
                                                                No
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                setDeleteConfirmId(l._id)
                                                            }
                                                            disabled={isLoading}
                                                            className="text-xs font-medium text-[#6b7c5a] hover:text-red-600 bg-[#f0f4ea] hover:bg-red-50 border border-transparent hover:border-red-200 px-3 py-1.5 rounded-lg disabled:opacity-50 transition-all"
                                                        >
                                                            Delete
                                                        </button>
                                                    ))}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <RequestLeaveModal
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                />
            )}
        </div>
    );
};

export default MyLeavesPage;
