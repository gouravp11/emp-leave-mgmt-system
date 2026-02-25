import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Select from "../components/ui/Select";

const RegisterPage = () => {
    const { register } = useAuth();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "employee"
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            await register({
                name: form.name,
                email: form.email,
                password: form.password,
                role: form.role
            });
            setSuccess(true);
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.");
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
                        Your team's leave &amp; expense hub.
                    </h1>
                    <p className="text-[#4a5c38] font-light leading-relaxed max-w-sm">
                        Create an account and get started once your admin approves your
                        registration.
                    </p>
                </div>

                {/* How onboarding works */}
                <div className="flex flex-col gap-3">
                    {[
                        { step: "01", text: "Register your account" },
                        { step: "02", text: "Admin reviews & approves" },
                        { step: "03", text: "Get assigned to a manager" },
                        { step: "04", text: "Start submitting requests" }
                    ].map(({ step, text }) => (
                        <div key={step} className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-[#8fa07a] tracking-widest w-5 shrink-0">
                                {step}
                            </span>
                            <span className="text-sm text-[#4a5c38]">{text}</span>
                        </div>
                    ))}
                </div>
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
                        {success ? (
                            /* Success state */
                            <div className="text-center">
                                <div className="w-14 h-14 bg-[#e8eedf] border border-[#bfcfac] rounded-full flex items-center justify-center mx-auto mb-5">
                                    <svg
                                        className="w-7 h-7 text-[#3d4f2f]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-2xl text-[#2d3a22] mb-2">Account created</h2>
                                <p className="text-sm text-[#6b7c5a] font-light max-w-xs mx-auto mb-6">
                                    Your account is pending admin approval. You'll be able to log in
                                    once it's approved.
                                </p>
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-white bg-[#3d4f2f] hover:bg-[#2d3a22] px-6 py-2.5 rounded-md transition-colors"
                                >
                                    Go to login
                                </Link>
                            </div>
                        ) : (
                            /* Registration form */
                            <>
                                <h2 className="text-3xl text-[#2d3a22] mb-1">Create an account</h2>
                                <p className="text-sm text-[#6b7c5a] font-light mb-8">
                                    Fill in the details below to get started.
                                </p>

                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    {/* Error */}
                                    {error && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-md">
                                            {error}
                                        </div>
                                    )}

                                    {/* Name */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-[#4a5c38] uppercase tracking-wider">
                                            Full name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Jane Smith"
                                            className="bg-white border border-[#cfdbbf] rounded-md px-4 py-2.5 text-sm text-[#2d3a22] placeholder-[#a8b89a] outline-none focus:border-[#5a7040] focus:ring-2 focus:ring-[#5a7040]/10 transition"
                                        />
                                    </div>

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

                                    {/* Role */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-[#4a5c38] uppercase tracking-wider">
                                            Role
                                        </label>
                                        <Select
                                            name="role"
                                            value={form.role}
                                            onChange={handleChange}
                                            options={[
                                                { label: "Employee", value: "employee" },
                                                { label: "Manager", value: "manager" }
                                            ]}
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

                                    {/* Confirm password */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-[#4a5c38] uppercase tracking-wider">
                                            Confirm password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={form.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            placeholder="••••••••"
                                            className="bg-white border border-[#cfdbbf] rounded-md px-4 py-2.5 text-sm text-[#2d3a22] placeholder-[#a8b89a] outline-none focus:border-[#5a7040] focus:ring-2 focus:ring-[#5a7040]/10 transition"
                                        />
                                    </div>

                                    {/* Pending notice */}
                                    <div className="flex items-start gap-2.5 bg-[#e8eedf] border border-[#cfdbbf] rounded-md px-4 py-3">
                                        <svg
                                            className="w-4 h-4 text-[#5a7040] mt-0.5 shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <p className="text-xs text-[#4a5c38] leading-relaxed">
                                            Your account will be <strong>pending</strong> until an
                                            admin approves it and assigns you to a manager.
                                        </p>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="mt-1 bg-[#3d4f2f] hover:bg-[#2d3a22] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm py-2.5 rounded-md transition-colors"
                                    >
                                        {loading ? "Creating account…" : "Create account"}
                                    </button>
                                </form>

                                <p className="mt-6 text-center text-sm text-[#6b7c5a]">
                                    Already have an account?{" "}
                                    <Link
                                        to="/login"
                                        className="text-[#3d4f2f] font-medium hover:underline"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
