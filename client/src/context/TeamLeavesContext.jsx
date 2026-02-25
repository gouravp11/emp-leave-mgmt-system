import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getTeamLeaves, approveLeave, rejectLeave } from "../api/leave.api";

const TeamLeavesContext = createContext(null);

export const TeamLeavesProvider = ({ children }) => {
    const [teamLeaves, setTeamLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // leaveId
    const [error, setError] = useState("");

    const fetchTeamLeaves = useCallback(async () => {
        setLoading(true);
        try {
            const { leaves } = await getTeamLeaves();
            setTeamLeaves(leaves);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTeamLeaves();
    }, [fetchTeamLeaves]);

    const approveTeamLeave = async (leaveId) => {
        setActionLoading(leaveId);
        try {
            await approveLeave(leaveId);
            await fetchTeamLeaves();
        } catch (e) {
            setError(e.message);
            throw e;
        } finally {
            setActionLoading(null);
        }
    };

    const rejectTeamLeave = async (leaveId, rejectionReason) => {
        setActionLoading(leaveId);
        try {
            await rejectLeave(leaveId, rejectionReason);
            await fetchTeamLeaves();
        } catch (e) {
            setError(e.message);
            throw e;
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <TeamLeavesContext.Provider
            value={{
                teamLeaves,
                loading,
                actionLoading,
                error,
                setError,
                fetchTeamLeaves,
                approveTeamLeave,
                rejectTeamLeave
            }}
        >
            {children}
        </TeamLeavesContext.Provider>
    );
};

export const useTeamLeaves = () => {
    const ctx = useContext(TeamLeavesContext);
    if (!ctx) throw new Error("useTeamLeaves must be used within TeamLeavesProvider");
    return ctx;
};
