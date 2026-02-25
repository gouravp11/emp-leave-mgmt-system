import { useState } from "react";
import { useLeaves } from "../../context/LeavesContext";
import PageHeader from "../../components/ui/PageHeader";
import Badge from "../../components/ui/Badge";

const TABS = ["All", "Pending", "Approved", "Rejected", "Cancelled"];

const LeavesPage = () => {
    const { leaves, loading, actionLoading, error, cancelLeave } = useLeaves();
    const [tab, setTab] = useState("All");
    const [cancelConfirmId, setCancelConfirmId] = useState(null);

    const filtered = leaves.filter((l) =>
        tab === "All" ? true : l.status.toLowerCase() === tab.toLowerCase()
    );

    const handleCancel = async (leaveId) => {
        await cancelLeave(leaveId);
        setCancelConfirmId(null);
    };

    const formatDate = (d) =>
        new Date(d).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });

    const TYPE_LABELS = { casual: "Casual", sick: "Sick", earned: "Earned", unpaid: "Unpaid" };

    const thClass =
        "text-left text-xs font-semibold text-[#6b7c5a] uppercase tracking-wider px-4 py-3";
    const tdClass = "px-4 py-3.5 text-sm text-[#2d3a22]";

    return (
        <div>
            <PageHeader
                title="Leave Requests"
                subtitle="All leave requests across the organisation."
            />

            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Tabs */}
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
                        Loading leaves…
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white border border-[#cfdbbf] rounded-xl flex items-center justify-center py-14 text-sm text-[#8fa07a]">
                        No leave requests found.
                    </div>
                ) : (
                    filtered.map((leave) => {
                        const isLoading = actionLoading === leave._id;
                        const canAct = leave.status !== "cancelled" && leave.status !== "rejected";
                        return (
                            <div
                                key={leave._id}
                                className="bg-white border border-[#cfdbbf] rounded-xl p-4"
                            >
                                {/* Name + status */}
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-[#2d3a22] truncate">
                                            {leave.requesterId?.name ?? "—"}
                                        </p>
                                        <p className="text-xs text-[#8fa07a] truncate">
                                            {leave.requesterId?.email ?? ""}
                                        </p>
                                    </div>
                                    <Badge status={leave.status} />
                                </div>
                                {/* Type · days · date range */}
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#6b7c5a] mb-3">
                                    <span className="font-medium text-[#4a5c38]">
                                        {TYPE_LABELS[leave.leaveType] ?? leave.leaveType}
                                    </span>
                                    <span className="text-[#cfdbbf]">·</span>
                                    <span>
                                        {leave.totalDays} {leave.totalDays === 1 ? "day" : "days"}
                                    </span>
                                    <span className="text-[#cfdbbf]">·</span>
                                    <span>
                                        {formatDate(leave.startDate)} → {formatDate(leave.endDate)}
                                    </span>
                                </div>
                                {/* Footer: submitted + action */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-[#a8b89a]">
                                        Submitted {formatDate(leave.createdAt)}
                                    </span>
                                    {canAct &&
                                        (cancelConfirmId === leave._id ? (
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="text-[#6b7c5a]">Cancel?</span>
                                                <button
                                                    onClick={() => handleCancel(leave._id)}
                                                    disabled={isLoading}
                                                    className="text-red-600 font-medium hover:underline disabled:opacity-50"
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    onClick={() => setCancelConfirmId(null)}
                                                    className="text-[#6b7c5a] hover:underline"
                                                >
                                                    No
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setCancelConfirmId(leave._id)}
                                                disabled={isLoading}
                                                className="text-xs font-medium text-red-600 hover:bg-red-50 px-2.5 py-1 rounded-md disabled:opacity-50 transition-colors"
                                            >
                                                Cancel
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
                        Loading leaves…
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex items-center justify-center py-16 text-sm text-[#8fa07a]">
                        No leave requests found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#f5f7f2] border-b border-[#cfdbbf]">
                                <tr>
                                    <th className={thClass}>Employee</th>
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
                                {filtered.map((leave) => {
                                    const isLoading = actionLoading === leave._id;

                                    return (
                                        <tr
                                            key={leave._id}
                                            className="border-b border-[#e8eedf] last:border-0 hover:bg-[#fafcf7] transition-colors"
                                        >
                                            <td className={tdClass}>
                                                <div>
                                                    <p className="font-medium">
                                                        {leave.requesterId?.name ?? "—"}
                                                    </p>
                                                    <p className="text-xs text-[#8fa07a]">
                                                        {leave.requesterId?.email ?? ""}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className={tdClass}>
                                                {TYPE_LABELS[leave.leaveType] ?? leave.leaveType}
                                            </td>
                                            <td className={`${tdClass} text-[#6b7c5a]`}>
                                                {formatDate(leave.startDate)}
                                            </td>
                                            <td className={`${tdClass} text-[#6b7c5a]`}>
                                                {formatDate(leave.endDate)}
                                            </td>
                                            <td className={tdClass}>{leave.totalDays}</td>
                                            <td className={tdClass}>
                                                <Badge status={leave.status} />
                                            </td>
                                            <td className={`${tdClass} text-[#6b7c5a]`}>
                                                {formatDate(leave.createdAt)}
                                            </td>
                                            <td className={tdClass}>
                                                {leave.status !== "cancelled" &&
                                                leave.status !== "rejected" ? (
                                                    cancelConfirmId === leave._id ? (
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <span className="text-[#6b7c5a]">
                                                                Cancel?
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    handleCancel(leave._id)
                                                                }
                                                                disabled={isLoading}
                                                                className="text-red-600 font-medium hover:underline disabled:opacity-50"
                                                            >
                                                                Yes
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    setCancelConfirmId(null)
                                                                }
                                                                className="text-[#6b7c5a] hover:underline"
                                                            >
                                                                No
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                setCancelConfirmId(leave._id)
                                                            }
                                                            disabled={isLoading}
                                                            className="text-xs font-medium text-red-600 hover:bg-red-50 px-2.5 py-1 rounded-md disabled:opacity-50 transition-colors"
                                                        >
                                                            Cancel
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

export default LeavesPage;
