import User from "../models/user.model.js";

/**
 * Creates an admin user if no admin user exists.
 * @param {{ name: string, email: string, password: string }} adminData
 * @returns {Promise<{ created: boolean, admin: object }>}
 */
const createAdmin = async ({ name, email, password }) => {
    const normalizedEmail = email.toLowerCase().trim();

    const adminExists = await User.exists({ role: "admin" });
    if (adminExists) {
        return { created: false, admin: null };
    }

    const admin = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: "admin"
    });

    return { created: true, admin };
};

export default createAdmin;
