import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
    getAllReimbursements,
    markReimbursementPaid as markPaidApi
} from "../api/reimbursement.api";

const ReimbursementsContext = createContext(null);

export const ReimbursementsProvider = ({ children }) => {
    const [reimbursements, setReimbursements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // reimbursementId being mutated
    const [error, setError] = useState("");

    const fetchReimbursements = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const { reimbursements } = await getAllReimbursements();
            setReimbursements(reimbursements);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReimbursements();
    }, [fetchReimbursements]);

    // ── Actions ──────────────────────────────────────────────────────────────

    const markPaid = async (reimbursementId) => {
        setActionLoading(reimbursementId);
        setError("");
        try {
            await markPaidApi(reimbursementId);
            await fetchReimbursements();
        } catch (e) {
            setError(e.message);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <ReimbursementsContext.Provider
            value={{
                reimbursements,
                loading,
                actionLoading,
                error,
                setError,
                fetchReimbursements,
                markPaid
            }}
        >
            {children}
        </ReimbursementsContext.Provider>
    );
};

export const useReimbursements = () => {
    const ctx = useContext(ReimbursementsContext);
    if (!ctx) throw new Error("useReimbursements must be used within a ReimbursementsProvider");
    return ctx;
};
