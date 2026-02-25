import client from "./client.js";

/**
 * POST /auth/login
 * @param {{ email: string, password: string }} credentials
 * @returns {{ message: string, user: object }}
 */
export const loginApi = (credentials) => client.post("/auth/login", credentials);

/**
 * POST /auth/register
 * @param {{ name: string, email: string, password: string }} userData
 * @returns {{ message: string, user: object }}
 */
export const registerApi = (userData) => client.post("/auth/register", userData);

/**
 * POST /auth/logout
 * @returns {{ message: string }}
 */
export const logoutApi = () => client.post("/auth/logout");
