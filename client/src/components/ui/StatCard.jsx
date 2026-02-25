/**
 * Reusable stat card for dashboards.
 *
 * Props:
 *  - title   {string}
 *  - value   {string | number}
 *  - subtitle {string}  — optional helper text below value
 *  - icon    {JSX}      — icon element
 *  - accent  {string}   — hex color for icon bg (defaults to sage)
 */
const StatCard = ({ title, value, subtitle, icon, accent = "#e8eedf" }) => {
    return (
        <div className="bg-white border border-[#cfdbbf] rounded-xl px-5 py-5 flex items-start gap-4 transition-colors">
            <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: accent }}
            >
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-xs font-semibold text-[#6b7c5a] uppercase tracking-wider mb-1">
                    {title}
                </p>
                <p className="text-2xl font-semibold text-[#2d3a22] leading-none">{value}</p>
                {subtitle && <p className="text-xs text-[#8fa07a] mt-1">{subtitle}</p>}
            </div>
        </div>
    );
};

export default StatCard;
