import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await login(form);
            const roleRoutes = {
                admin: "/dashboard",
                manager: "/manager-dashboard",
                employee: "/employee-dashboard"
            };
            navigate(roleRoutes[data.user.role] ?? "/");
        } catch (err) {
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left panel */}
            <div className="hidden lg:flex flex-col justify-between w-[42%] bg-[#d4dfc7] px-14 py-12">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#3d4f2f] rounded-md flex items-center justify-center">
                        <span className="text-[#d4dfc7] font-bold text-sm">EL</span>
                    </div>
                    <span className="font-semibold text-[#2d3a22] text-lg tracking-tight">
                        LeaveSync
                    </span>
                </Link>

                <div>
                    <h1 className="text-4xl text-[#2d3a22] leading-snug mb-4">
                        Manage leaves &amp; expenses, effortlessly.
                    </h1>
                    <p className="text-[#4a5c38] font-light leading-relaxed max-w-sm">
                        One place for your whole team — submit requests, review approvals, and track
                        everything in real time.
                    </p>
                </div>

                <div />
            </div>

            {/* Right panel */}
            <div className="flex-1 flex flex-col bg-[#f5f7f2]">
                {/* Mobile logo */}
                <div className="lg:hidden px-8 pt-8">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#3d4f2f] rounded-md flex items-center justify-center">
                            <span className="text-[#d4dfc7] font-bold text-sm">EL</span>
                        </div>
                        <span className="font-semibold text-[#2d3a22] text-lg tracking-tight">
                            LeaveSync
                        </span>
                    </Link>
                </div>

                <div className="flex-1 flex items-center justify-center px-8 py-12">
                    <div className="w-full max-w-sm">
                        <h2 className="text-3xl text-[#2d3a22] mb-1">Welcome back</h2>
                        <p className="text-sm text-[#6b7c5a] font-light mb-8">
                            Sign in to your account to continue.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Error */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-md">
                                    {error}
                                </div>
                            )}

                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-[#4a5c38] uppercase tracking-wider">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="you@company.com"
                                    className="bg-white border border-[#cfdbbf] rounded-md px-4 py-2.5 text-sm text-[#2d3a22] placeholder-[#a8b89a] outline-none focus:border-[#5a7040] focus:ring-2 focus:ring-[#5a7040]/10 transition"
                                />
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-[#4a5c38] uppercase tracking-wider">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="bg-white border border-[#cfdbbf] rounded-md px-4 py-2.5 text-sm text-[#2d3a22] placeholder-[#a8b89a] outline-none focus:border-[#5a7040] focus:ring-2 focus:ring-[#5a7040]/10 transition"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 bg-[#3d4f2f] hover:bg-[#2d3a22] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm py-2.5 rounded-md transition-colors"
                            >
                                {loading ? "Signing in…" : "Sign in"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-[#6b7c5a]">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-[#3d4f2f] font-medium hover:underline"
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
