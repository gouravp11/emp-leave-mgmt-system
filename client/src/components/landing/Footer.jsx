import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-[#2d3a22] text-[#8fa07a] py-16 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-[#d4dfc7] rounded-md flex items-center justify-center">
                                <span className="text-[#2d3a22] font-bold text-sm">EL</span>
                            </div>
                            <span className="font-semibold text-[#e8eedf] text-lg tracking-tight">
                                LeaveSync
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed max-w-xs font-light">
                            A modern leave and reimbursement management system built for teams of
                            all sizes.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-xs font-semibold text-[#d4dfc7] uppercase tracking-widest mb-5">
                            Product
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a
                                    href="#features"
                                    className="hover:text-[#d4dfc7] transition-colors"
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#how-it-works"
                                    className="hover:text-[#d4dfc7] transition-colors"
                                >
                                    How it works
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-semibold text-[#d4dfc7] uppercase tracking-widest mb-5">
                            Account
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link
                                    to="/login"
                                    className="hover:text-[#d4dfc7] transition-colors"
                                >
                                    Log in
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/register"
                                    className="hover:text-[#d4dfc7] transition-colors"
                                >
                                    Register
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-[#3d4f2f] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <p>&copy; {new Date().getFullYear()} LeaveSync. All rights reserved.</p>
                    <p className="text-[#5a6e47]">Built with React &amp; Tailwind CSS</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
