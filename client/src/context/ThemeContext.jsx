import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    // Initialise from localStorage; fall back to system preference, then light
    const [dark, setDark] = useState(() => {
        const stored = localStorage.getItem("theme");
        if (stored) return stored === "dark";
        return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    });

    // Keep <html> class in sync with state
    useEffect(() => {
        const root = document.documentElement;
        if (dark) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [dark]);

    const toggle = () => setDark((d) => !d);

    return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>;
};

/** Convenience hook — throws if used outside ThemeProvider */
export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
    return ctx;
};
