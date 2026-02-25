import { useEffect, useRef, useState } from "react";

/**
 * Custom themed dropdown.
 *
 * Props:
 *  - name       {string}   — form field name, passed back in the synthetic event
 *  - value      {string}   — currently selected value
 *  - onChange   {fn}       — called with a synthetic { target: { name, value } } event
 *  - options    {Array}    — [{ label, value }]
 *  - placeholder {string}  — shown when nothing is selected
 *  - disabled   {boolean}
 */
const Select = ({
    name,
    value,
    onChange,
    options = [],
    placeholder = "Select…",
    disabled = false
}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const selected = options.find((o) => o.value === value);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSelect = (optValue) => {
        onChange({ target: { name, value: optValue } });
        setOpen(false);
    };

    return (
        <div ref={ref} className="relative">
            {/* Trigger */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setOpen((o) => !o)}
                className={[
                    "w-full bg-white border rounded-md px-4 py-2.5 text-sm flex items-center justify-between gap-2 outline-none transition",
                    open
                        ? "border-[#5a7040] ring-2 ring-[#5a7040]/10"
                        : "border-[#cfdbbf] hover:border-[#a8b89a]",
                    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                ].join(" ")}
            >
                <span className={selected ? "text-[#2d3a22]" : "text-[#a8b89a]"}>
                    {selected ? selected.label : placeholder}
                </span>
                <svg
                    className={`w-4 h-4 text-[#6b7c5a] shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-30 w-full mt-1 bg-white border border-[#cfdbbf] rounded-md shadow-lg overflow-hidden">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleSelect(opt.value)}
                            className={[
                                "w-full px-4 py-2.5 text-left text-sm transition-colors",
                                value === opt.value
                                    ? "bg-[#e8eedf] text-[#2d3a22] font-medium"
                                    : "text-[#4a5c38] hover:bg-[#f0f4ea]"
                            ].join(" ")}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Select;
