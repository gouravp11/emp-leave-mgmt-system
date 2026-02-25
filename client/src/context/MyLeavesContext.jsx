import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getMyLeaves, createLeave, deleteLeave } from "../api/leave.api";

const MyLeavesContext = createContext(null);

export const MyLeavesProvider = ({ children }) => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // leaveId
    const [error, setError] = useState("");

    const fetchLeaves = useCallback(async () => {
        setLoading(true);
        try {
            const { leaves } = await getMyLeaves();
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

    const submitLeave = async (data) => {
        const result = await createLeave(data);
        await fetchLeaves();
        return result;
    };

    const deleteMyLeave = async (leaveId) => {
        setActionLoading(leaveId);
        try {
            await deleteLeave(leaveId);
            await fetchLeaves();
        } catch (e) {
            setError(e.message);
            throw e;
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <MyLeavesContext.Provider
            value={{
                leaves,
                loading,
                actionLoading,
                error,
                setError,
                fetchLeaves,
                submitLeave,
                deleteMyLeave
            }}
        >
            {children}
        </MyLeavesContext.Provider>
    );
};

export const useMyLeaves = () => {
    const ctx = useContext(MyLeavesContext);
    if (!ctx) throw new Error("useMyLeaves must be used within MyLeavesProvider");
    return ctx;
};
