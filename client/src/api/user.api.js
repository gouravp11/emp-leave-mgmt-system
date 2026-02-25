import client from "./client.js";

export const getUsers = () => client.get("/users");

export const approveUser = (userId) => client.patch(`/users/${userId}/approve`);

export const deleteUser = (userId) => client.delete(`/users/${userId}`);

export const changeRole = (userId, role) => client.patch(`/users/${userId}/role`, { role });

export const assignManager = (userId, managerId) =>
    client.patch(`/users/${userId}/manager`, { managerId });

export const getMyTeam = () => client.get("/users/team");
