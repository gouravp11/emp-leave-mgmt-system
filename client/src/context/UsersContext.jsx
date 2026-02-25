import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
    getUsers,
    approveUser as approveUserApi,
    deleteUser as deleteUserApi,
    changeRole as changeRoleApi,
    assignManager as assignManagerApi
} from "../api/user.api";

const UsersContext = createContext(null);

export const UsersProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // userId being mutated
    const [error, setError] = useState("");

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const { users } = await getUsers();
            setUsers(users);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // ── Actions ──────────────────────────────────────────────────────────────

    const withAction = async (userId, fn) => {
        setActionLoading(userId);
        setError("");
        try {
            await fn();
            await fetchUsers();
        } catch (e) {
            setError(e.message);
        } finally {
            setActionLoading(null);
        }
    };

    const approveUser = (userId) => withAction(userId, () => approveUserApi(userId));
    const rejectUser = (userId) => withAction(userId, () => deleteUserApi(userId));
    const changeUserRole = (userId, role) => withAction(userId, () => changeRoleApi(userId, role));
    const assignUserManager = (userId, managerId) =>
        withAction(userId, () => assignManagerApi(userId, managerId));
    const removeUser = (userId) => withAction(userId, () => deleteUserApi(userId));

    // ── Derived slices (memoised per render) ─────────────────────────────────
    const approvedUsers = users.filter((u) => u.userStatus === "approved");
    const pendingUsers = users.filter((u) => u.userStatus === "pending");

    return (
        <UsersContext.Provider
            value={{
                users,
                approvedUsers,
                pendingUsers,
                loading,
                actionLoading,
                error,
                setError,
                fetchUsers,
                approveUser,
                rejectUser,
                changeUserRole,
                assignUserManager,
                removeUser
            }}
        >
            {children}
        </UsersContext.Provider>
    );
};

export const useUsers = () => {
    const ctx = useContext(UsersContext);
    if (!ctx) throw new Error("useUsers must be used within a UsersProvider");
    return ctx;
};
