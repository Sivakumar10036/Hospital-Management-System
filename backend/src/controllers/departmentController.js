const Department =
    require("../models/Department");

const Doctor =
    require("../models/Doctor");


const getDepartments =
    async (
        request,
        response
    ) =>
{
    try
    {
        const departments =
            await Department.find()
                .sort(
                {
                    name: 1
                }
            );

        const departmentsWithCounts =
            await Promise.all(
                departments.map(
                    async department =>
                    {
                        const doctorCount =
                            await Doctor.countDocuments(
                            {
                                department:
                                    department._id
                            }
                            );

                        return {
                            ...department.toObject(),

                            doctorCount
                        };
                    }
                )
            );

        return response.json(
        {
            success: true,

            count:
                departmentsWithCounts.length,

            departments:
                departmentsWithCounts
        }
        );
    }
    catch (error)
    {
        console.error(
            "Get departments error:",
            error
        );

        return response.status(500).json(
        {
            success: false,

            message:
                "Unable to fetch departments",

            error:
                error.message
        }
        );
    }
};


const createDepartment =
    async (
        request,
        response
    ) =>
{
    try
    {
        const
        {
            name,
            code,
            description,
            icon,
            image
        } =
            request.body;

        if (
            !name ||
            !name.trim()
        )
        {
            return response.status(400).json(
            {
                success: false,

                message:
                    "Department name is required"
            }
            );
        }

        if (
            !code ||
            !code.trim()
        )
        {
            return response.status(400).json(
            {
                success: false,

                message:
                    "Department code is required"
            }
            );
        }

        const departmentName =
            name.trim();

        const departmentCode =
            code
                .trim()
                .toUpperCase();

        const existingDepartment =
            await Department.findOne(
            {
                $or:
                [
                    {
                        name:
                            departmentName
                    },

                    {
                        code:
                            departmentCode
                    }
                ]
            }
            );

        if (existingDepartment)
        {
            return response.status(409).json(
            {
                success: false,

                message:
                    "Department name or code already exists"
            }
            );
        }

        const department =
            await Department.create(
            {
                name:
                    departmentName,

                code:
                    departmentCode,

                description:
                    description ||
                    "",

                icon:
                    icon ||
                    "",

                image:
                    image ||
                    "",

                isActive:
                    true
            }
            );

        return response.status(201).json(
        {
            success: true,

            message:
                "Department created successfully",

            department:
            {
                ...department.toObject(),

                doctorCount: 0
            }
        }
        );
    }
    catch (error)
    {
        console.error(
            "Create department error:",
            error
        );

        return response.status(500).json(
        {
            success: false,

            message:
                "Unable to create department",

            error:
                error.message
        }
        );
    }
};


const updateDepartment =
    async (
        request,
        response
    ) =>
{
    try
    {
        const department =
            await Department.findById(
                request.params.id
            );

        if (!department)
        {
            return response.status(404).json(
            {
                success: false,

                message:
                    "Department not found"
            }
            );
        }

        const
        {
            name,
            code,
            description,
            icon,
            image
        } =
            request.body;

        if (
            name !== undefined &&
            name.trim()
        )
        {
            const departmentName =
                name.trim();

            const existingName =
                await Department.findOne(
                {
                    name:
                        departmentName,

                    _id:
                    {
                        $ne:
                            department._id
                    }
                }
                );

            if (existingName)
            {
                return response.status(409).json(
                {
                    success: false,

                    message:
                        "Department name already exists"
                }
                );
            }

            department.name =
                departmentName;
        }

        if (
            code !== undefined &&
            code.trim()
        )
        {
            const departmentCode =
                code
                    .trim()
                    .toUpperCase();

            const existingCode =
                await Department.findOne(
                {
                    code:
                        departmentCode,

                    _id:
                    {
                        $ne:
                            department._id
                    }
                }
                );

            if (existingCode)
            {
                return response.status(409).json(
                {
                    success: false,

                    message:
                        "Department code already exists"
                }
                );
            }

            department.code =
                departmentCode;
        }

        if (
            description !== undefined
        )
        {
            department.description =
                description.trim();
        }

        if (
            icon !== undefined
        )
        {
            department.icon =
                icon;
        }

        if (
            image !== undefined
        )
        {
            department.image =
                image;
        }

        await department.save();

        const doctorCount =
            await Doctor.countDocuments(
            {
                department:
                    department._id
            }
            );

        return response.json(
        {
            success: true,

            message:
                "Department updated successfully",

            department:
            {
                ...department.toObject(),

                doctorCount
            }
        }
        );
    }
    catch (error)
    {
        console.error(
            "Update department error:",
            error
        );

        return response.status(500).json(
        {
            success: false,

            message:
                "Unable to update department",

            error:
                error.message
        }
        );
    }
};


const updateDepartmentStatus =
    async (
        request,
        response
    ) =>
{
    try
    {
        const department =
            await Department.findById(
                request.params.id
            );

        if (!department)
        {
            return response.status(404).json(
            {
                success: false,

                message:
                    "Department not found"
            }
            );
        }

        department.isActive =
            !department.isActive;

        await department.save();

        const doctorCount =
            await Doctor.countDocuments(
            {
                department:
                    department._id
            }
            );

        return response.json(
        {
            success: true,

            message:
                department.isActive
                    ?
                    "Department activated successfully"
                    :
                    "Department deactivated successfully",

            department:
            {
                ...department.toObject(),

                doctorCount
            }
        }
        );
    }
    catch (error)
    {
        console.error(
            "Update department status error:",
            error
        );

        return response.status(500).json(
        {
            success: false,

            message:
                "Unable to update department status",

            error:
                error.message
        }
        );
    }
};


module.exports =
{
    getDepartments,

    createDepartment,

    updateDepartment,

    updateDepartmentStatus
};