const steps = [
    {
        step: "01",
        title: "Register & get approved",
        description:
            "Create an account in under a minute. Your admin reviews and approves it, then assigns you to a manager so you're ready to go.",
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
            </svg>
        )
    },
    {
        step: "02",
        title: "Submit your requests",
        description:
            "Apply for leaves by type and date range, or submit reimbursement claims with receipts. Your manager is notified immediately.",
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
        )
    },
    {
        step: "03",
        title: "Manager reviews & decides",
        description:
            "Your manager approves or rejects with a note. For reimbursements, once approved, the admin marks it as paid.",
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
        )
    }
];

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 px-6 bg-[#e8eedf]">
            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <p className="text-xs font-semibold text-[#5a7040] uppercase tracking-widest mb-3">
                        How it works
                    </p>
                    <h2 className="text-4xl text-[#2d3a22] mb-4">Up and running in 3 steps</h2>
                    <p className="text-[#6b7c5a] max-w-lg mx-auto font-light">
                        Simple enough for every employee, powerful enough for admins managing an
                        entire org.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {/* Connector line — desktop only */}
                    <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-[#bfcfac] z-0"></div>

                    {steps.map(({ step, title, description, icon }, idx) => (
                        <div
                            key={step}
                            className="relative z-10 bg-white border border-[#cfdbbf] rounded-md p-8 flex flex-col items-center text-center"
                        >
                            {/* Step icon */}
                            <div className="w-16 h-16 rounded-md bg-[#e8eedf] border border-[#bfcfac] flex items-center justify-center text-[#4a5c38] mb-5">
                                {icon}
                            </div>

                            {/* Step number */}
                            <span className="text-xs font-bold text-[#8fa07a] tracking-widest mb-2">
                                {step}
                            </span>

                            <h3 className="text-lg font-semibold text-[#2d3a22] mb-3">{title}</h3>
                            <p className="text-sm text-[#6b7c5a] leading-relaxed font-light">
                                {description}
                            </p>

                            {/* Arrow between steps — mobile */}
                            {idx < steps.length - 1 && (
                                <div className="md:hidden mt-6 text-[#bfcfac]">
                                    <svg
                                        className="w-5 h-5 mx-auto"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
