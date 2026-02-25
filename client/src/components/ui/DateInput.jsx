import { useEffect, useRef, useState } from "react";

/**
 * Fully custom calendar date picker.
 * Uses position:fixed for the popover so it is never clipped by overflow:hidden/auto ancestors
 * (e.g. scrollable modal forms).
 *
 * Fires onChange with a synthetic { target: { name, value } }  drop-in for <input type="date">.
 */

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const parseISO = (iso) => (iso ? new Date(`${iso}T00:00:00`) : null);
const toISO = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const DateInput = ({
    name,
    value = "",
    onChange,
    min,
    max,
    placeholder = "Select date",
    disabled = false
}) => {
    const triggerRef = useRef(null);
    const popoverRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0, width: 256 });

    const selected = parseISO(value);
    const minDate = parseISO(min);
    const maxDate = parseISO(max);

    const initView = () => {
        const base = selected ?? minDate ?? new Date();
        return new Date(base.getFullYear(), base.getMonth(), 1);
    };
    const [view, setView] = useState(initView);

    useEffect(() => {
        if (selected) setView(new Date(selected.getFullYear(), selected.getMonth(), 1));
    }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

    const openCalendar = () => {
        if (disabled) return;
        const rect = triggerRef.current?.getBoundingClientRect();
        if (rect) {
            setPos({ top: rect.bottom + 6, left: rect.left, width: Math.max(rect.width, 256) });
        }
        setOpen((o) => !o);
    };

    // Close on outside click or scroll
    useEffect(() => {
        if (!open) return;
        const onMouse = (e) => {
            if (!popoverRef.current?.contains(e.target) && !triggerRef.current?.contains(e.target))
                setOpen(false);
        };
        const onScroll = () => setOpen(false);
        document.addEventListener("mousedown", onMouse);
        window.addEventListener("scroll", onScroll, true);
        return () => {
            document.removeEventListener("mousedown", onMouse);
            window.removeEventListener("scroll", onScroll, true);
        };
    }, [open]);

    const prevMonth = () => setView((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1));
    const nextMonth = () => setView((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1));

    const firstDow = view.getDay();
    const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const cells = [...Array(firstDow).fill(null)];
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    const isDisabled = (d) => {
        if (!d) return true;
        const date = new Date(view.getFullYear(), view.getMonth(), d);
        if (minDate) {
            if (date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()))
                return true;
        }
        if (maxDate) {
            if (date > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()))
                return true;
        }
        return false;
    };

    const isSelected = (d) =>
        !!selected &&
        !!d &&
        selected.getDate() === d &&
        selected.getMonth() === view.getMonth() &&
        selected.getFullYear() === view.getFullYear();

    const isToday = (d) => {
        if (!d) return false;
        const t = new Date();
        return (
            t.getDate() === d &&
            t.getMonth() === view.getMonth() &&
            t.getFullYear() === view.getFullYear()
        );
    };

    const handleDay = (d) => {
        if (!d || isDisabled(d)) return;
        onChange?.({
            target: { name, value: toISO(new Date(view.getFullYear(), view.getMonth(), d)) }
        });
        setOpen(false);
    };

    const canGoPrev = !minDate || view > new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    const canGoNext = !maxDate || view < new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

    const displayValue = selected
        ? selected.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : null;

    return (
        <>
            {/* Trigger */}
            <button
                ref={triggerRef}
                type="button"
                disabled={disabled}
                onClick={openCalendar}
                className={[
                    "w-full flex items-center justify-between text-sm bg-[#f5f7f2] border border-[#cfdbbf] rounded-lg px-3.5 py-2.5 text-left transition",
                    "hover:border-[#8fa07a] focus:outline-none focus:border-[#6b7c5a] focus:ring-2 focus:ring-[#6b7c5a]/10",
                    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                ].join(" ")}
            >
                <span className={displayValue ? "text-[#2d3a22]" : "text-[#a8b89a]"}>
                    {displayValue ?? placeholder}
                </span>
                <svg
                    className="w-4 h-4 text-[#8fa07a] shrink-0 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.75}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            </button>

            {/* Calendar - fixed so it escapes overflow:hidden/auto ancestors */}
            {open && (
                <div
                    ref={popoverRef}
                    style={{
                        position: "fixed",
                        top: pos.top,
                        left: pos.left,
                        width: pos.width,
                        zIndex: 9999
                    }}
                    className="bg-white border border-[#cfdbbf] rounded-xl shadow-xl p-3"
                >
                    {/* Month nav */}
                    <div className="flex items-center justify-between mb-3">
                        <button
                            type="button"
                            onClick={prevMonth}
                            disabled={!canGoPrev}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6b7c5a] hover:bg-[#f0f4ea] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <span className="text-sm font-semibold text-[#2d3a22]">
                            {MONTHS[view.getMonth()]} {view.getFullYear()}
                        </span>
                        <button
                            type="button"
                            onClick={nextMonth}
                            disabled={!canGoNext}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6b7c5a] hover:bg-[#f0f4ea] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Day-of-week headers */}
                    <div className="grid grid-cols-7 mb-1">
                        {DOW.map((d) => (
                            <div
                                key={d}
                                className="text-center text-[10px] font-semibold text-[#8fa07a] py-1"
                            >
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Day cells */}
                    <div className="grid grid-cols-7 gap-y-0.5">
                        {cells.map((d, i) => {
                            const sel = isSelected(d);
                            const dis = isDisabled(d);
                            const tod = isToday(d);
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => handleDay(d)}
                                    disabled={dis}
                                    className={[
                                        "w-8 h-8 mx-auto flex items-center justify-center text-xs rounded-lg transition-colors",
                                        !d
                                            ? "invisible pointer-events-none"
                                            : dis
                                              ? "text-[#cfdbbf] cursor-not-allowed"
                                              : sel
                                                ? "bg-[#3d4f2f] text-white font-semibold"
                                                : tod
                                                  ? "border border-[#8fa07a] text-[#3d4f2f] font-semibold hover:bg-[#e8eedf]"
                                                  : "text-[#2d3a22] hover:bg-[#e8eedf]"
                                    ].join(" ")}
                                >
                                    {d}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
};

export default DateInput;
