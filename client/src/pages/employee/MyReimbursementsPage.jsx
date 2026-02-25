import { useEffect, useRef, useState } from "react";
import { useMyReimbursements } from "../../context/MyReimbursementsContext";
import PageHeader from "../../components/ui/PageHeader";
import Badge from "../../components/ui/Badge";
import Select from "../../components/ui/Select";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const CATEGORIES = ["travel", "food", "medical", "fuel", "other"];
const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({
    label: c.charAt(0).toUpperCase() + c.slice(1),
    value: c
}));
const STATUSES = ["All", "Pending", "Approved", "Rejected", "Paid"];

// ── Submit reimbursement modal ─────────────────────────────────────────────────
const SubmitReimbursementModal = ({ onClose, onSubmit, submitting }) => {
    const fileRef = useRef(null);
    const [form, setForm] = useState({ category: "", amount: "", description: "" });
    const [files, setFiles] = useState([]);
    const [formError, setFormError] = useState("");

    const handleChange = (e) => {
        setFormError("");
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.category) return setFormError("Please select a category.");
        if (!form.amount || Number(form.amount) <= 0)
            return setFormError("Please enter a valid amount.");

        const formData = new FormData();
        formData.append("category", form.category);
        formData.append("amount", form.amount);
        if (form.description) formData.append("description", form.description);
        files.forEach((f) => formData.append("receipts", f));

        try {
            await onSubmit(formData);
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
                    <h2 className="text-base font-semibold text-[#2d3a22]">Submit Reimbursement</h2>
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
                    {/* Category */}
                    <div>
                        <label className={labelClass}>Category</label>
                        <Select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            options={CATEGORY_OPTIONS}
                            placeholder="Select category…"
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label className={labelClass}>Amount ($)</label>
                        <input
                            type="number"
                            name="amount"
                            value={form.amount}
                            onChange={handleChange}
                            min="0.01"
                            step="0.01"
                            placeholder="0.00"
                            className={inputClass}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className={labelClass}>
                            Description{" "}
                            <span className="text-[#8fa07a] font-normal">(optional)</span>
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="What was this expense for?"
                            className={`${inputClass} resize-none`}
                        />
                    </div>

                    {/* Receipt upload */}
                    <div>
                        <label className={labelClass}>
                            Receipts <span className="text-[#8fa07a] font-normal">(optional)</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="w-full flex flex-col items-center gap-2 border-2 border-dashed border-[#cfdbbf] rounded-xl py-5 px-4 text-[#8fa07a] hover:border-[#8fa07a] hover:bg-[#f5f7f2] transition-colors"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            <span className="text-xs font-medium">
                                {files.length > 0
                                    ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
                                    : "Click to upload receipts"}
                            </span>
                        </button>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*,.pdf"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
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
                            {submitting ? "Submitting…" : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ── Category chip ─────────────────────────────────────────────────────────────
const CategoryChip = ({ category }) => (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e8eedf] text-[#3d4f2f] capitalize">
        {category}
    </span>
);

// ── Page ─────────────────────────────────────────────────────────────────────
const MyReimbursementsPage = () => {
    const {
        reimbursements,
        loading,
        actionLoading,
        error,
        setError,
        submitReimbursement,
        deleteMyReimbursement
    } = useMyReimbursements();

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

    const filtered = reimbursements.filter((r) =>
        statusFilter === "All" ? true : r.status === statusFilter.toLowerCase()
    );

    const handleSubmit = async (formData) => {
        setSubmitting(true);
        try {
            await submitReimbursement(formData);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        await deleteMyReimbursement(id);
        setDeleteConfirmId(null);
    };

    const thClass =
        "text-left text-xs font-semibold text-[#6b7c5a] uppercase tracking-wider px-4 py-3";
    const tdClass = "px-4 py-3.5 text-sm text-[#2d3a22]";

    return (
        <div>
            <PageHeader
                title="My Reimbursements"
                subtitle="Submit and track your expense claims."
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
                        <span className="hidden sm:inline">Submit Expense</span>
                        <span className="sm:hidden">Submit</span>
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
            <div className="flex gap-1 mb-4 bg-white border border-[#cfdbbf] rounded-lg p-1 w-fit overflow-x-auto">
                {STATUSES.map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={[
                            "px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
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
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                        <p className="text-sm text-[#8fa07a]">No reimbursements found.</p>
                    </div>
                ) : (
                    filtered.map((r) => {
                        const isLoading = actionLoading === r._id;
                        const confirming = deleteConfirmId === r._id;
                        return (
                            <div
                                key={r._id}
                                className="bg-white border border-[#cfdbbf] rounded-xl p-4"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <CategoryChip category={r.category} />
                                    <Badge status={r.status} />
                                </div>
                                <p className="text-lg font-bold text-[#2d3a22]">
                                    ${r.amount.toFixed(2)}
                                </p>
                                {r.description && (
                                    <p className="text-xs text-[#6b7c5a] mt-1 line-clamp-2">
                                        {r.description}
                                    </p>
                                )}
                                <p className="text-xs text-[#8fa07a] mt-1">
                                    Submitted {fmt(r.createdAt)}
                                </p>
                                {r.receipts?.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {r.receipts.map((_, i) => (
                                            <a
                                                key={i}
                                                href={`/api/reimbursements/${r._id}/receipts/${i}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs font-medium text-[#3d4f2f] bg-[#e8eedf] hover:bg-[#d4dfc7] px-2.5 py-1 rounded-md transition-colors"
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
                                                        strokeWidth={2}
                                                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                                    />
                                                </svg>
                                                Receipt {i + 1}
                                            </a>
                                        ))}
                                    </div>
                                )}
                                {r.rejectionReason && (
                                    <p className="text-xs text-red-600 mt-2 bg-red-50 px-2 py-1 rounded">
                                        Reason: {r.rejectionReason}
                                    </p>
                                )}
                                {r.status === "pending" && (
                                    <div className="mt-3 pt-3 border-t border-[#e8eedf]">
                                        {confirming ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-[#6b7c5a]">
                                                    Delete this request?
                                                </span>
                                                <button
                                                    onClick={() => handleDelete(r._id)}
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
                                                onClick={() => setDeleteConfirmId(r._id)}
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
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                        <p className="text-sm text-[#8fa07a]">No reimbursements found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#f5f7f2] border-b border-[#cfdbbf]">
                                <tr>
                                    <th className={thClass}>Category</th>
                                    <th className={thClass}>Amount</th>
                                    <th className={thClass}>Description</th>
                                    <th className={thClass}>Receipts</th>
                                    <th className={thClass}>Status</th>
                                    <th className={thClass}>Submitted</th>
                                    <th className={thClass}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((r) => {
                                    const isLoading = actionLoading === r._id;
                                    const confirming = deleteConfirmId === r._id;
                                    return (
                                        <tr
                                            key={r._id}
                                            className="border-b border-[#e8eedf] last:border-0 hover:bg-[#fafcf7] transition-colors"
                                        >
                                            <td className={tdClass}>
                                                <CategoryChip category={r.category} />
                                            </td>
                                            <td className={`${tdClass} font-semibold`}>
                                                ${r.amount.toFixed(2)}
                                            </td>
                                            <td
                                                className={`${tdClass} text-[#6b7c5a] max-w-[200px]`}
                                            >
                                                <p className="truncate">{r.description || "—"}</p>
                                            </td>
                                            <td className={tdClass}>
                                                {r.receipts?.length > 0 ? (
                                                    <div className="flex flex-col gap-1">
                                                        {r.receipts.map((_, i) => (
                                                            <a
                                                                key={i}
                                                                href={`/api/reimbursements/${r._id}/receipts/${i}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 text-xs font-medium text-[#3d4f2f] hover:text-[#2d3a22] hover:underline"
                                                            >
                                                                <svg
                                                                    className="w-3 h-3 shrink-0"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                                                    />
                                                                </svg>
                                                                Receipt {i + 1}
                                                            </a>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-[#cfdbbf]">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className={tdClass}>
                                                <div>
                                                    <Badge status={r.status} />
                                                    {r.rejectionReason && (
                                                        <p className="text-xs text-red-500 mt-1 max-w-[160px] truncate">
                                                            {r.rejectionReason}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className={`${tdClass} text-[#6b7c5a]`}>
                                                {fmt(r.createdAt)}
                                            </td>
                                            <td className={tdClass}>
                                                {r.status === "pending" &&
                                                    (confirming ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-[#6b7c5a]">
                                                                Delete?
                                                            </span>
                                                            <button
                                                                onClick={() => handleDelete(r._id)}
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
                                                                setDeleteConfirmId(r._id)
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
                <SubmitReimbursementModal
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                />
            )}
        </div>
    );
};

export default MyReimbursementsPage;
