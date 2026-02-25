import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <section className="pt-32 pb-20 px-6 bg-[#f5f7f2]">
            <div className="max-w-6xl mx-auto">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-[#e8eedf] border border-[#cfdbbf] rounded-full px-4 py-1.5 mb-8">
                        <span className="w-2 h-2 bg-[#5a7040] rounded-full"></span>
                        <span className="text-xs font-medium text-[#4a5c38]">
                            Streamline your workforce
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-6xl text-[#2d3a22] leading-tight mb-6">
                        Leave &amp; reimbursement
                        <span className="text-[#5a7040]"> made simple</span>
                    </h1>

                    {/* Subtext */}
                    <p className="text-lg text-[#6b7c5a] leading-relaxed mb-10 max-w-xl mx-auto font-light">
                        One platform for employees to submit requests, managers to review them, and
                        admins to keep everything running smoothly.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto px-8 py-3.5 bg-[#3d4f2f] hover:bg-[#2d3a22] text-white font-medium rounded-md transition-colors"
                        >
                            Get started for free
                        </Link>
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-[#e8eedf] text-[#3d4f2f] font-medium rounded-md transition-colors border border-[#cfdbbf]"
                        >
                            Log in
                        </Link>
                    </div>
                </div>

                {/* Hero visual — mock dashboard */}
                <div className="mt-20">
                    <div className="bg-white rounded-lg shadow-xl border border-[#cfdbbf] overflow-hidden">
                        {/* Mock top bar */}
                        <div className="bg-[#d4dfc7] px-6 py-3.5 flex items-center justify-between border-b border-[#bfcfac]">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-[#3d4f2f] rounded flex items-center justify-center">
                                    <span className="text-[#d4dfc7] text-xs font-bold">EL</span>
                                </div>
                                <span className="text-sm font-semibold text-[#2d3a22]">
                                    LeaveSync
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-[#4a5c38] font-medium hidden sm:block">
                                    Welcome back, Emilia
                                </span>
                                <div className="w-7 h-7 rounded-full bg-[#3d4f2f] flex items-center justify-center text-xs text-white font-semibold">
                                    E
                                </div>
                            </div>
                        </div>

                        {/* Mock content */}
                        <div className="flex bg-[#f5f7f2] min-h-60">
                            {/* Sidebar */}
                            <div className="hidden md:flex flex-col w-44 bg-[#f5f7f2] border-r border-[#cfdbbf] py-5 px-4 gap-1 shrink-0">
                                {[
                                    { label: "Dashboard", active: true },
                                    { label: "My Leaves" },
                                    { label: "My Reimbursements" },
                                    { label: "My Team" }
                                ].map(({ label, active }) => (
                                    <div
                                        key={label}
                                        className={`text-xs px-3 py-2 rounded-md font-medium ${
                                            active
                                                ? "bg-[#d4dfc7] text-[#2d3a22]"
                                                : "text-[#6b7c5a] hover:bg-[#e8eedf]"
                                        }`}
                                    >
                                        {label}
                                    </div>
                                ))}
                                <div className="mt-auto pt-4 border-t border-[#cfdbbf]">
                                    <button className="flex items-center gap-2 text-xs text-[#6b7c5a] hover:text-[#2d3a22] transition-colors w-full">
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.75}
                                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                            />
                                        </svg>
                                        Log out
                                    </button>
                                </div>
                            </div>

                            {/* Main content */}
                            <div className="flex-1 p-5 md:p-7">
                                <h2 className="text-xl text-[#2d3a22] mb-5">Welcome!</h2>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                                    {[
                                        {
                                            label: "Pending Leaves",
                                            value: "3",
                                            positive: false,
                                            neutral: true
                                        },
                                        { label: "Approved", value: "12", positive: true },
                                        {
                                            label: "Reimbursements",
                                            value: "5",
                                            positive: false,
                                            neutral: true
                                        },
                                        { label: "Team Size", value: "8", positive: true }
                                    ].map(({ label, value, positive, neutral }) => (
                                        <div
                                            key={label}
                                            className="bg-white border border-[#cfdbbf] rounded-md p-4"
                                        >
                                            <div
                                                className={`text-2xl font-bold mb-1 ${neutral ? "text-[#2d3a22]" : positive ? "text-[#3d6b2e]" : "text-[#2d3a22]"}`}
                                            >
                                                {value}
                                            </div>
                                            <div className="text-[11px] text-[#8fa07a] font-medium">
                                                {label}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Table */}
                                <div className="bg-white border border-[#cfdbbf] rounded-md overflow-hidden">
                                    <div className="px-4 py-3 border-b border-[#e8eedf] flex justify-between items-center">
                                        <span className="text-xs font-semibold text-[#2d3a22]">
                                            Recent Leave Requests
                                        </span>
                                        <span className="text-[11px] text-[#5a7040] font-medium">
                                            View all
                                        </span>
                                    </div>
                                    {[
                                        {
                                            name: "Alex Chen",
                                            type: "Sick leave",
                                            status: "pending",
                                            days: "3 days"
                                        },
                                        {
                                            name: "Maya Patel",
                                            type: "Casual leave",
                                            status: "approved",
                                            days: "1 day"
                                        },
                                        {
                                            name: "Jordan Lee",
                                            type: "Earned leave",
                                            status: "approved",
                                            days: "5 days"
                                        }
                                    ].map(({ name, type, status, days }) => (
                                        <div
                                            key={name}
                                            className="px-4 py-3 flex items-center justify-between border-b border-[#f0f4ea] last:border-0"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 bg-[#e8eedf] rounded-full flex items-center justify-center text-xs font-semibold text-[#4a5c38]">
                                                    {name[0]}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-medium text-[#2d3a22]">
                                                        {name}
                                                    </div>
                                                    <div className="text-[11px] text-[#8fa07a]">
                                                        {type}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[11px] text-[#8fa07a] hidden sm:block">
                                                    {days}
                                                </span>
                                                <span
                                                    className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                                                        status === "pending"
                                                            ? "bg-[#fef3cd] text-[#7a5c1a]"
                                                            : "bg-[#e4edd8] text-[#3d6b2e]"
                                                    }`}
                                                >
                                                    {status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
