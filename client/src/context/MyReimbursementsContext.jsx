import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
    getMyReimbursements,
    createReimbursement,
    deleteReimbursement
} from "../api/reimbursement.api";

const MyReimbursementsContext = createContext(null);

export const MyReimbursementsProvider = ({ children }) => {
    const [reimbursements, setReimbursements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // reimbursementId
    const [error, setError] = useState("");

    const fetchReimbursements = useCallback(async () => {
        setLoading(true);
        try {
            const { reimbursements } = await getMyReimbursements();
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

    const submitReimbursement = async (formData) => {
        const result = await createReimbursement(formData);
        await fetchReimbursements();
        return result;
    };

    const deleteMyReimbursement = async (id) => {
        setActionLoading(id);
        try {
            await deleteReimbursement(id);
            await fetchReimbursements();
        } catch (e) {
            setError(e.message);
            throw e;
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <MyReimbursementsContext.Provider
            value={{
                reimbursements,
                loading,
                actionLoading,
                error,
                setError,
                fetchReimbursements,
                submitReimbursement,
                deleteMyReimbursement
            }}
        >
            {children}
        </MyReimbursementsContext.Provider>
    );
};

export const useMyReimbursements = () => {
    const ctx = useContext(MyReimbursementsContext);
    if (!ctx) throw new Error("useMyReimbursements must be used within MyReimbursementsProvider");
    return ctx;
};
