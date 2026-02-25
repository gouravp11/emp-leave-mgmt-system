import { createContext, useContext, useState } from "react";
import { loginApi, logoutApi, registerApi } from "../api/auth.api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // user shape: { id, name, email, role, userStatus } — populated after login
    const [user, setUser] = useState(null);

    /**
     * Log in and store user in context.
     * Throws if credentials are invalid or account is pending.
     */
    const login = async (credentials) => {
        const data = await loginApi(credentials);
        setUser(data.user);
        return data;
    };

    /**
     * Register a new account.
     * Does NOT set user — account starts as pending.
     * Throws on error.
     */
    const register = async (userData) => {
        const data = await registerApi(userData);
        return data;
    };

    /**
     * Log out and clear user from context.
     */
    const logout = async () => {
        await logoutApi();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

/** Convenience hook — throws if used outside AuthProvider */
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
};
