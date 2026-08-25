const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDatabase = require("../config/db");
const User = require("../models/User");

dotenv.config();

const createAdmin = async () =>
{
    try
    {
        await connectDatabase();

        const adminEmail = "admin@hospital.com";

        const existingAdmin = await User.findOne(
            {
                email: adminEmail
            }
        );

        if (existingAdmin)
        {
            console.log("Admin already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(
            "Admin@123",
            12
        );

        await User.create(
            {
                name: "Hospital Administrator",
                email: adminEmail,
                password: hashedPassword,
                phone: "9999999999",
                role: "ADMIN"
            }
        );

        console.log("Admin created successfully");
        console.log("Email: admin@hospital.com");
        console.log("Password: Admin@123");

        process.exit(0);
    }
    catch (error)
    {
        console.error("Admin creation failed:", error.message);
        process.exit(1);
    }
};

createAdmin();