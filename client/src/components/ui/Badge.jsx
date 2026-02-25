/**
 * Status badge pill.
 * Supports: pending | approved | rejected | cancelled | paid | employee | manager
 */
const palette = {
    pending: { bg: "#fef9c3", text: "#854d0e", dot: "#eab308" },
    approved: { bg: "#dcfce7", text: "#166534", dot: "#22c55e" },
    rejected: { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
    cancelled: { bg: "#f1f5f9", text: "#475569", dot: "#94a3b8" },
    paid: { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
    employee: { bg: "#e8eedf", text: "#3d4f2f", dot: "#6b7c5a" },
    manager: { bg: "#fdf4e7", text: "#92400e", dot: "#f59e0b" }
};

const Badge = ({ status }) => {
    const key = status?.toLowerCase() ?? "pending";
    const { bg, text, dot } = palette[key] ?? palette.cancelled;

    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: bg, color: text }}
        >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dot }} />
            {key.charAt(0).toUpperCase() + key.slice(1)}
        </span>
    );
};

export default Badge;
