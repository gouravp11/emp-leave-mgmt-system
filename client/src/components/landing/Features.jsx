const features = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
        ),
        title: "Leave Management",
        description:
            "Submit casual, sick, earned, or unpaid leave requests in seconds. Track status in real time and get notified on every update."
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                />
            </svg>
        ),
        title: "Reimbursements",
        description:
            "Attach receipts, specify categories, and submit expense claims. Track from submitted through approved to paid  all in one place."
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
            </svg>
        ),
        title: "Team Management",
        description:
            "Managers get a clear view of their team's requests. Approve or reject with context, and keep your team moving without bottlenecks."
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
            </svg>
        ),
        title: "Role-based Access",
        description:
            "Three distinct roles  employee, manager, and admin  each with the right level of access. No over-sharing, no confusion."
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
        ),
        title: "Receipt Uploads",
        description:
            "Upload up to 5 JPG, PNG, or PDF receipts per reimbursement claim. Files are securely stored and accessible to approvers."
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
            </svg>
        ),
        title: "Admin Overview",
        description:
            "Admins see everything  all leaves, reimbursements, and users. Approve accounts, assign managers, and keep the org in order."
    }
];

const Features = () => {
    return (
        <section id="features" className="py-24 px-6 bg-white border-t border-[#cfdbbf]">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-xs font-semibold text-[#5a7040] uppercase tracking-widest mb-3">
                        Features
                    </p>
                    <h2 className="text-4xl text-[#2d3a22] mb-4">Everything your team needs</h2>
                    <p className="text-[#6b7c5a] max-w-xl mx-auto font-light">
                        From submitting a leave request to processing reimbursements, every workflow
                        is covered and visible to the right people.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map(({ icon, title, description }) => (
                        <div
                            key={title}
                            className="p-6 rounded-md border border-[#cfdbbf] bg-[#fafcf7] hover:bg-[#f0f4ea] hover:border-[#b8cab0] transition-all duration-200 group"
                        >
                            <div className="w-10 h-10 rounded-md bg-[#e8eedf] flex items-center justify-center mb-5 text-[#4a5c38] group-hover:bg-[#d4dfc7] transition-colors">
                                {icon}
                            </div>
                            <h3 className="text-base font-semibold text-[#2d3a22] mb-2">{title}</h3>
                            <p className="text-sm text-[#6b7c5a] leading-relaxed font-light">
                                {description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
