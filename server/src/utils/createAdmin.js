import User from "../models/user.model.js";

/**
 * Creates an admin user.
 * @param {{ name: string, email: string, password: string }} adminData
 * @param {{ force: boolean }} options
 *   - force: false (default) — skip if any admin already exists (first-run logic)
 *   - force: true            — skip only if the given email already exists
 * @returns {Promise<{ created: boolean, admin: object | null }>}
 */
const createAdmin = async ({ name, email, password }, { force = false } = {}) => {
    const normalizedEmail = email.toLowerCase().trim();

    if (force) {
        const emailExists = await User.exists({ email: normalizedEmail });
        if (emailExists) return { created: false, admin: null };
    } else {
        const adminExists = await User.exists({ role: "admin" });
        if (adminExists) return { created: false, admin: null };
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
