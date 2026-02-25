import { useState } from "react";
import { useReimbursements } from "../../context/ReimbursementsContext";
import PageHeader from "../../components/ui/PageHeader";
import Badge from "../../components/ui/Badge";

const TABS = ["All", "Pending", "Approved", "Paid", "Rejected"];

const CATEGORY_LABELS = {
    travel: "Travel",
    food: "Food",
    medical: "Medical",
    fuel: "Fuel",
    other: "Other"
};

const ReimbursementsPage = () => {
    const { reimbursements, loading, actionLoading, error, markPaid } = useReimbursements();
    const [tab, setTab] = useState("All");
    const [payConfirmId, setPayConfirmId] = useState(null);

    const filtered = reimbursements.filter((r) =>
        tab === "All" ? true : r.status.toLowerCase() === tab.toLowerCase()
    );

    const handleMarkPaid = async (id) => {
        await markPaid(id);
        setPayConfirmId(null);
    };

    const formatDate = (d) =>
        new Date(d).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });

    const formatAmount = (n) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2
        }).format(n);

    const thClass =
        "text-left text-xs font-semibold text-[#6b7c5a] uppercase tracking-wider px-4 py-3";
    const tdClass = "px-4 py-3.5 text-sm text-[#2d3a22]";

    return (
        <div>
            <PageHeader
                title="Reimbursements"
                subtitle="All reimbursement requests across the organisation."
            />

            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Tabs — scrollable on small screens */}
            <div className="flex gap-1 mb-4 bg-white border border-[#cfdbbf] rounded-lg p-1 w-fit max-w-full overflow-x-auto">
                {TABS.map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={[
                            "px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                            tab === t
                                ? "bg-[#3d4f2f] text-white"
                                : "text-[#6b7c5a] hover:text-[#2d3a22] hover:bg-[#f0f4ea]"
                        ].join(" ")}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden flex flex-col gap-2">
                {loading ? (
                    <div className="bg-white border border-[#cfdbbf] rounded-xl flex items-center justify-center py-14 text-sm text-[#6b7c5a]">
                        Loading reimbursements…
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white border border-[#cfdbbf] rounded-xl flex items-center justify-center py-14 text-sm text-[#8fa07a]">
                        No reimbursements found.
                    </div>
                ) : (
                    filtered.map((r) => {
                        const isLoading = actionLoading === r._id;
                        return (
                            <div
                                key={r._id}
                                className="bg-white border border-[#cfdbbf] rounded-xl p-4"
                            >
                                {/* Name + status */}
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-[#2d3a22] truncate">
                                            {r.requesterId?.name ?? "—"}
                                        </p>
                                        <p className="text-xs text-[#8fa07a] truncate">
                                            {r.requesterId?.email ?? ""}
                                        </p>
                                    </div>
                                    <Badge status={r.status} />
                                </div>
                                {/* Category · Amount */}
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-xs font-medium text-[#4a5c38] bg-[#f0f4ea] px-2 py-0.5 rounded-md">
                                        {CATEGORY_LABELS[r.category] ?? r.category}
                                    </span>
                                    <span className="text-sm font-semibold text-[#2d3a22]">
                                        {formatAmount(r.amount)}
                                    </span>
                                </div>
                                {/* Description */}
                                {r.description && (
                                    <p className="text-xs text-[#6b7c5a] line-clamp-1 mb-3">
                                        {r.description}
                                    </p>
                                )}
                                {/* Footer: submitted + action */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-[#a8b89a]">
                                        Submitted {formatDate(r.createdAt)}
                                    </span>
                                    {r.status === "approved" &&
                                        (payConfirmId === r._id ? (
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="text-[#6b7c5a]">Mark paid?</span>
                                                <button
                                                    onClick={() => handleMarkPaid(r._id)}
                                                    disabled={isLoading}
                                                    className="text-[#3d4f2f] font-medium hover:underline disabled:opacity-50"
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    onClick={() => setPayConfirmId(null)}
                                                    className="text-[#6b7c5a] hover:underline"
                                                >
                                                    No
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setPayConfirmId(r._id)}
                                                disabled={isLoading}
                                                className="text-xs font-medium text-white bg-[#3d4f2f] hover:bg-[#2d3a22] px-2.5 py-1 rounded-md disabled:opacity-50 transition-colors"
                                            >
                                                Mark Paid
                                            </button>
                                        ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block bg-white border border-[#cfdbbf] rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16 text-sm text-[#6b7c5a]">
                        Loading reimbursements…
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex items-center justify-center py-16 text-sm text-[#8fa07a]">
                        No reimbursements found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#f5f7f2] border-b border-[#cfdbbf]">
                                <tr>
                                    <th className={thClass}>Employee</th>
                                    <th className={thClass}>Category</th>
                                    <th className={thClass}>Amount</th>
                                    <th className={thClass}>Description</th>
                                    <th className={thClass}>Status</th>
                                    <th className={thClass}>Submitted</th>
                                    <th className={thClass}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((r) => {
                                    const isLoading = actionLoading === r._id;

                                    return (
                                        <tr
                                            key={r._id}
                                            className="border-b border-[#e8eedf] last:border-0 hover:bg-[#fafcf7] transition-colors"
                                        >
                                            <td className={tdClass}>
                                                <div>
                                                    <p className="font-medium">
                                                        {r.requesterId?.name ?? "—"}
                                                    </p>
                                                    <p className="text-xs text-[#8fa07a]">
                                                        {r.requesterId?.email ?? ""}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className={tdClass}>
                                                {CATEGORY_LABELS[r.category] ?? r.category}
                                            </td>
                                            <td className={tdClass}>
                                                <span className="font-medium">
                                                    {formatAmount(r.amount)}
                                                </span>
                                            </td>
                                            <td
                                                className={`${tdClass} text-[#6b7c5a] max-w-[200px]`}
                                            >
                                                <span className="line-clamp-1">
                                                    {r.description || "—"}
                                                </span>
                                            </td>
                                            <td className={tdClass}>
                                                <Badge status={r.status} />
                                            </td>
                                            <td className={`${tdClass} text-[#6b7c5a]`}>
                                                {formatDate(r.createdAt)}
                                            </td>
                                            <td className={tdClass}>
                                                {r.status === "approved" ? (
                                                    payConfirmId === r._id ? (
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <span className="text-[#6b7c5a]">
                                                                Mark paid?
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    handleMarkPaid(r._id)
                                                                }
                                                                disabled={isLoading}
                                                                className="text-[#3d4f2f] font-medium hover:underline disabled:opacity-50"
                                                            >
                                                                Yes
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    setPayConfirmId(null)
                                                                }
                                                                className="text-[#6b7c5a] hover:underline"
                                                            >
                                                                No
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setPayConfirmId(r._id)}
                                                            disabled={isLoading}
                                                            className="text-xs font-medium text-white bg-[#3d4f2f] hover:bg-[#2d3a22] px-2.5 py-1 rounded-md disabled:opacity-50 transition-colors"
                                                        >
                                                            Mark Paid
                                                        </button>
                                                    )
                                                ) : (
                                                    <span className="text-xs text-[#8fa07a]">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReimbursementsPage;
