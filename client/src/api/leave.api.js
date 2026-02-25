import client from "./client.js";

export const getAllLeaves = (params) => client.get("/leaves", { params });

export const getMyLeaves = (params) => client.get("/leaves/my", { params });

export const getTeamLeaves = (params) => client.get("/leaves/team", { params });

export const createLeave = (data) => client.post("/leaves", data);

export const approveLeave = (leaveId) => client.patch(`/leaves/${leaveId}/approve`);

export const rejectLeave = (leaveId, reason) =>
    client.patch(`/leaves/${leaveId}/reject`, { reason });

export const cancelLeave = (leaveId) => client.patch(`/leaves/${leaveId}/cancel`);

export const deleteLeave = (leaveId) => client.delete(`/leaves/${leaveId}`);
