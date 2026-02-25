import client from "./client.js";

export const getAllReimbursements = (params) => client.get("/reimbursements", { params });

export const getMyReimbursements = (params) => client.get("/reimbursements/my", { params });

export const getTeamReimbursements = (params) => client.get("/reimbursements/team", { params });

export const getUserReimbursements = (userId, params) =>
    client.get(`/reimbursements/user/${userId}`, { params });

export const createReimbursement = (formData) =>
    client.post("/reimbursements", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });

export const approveReimbursement = (id) => client.patch(`/reimbursements/${id}/approve`);

export const rejectReimbursement = (id, rejectionReason) =>
    client.patch(`/reimbursements/${id}/reject`, { rejectionReason });

export const markReimbursementPaid = (id) => client.patch(`/reimbursements/${id}/paid`);

export const deleteReimbursement = (id) => client.delete(`/reimbursements/${id}`);
