import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getAllLeaves, cancelLeave as cancelLeaveApi } from "../api/leave.api";

const LeavesContext = createContext(null);

export const LeavesProvider = ({ children }) => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // leaveId being mutated
    const [error, setError] = useState("");

    const fetchLeaves = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const { leaves } = await getAllLeaves();
            setLeaves(leaves);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLeaves();
    }, [fetchLeaves]);

    // ── Actions ──────────────────────────────────────────────────────────────

    const cancelLeave = async (leaveId) => {
        setActionLoading(leaveId);
        setError("");
        try {
            await cancelLeaveApi(leaveId);
            await fetchLeaves();
        } catch (e) {
            setError(e.message);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <LeavesContext.Provider
            value={{
                leaves,
                loading,
                actionLoading,
                error,
                setError,
                fetchLeaves,
                cancelLeave
            }}
        >
            {children}
        </LeavesContext.Provider>
    );
};

export const useLeaves = () => {
    const ctx = useContext(LeavesContext);
    if (!ctx) throw new Error("useLeaves must be used within a LeavesProvider");
    return ctx;
};
