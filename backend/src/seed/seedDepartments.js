const dotenv = require("dotenv");
const connectDatabase = require("../config/db");
const Department = require("../models/Department");

dotenv.config();

const departments =
[
    {
        name: "Cardiology",
        code: "CARD",
        description: "Diagnosis and treatment of heart and cardiovascular conditions",
        icon: "heart"
    },
    {
        name: "Neurology",
        code: "NEUR",
        description: "Diagnosis and treatment of disorders of the nervous system",
        icon: "brain"
    },
    {
        name: "Orthopedics",
        code: "ORTH",
        description: "Treatment of bones, joints, muscles and related conditions",
        icon: "bone"
    },
    {
        name: "Dermatology",
        code: "DERM",
        description: "Diagnosis and treatment of skin, hair and nail conditions",
        icon: "skin"
    },
    {
        name: "Pediatrics",
        code: "PEDI",
        description: "Medical care for infants, children and adolescents",
        icon: "child"
    },
    {
        name: "General Medicine",
        code: "GMED",
        description: "General medical diagnosis and primary healthcare",
        icon: "medical"
    },
    {
        name: "ENT",
        code: "ENT",
        description: "Treatment of ear, nose and throat conditions",
        icon: "ear"
    },
    {
        name: "Ophthalmology",
        code: "OPHT",
        description: "Diagnosis and treatment of eye conditions",
        icon: "eye"
    },
    {
        name: "Gynecology",
        code: "GYNE",
        description: "Women's reproductive and maternal healthcare",
        icon: "women"
    }
];

const seedDepartments = async () =>
{
    try
    {
        await connectDatabase();

        for (const departmentData of departments)
        {
            const existingDepartment =
                await Department.findOne(
                    {
                        code: departmentData.code
                    }
                );

            if (!existingDepartment)
            {
                await Department.create(
                    departmentData
                );

                console.log(
                    `Created department: ${departmentData.name}`
                );
            }
            else
            {
                console.log(
                    `Department already exists: ${departmentData.name}`
                );
            }
        }

        console.log("Department seeding completed");

        process.exit(0);
    }
    catch (error)
    {
        console.error(
            "Department seeding failed:",
            error.message
        );

        process.exit(1);
    }
};

seedDepartments();