import "dotenv/config";
import connectDB from "../config/db.js";
import createAdmin from "../utils/createAdmin.js";

const parseArgs = () => {
    const [name, email, password] = process.argv.slice(2);
    return { name, email, password };
};

const validateArgs = ({ name, email, password }) => {
    const errors = [];

    if (!name || name.trim().length === 0) {
        errors.push("name is required");
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push("email must be a valid email address");
    }

    if (!password || password.length < 6) {
        errors.push("password must be at least 6 characters");
    }

    return errors;
};

const seedAdmin = async () => {
    const { name, email, password } = parseArgs();

    const errors = validateArgs({ name, email, password });
    if (errors.length > 0) {
        console.error("Validation failed:");
        errors.forEach((e) => console.error(`  - ${e}`));
        console.error("\nUsage: node src/scripts/seedAdmin.js <name> <email> <password>");
        process.exit(1);
    }

    await connectDB();

    const { created, admin } = await createAdmin({ name, email, password }, { force: true });

    if (!created) {
        console.error(`Error: An admin user with email "${email}" already exists.`);
        process.exit(1);
    }

    console.log(`Admin created successfully:`);
    console.log(`  Name  : ${admin.name}`);
    console.log(`  Email : ${admin.email}`);
    console.log(`  Role  : ${admin.role}`);
    console.log(`  ID    : ${admin._id}`);

    process.exit(0);
};

seedAdmin();
