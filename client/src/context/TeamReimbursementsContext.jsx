import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
    getTeamReimbursements,
    approveReimbursement,
    rejectReimbursement
} from "../api/reimbursement.api";

const TeamReimbursementsContext = createContext(null);

export const TeamReimbursementsProvider = ({ children }) => {
    const [teamReimbursements, setTeamReimbursements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // reimbursementId
    const [error, setError] = useState("");

    const fetchTeamReimbursements = useCallback(async () => {
        setLoading(true);
        try {
            const { reimbursements } = await getTeamReimbursements();
            setTeamReimbursements(reimbursements);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTeamReimbursements();
    }, [fetchTeamReimbursements]);

    const approveTeamReimbursement = async (id) => {
        setActionLoading(id);
        try {
            await approveReimbursement(id);
            await fetchTeamReimbursements();
        } catch (e) {
            setError(e.message);
            throw e;
        } finally {
            setActionLoading(null);
        }
    };

    const rejectTeamReimbursement = async (id, rejectionReason) => {
        setActionLoading(id);
        try {
            await rejectReimbursement(id, rejectionReason);
            await fetchTeamReimbursements();
        } catch (e) {
            setError(e.message);
            throw e;
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <TeamReimbursementsContext.Provider
            value={{
                teamReimbursements,
                loading,
                actionLoading,
                error,
                setError,
                fetchTeamReimbursements,
                approveTeamReimbursement,
                rejectTeamReimbursement
            }}
        >
            {children}
        </TeamReimbursementsContext.Provider>
    );
};

export const useTeamReimbursements = () => {
    const ctx = useContext(TeamReimbursementsContext);
    if (!ctx)
        throw new Error("useTeamReimbursements must be used within TeamReimbursementsProvider");
    return ctx;
};
