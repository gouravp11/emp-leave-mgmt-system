import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#d4dfc7] border-b border-[#bfcfac]">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#3d4f2f] rounded-lg flex items-center justify-center">
                        <span className="text-[#d4dfc7] font-bold text-sm">EL</span>
                    </div>
                    <span className="font-semibold text-[#2d3a22] text-lg tracking-tight">
                        LeaveSync
                    </span>
                </Link>

                {/* Desktop nav links */}
                <div className="hidden md:flex items-center gap-8">
                    <a
                        href="#features"
                        className="text-sm text-[#4a5c38] hover:text-[#2d3a22] font-medium transition-colors"
                    >
                        Features
                    </a>
                    <a
                        href="#how-it-works"
                        className="text-sm text-[#4a5c38] hover:text-[#2d3a22] font-medium transition-colors"
                    >
                        How it works
                    </a>
                </div>

                {/* CTA buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        to="/login"
                        className="text-sm font-medium text-[#4a5c38] hover:text-[#2d3a22] transition-colors px-4 py-2"
                    >
                        Log in
                    </Link>
                    <Link
                        to="/register"
                        className="text-sm font-medium text-white bg-[#3d4f2f] hover:bg-[#2d3a22] transition-colors px-5 py-2 rounded-md"
                    >
                        Get started
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden p-2 rounded-md text-[#4a5c38] hover:text-[#2d3a22]"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-label="Toggle menu"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {menuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden bg-[#d4dfc7] border-t border-[#bfcfac] px-6 pb-4 flex flex-col gap-3">
                    <a
                        href="#features"
                        onClick={() => setMenuOpen(false)}
                        className="text-sm text-[#4a5c38] font-medium py-2"
                    >
                        Features
                    </a>
                    <a
                        href="#how-it-works"
                        onClick={() => setMenuOpen(false)}
                        className="text-sm text-[#4a5c38] font-medium py-2"
                    >
                        How it works
                    </a>
                    <Link to="/login" className="text-sm font-medium text-[#4a5c38] py-2">
                        Log in
                    </Link>
                    <Link
                        to="/register"
                        className="text-sm font-medium text-white bg-[#3d4f2f] rounded-md px-4 py-2 text-center"
                    >
                        Get started
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
