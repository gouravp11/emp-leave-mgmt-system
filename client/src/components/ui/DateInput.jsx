/**
 * Themed date input.
 * Hides the browser's native calendar icon and renders a custom one.
 * The native date picker still opens on click so all platform date pickers work.
 *
 * Props: all standard <input type="date"> props (name, value, onChange, min, max, required, disabled…)
 */
const DateInput = ({ className = "", disabled = false, ...props }) => {
    return (
        <div className="relative">
            <input
                type="date"
                disabled={disabled}
                className={[
                    "w-full bg-white border border-[#cfdbbf] rounded-md px-4 py-2.5 pr-10 text-sm text-[#2d3a22] outline-none transition",
                    "focus:border-[#5a7040] focus:ring-2 focus:ring-[#5a7040]/10",
                    "hover:border-[#a8b89a]",
                    // Hide the native calendar icon but keep it clickable as a hit area
                    "[&::-webkit-calendar-picker-indicator]:opacity-0",
                    "[&::-webkit-calendar-picker-indicator]:absolute",
                    "[&::-webkit-calendar-picker-indicator]:inset-0",
                    "[&::-webkit-calendar-picker-indicator]:w-full",
                    "[&::-webkit-calendar-picker-indicator]:h-full",
                    "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
                    disabled ? "opacity-50 cursor-not-allowed" : "",
                    className
                ].join(" ")}
                {...props}
            />
            {/* Custom calendar icon — pointer-events-none so clicks pass through to the input */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                    className="w-4 h-4 text-[#6b7c5a]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            </div>
        </div>
    );
};

export default DateInput;
