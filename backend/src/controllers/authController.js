// const bcrypt =
//     require("bcryptjs");


// const User =
//     require("../models/User");


// const Patient =
//     require("../models/Patient");


// const Doctor =
//     require("../models/Doctor");


// const Superintendent =
//     require("../models/Superintendent");


// const generateToken =
//     require("../utils/generateToken");


// const generateId =
//     require("../utils/generateId");


// const getNextPatientId =
//     async () =>
// {
//     const patientCount =
//         await Patient.countDocuments();


//     return generateId(
//         "PAT",
//         patientCount + 1
//     );
// };


// const registerPatient =
//     async (
//         request,
//         response
//     ) =>
// {
//     try
//     {
//         const
//         {
//             name,
//             email,
//             password,
//             phone,
//             dateOfBirth,
//             gender,
//             bloodGroup,
//             address,
//             emergencyContactName,
//             emergencyContactPhone
//         } =
//             request.body;


//         if (
//             !name ||
//             !email ||
//             !password ||
//             !phone
//         )
//         {
//             return response.status(400).json(
//             {
//                 success: false,
//                 message:
//                     "Name, email, password and phone are required"
//             });
//         }


//         const normalizedEmail =
//             email
//                 .trim()
//                 .toLowerCase();


//         const existingUser =
//             await User.findOne(
//             {
//                 email:
//                     normalizedEmail
//             });


//         if (existingUser)
//         {
//             return response.status(409).json(
//             {
//                 success: false,
//                 message:
//                     "An account with this email already exists"
//             });
//         }


//         const hashedPassword =
//             await bcrypt.hash(
//                 password,
//                 12
//             );


//         const user =
//             await User.create(
//             {
//                 name:
//                     name.trim(),

//                 email:
//                     normalizedEmail,

//                 password:
//                     hashedPassword,

//                 phone:
//                     phone.trim(),

//                 role:
//                     "PATIENT",

//                 isActive:
//                     true
//             });


//         const patientId =
//             await getNextPatientId();


//         let patient;


//         try
//         {
//             patient =
//                 await Patient.create(
//                 {
//                     user:
//                         user._id,

//                     patientId,

//                     dateOfBirth:
//                         dateOfBirth || null,

//                     gender:
//                         gender || "Other",

//                     bloodGroup:
//                         bloodGroup || "Unknown",

//                     address:
//                         address || "",

//                     emergencyContactName:
//                         emergencyContactName || "",

//                     emergencyContactPhone:
//                         emergencyContactPhone || ""
//                 });
//         }
//         catch (patientError)
//         {
//             await User.findByIdAndDelete(
//                 user._id
//             );


//             throw patientError;
//         }


//         const token =
//             generateToken(
//                 user._id,
//                 user.role
//             );


//         return response.status(201).json(
//         {
//             success: true,

//             message:
//                 "Patient registration successful",

//             token,

//             user:
//             {
//                 id:
//                     user._id,

//                 name:
//                     user.name,

//                 email:
//                     user.email,

//                 phone:
//                     user.phone,

//                 role:
//                     user.role,

//                 profilePhoto:
//                     user.profilePhoto,

//                 isActive:
//                     user.isActive
//             },

//             profile:
//             {
//                 id:
//                     patient._id,

//                 patientId:
//                     patient.patientId,

//                 dateOfBirth:
//                     patient.dateOfBirth,

//                 gender:
//                     patient.gender,

//                 bloodGroup:
//                     patient.bloodGroup
//             }
//         });
//     }
//     catch (error)
//     {
//         console.error(
//             "Patient registration error:",
//             error
//         );


//         return response.status(500).json(
//         {
//             success: false,

//             message:
//                 "Registration failed",

//             error:
//                 error.message
//         });
//     }
// };


// const login =
//     async (
//         request,
//         response
//     ) =>
// {
//     try
//     {
//         const
//         {
//             email,
//             password
//         } =
//             request.body;


//         if (
//             !email ||
//             !password
//         )
//         {
//             return response.status(400).json(
//             {
//                 success: false,
//                 message:
//                     "Email and password are required"
//             });
//         }


//         const normalizedEmail =
//             email
//                 .trim()
//                 .toLowerCase();


//         const user =
//             await User.findOne(
//             {
//                 email:
//                     normalizedEmail
//             });


//         if (!user)
//         {
//             return response.status(401).json(
//             {
//                 success: false,
//                 message:
//                     "Invalid email or password"
//             });
//         }


//         if (
//             user.isActive === false
//         )
//         {
//             return response.status(403).json(
//             {
//                 success: false,
//                 message:
//                     "Your account has been deactivated"
//             });
//         }


//         const passwordMatches =
//             await bcrypt.compare(
//                 password,
//                 user.password
//             );


//         if (!passwordMatches)
//         {
//             return response.status(401).json(
//             {
//                 success: false,
//                 message:
//                     "Invalid email or password"
//             });
//         }


//         if (
//             user.role === "DOCTOR"
//         )
//         {
//             const doctor =
//                 await Doctor.findOne(
//                 {
//                     user:
//                         user._id
//                 });


//             if (!doctor)
//             {
//                 return response.status(404).json(
//                 {
//                     success: false,
//                     message:
//                         "Doctor profile not found"
//                 });
//             }


//             if (
//                 doctor.isActive === false
//             )
//             {
//                 return response.status(403).json(
//                 {
//                     success: false,
//                     message:
//                         "Doctor account has been deactivated"
//                 });
//             }
//         }


//         user.lastLogin =
//             new Date();


//         await user.save();


//         const token =
//             generateToken(
//                 user._id,
//                 user.role
//             );


//         let profile =
//             null;


//         if (
//             user.role === "PATIENT"
//         )
//         {
//             profile =
//                 await Patient.findOne(
//                 {
//                     user:
//                         user._id
//                 });
//         }


//         if (
//             user.role === "DOCTOR"
//         )
//         {
//             profile =
//                 await Doctor.findOne(
//                 {
//                     user:
//                         user._id
//                 })
//                 .populate(
//                     "department"
//                 );
//         }


//         if (
//             user.role === "SUPERINTENDENT"
//         )
//         {
//             profile =
//                 await Superintendent.findOne(
//                 {
//                     user:
//                         user._id
//                 });
//         }


//         return response.status(200).json(
//         {
//             success: true,

//             message:
//                 "Login successful",

//             token,

//             user:
//             {
//                 id:
//                     user._id,

//                 name:
//                     user.name,

//                 email:
//                     user.email,

//                 phone:
//                     user.phone,

//                 role:
//                     user.role,

//                 profilePhoto:
//                     user.profilePhoto,

//                 isActive:
//                     user.isActive
//             },

//             profile
//         });
//     }
//     catch (error)
//     {
//         console.error(
//             "Login error:",
//             error
//         );


//         return response.status(500).json(
//         {
//             success: false,

//             message:
//                 "Login failed",

//             error:
//                 error.message
//         });
//     }
// };


// const getCurrentUser =
//     async (
//         request,
//         response
//     ) =>
// {
//     try
//     {
//         let profile =
//             null;


//         if (
//             request.user.role === "PATIENT"
//         )
//         {
//             profile =
//                 await Patient.findOne(
//                 {
//                     user:
//                         request.user._id
//                 });
//         }


//         if (
//             request.user.role === "DOCTOR"
//         )
//         {
//             profile =
//                 await Doctor.findOne(
//                 {
//                     user:
//                         request.user._id
//                 })
//                 .populate(
//                     "department"
//                 );
//         }


//         if (
//             request.user.role ===
//             "SUPERINTENDENT"
//         )
//         {
//             profile =
//                 await Superintendent.findOne(
//                 {
//                     user:
//                         request.user._id
//                 });
//         }


//         return response.status(200).json(
//         {
//             success: true,

//             user:
//                 request.user,

//             profile
//         });
//     }
//     catch (error)
//     {
//         console.error(
//             "Get current user error:",
//             error
//         );


//         return response.status(500).json(
//         {
//             success: false,

//             message:
//                 "Unable to fetch current user"
//         });
//     }
// };


// module.exports =
// {
//     registerPatient,
//     login,
//     getCurrentUser
// };



const bcrypt =
    require("bcryptjs");


const User =
    require("../models/User");


const Patient =
    require("../models/Patient");


const Doctor =
    require("../models/Doctor");


const Superintendent =
    require("../models/Superintendent");


const generateToken =
    require("../utils/generateToken");


const generateId =
    require("../utils/generateId");


const getNextPatientId =
    async () =>
{
    const patientCount =
        await Patient.countDocuments();


    return generateId(
        "PAT",
        patientCount + 1
    );
};


const registerPatient =
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
            email,
            password,
            phone,
            dateOfBirth,
            gender,
            bloodGroup,
            address,
            emergencyContactName,
            emergencyContactPhone
        } =
            request.body;


        if (
            !name ||
            !email ||
            !password ||
            !phone
        )
        {
            return response.status(400).json(
            {
                success: false,

                message:
                    "Name, email, password and phone are required"
            });
        }


        const normalizedEmail =
            email
                .trim()
                .toLowerCase();


        const existingUser =
            await User.findOne(
            {
                email:
                    normalizedEmail
            });


        if (existingUser)
        {
            return response.status(409).json(
            {
                success: false,

                message:
                    "An account with this email already exists"
            });
        }


        const hashedPassword =
            await bcrypt.hash(
                password,
                12
            );


        const user =
            await User.create(
            {
                name:
                    name.trim(),

                email:
                    normalizedEmail,

                password:
                    hashedPassword,

                phone:
                    phone.trim(),

                role:
                    "PATIENT",

                isActive:
                    true
            });


        const patientId =
            await getNextPatientId();


        let patient;


        try
        {
            patient =
                await Patient.create(
                {
                    user:
                        user._id,

                    patientId,

                    dateOfBirth:
                        dateOfBirth || null,

                    gender:
                        gender || "Other",

                    bloodGroup:
                        bloodGroup || "Unknown",

                    address:
                        address || "",

                    emergencyContactName:
                        emergencyContactName || "",

                    emergencyContactPhone:
                        emergencyContactPhone || ""
                });
        }
        catch (patientError)
        {
            await User.findByIdAndDelete(
                user._id
            );

            throw patientError;
        }


        const token =
            generateToken(
                user._id,
                user.role
            );


        return response.status(201).json(
        {
            success: true,

            message:
                "Patient registration successful",

            token,

            user:
            {
                id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                phone:
                    user.phone,

                role:
                    user.role,

                profilePhoto:
                    user.profilePhoto,

                isActive:
                    user.isActive
            },

            profile:
            {
                id:
                    patient._id,

                patientId:
                    patient.patientId,

                dateOfBirth:
                    patient.dateOfBirth,

                gender:
                    patient.gender,

                bloodGroup:
                    patient.bloodGroup
            }
        });
    }
    catch (error)
    {
        console.error(
            "Patient registration error:",
            error
        );


        return response.status(500).json(
        {
            success: false,

            message:
                "Registration failed",

            error:
                error.message
        });
    }
};


const login =
    async (
        request,
        response
    ) =>
{
    try
    {
        const
        {
            email,
            password
        } =
            request.body;


        if (
            !email ||
            !password
        )
        {
            return response.status(400).json(
            {
                success: false,

                message:
                    "Email and password are required"
            });
        }


        const normalizedEmail =
            email
                .trim()
                .toLowerCase();


        const user =
            await User.findOne(
            {
                email:
                    normalizedEmail
            });


        if (!user)
        {
            return response.status(401).json(
            {
                success: false,

                message:
                    "Invalid email or password"
            });
        }


        if (
            user.isActive === false
        )
        {
            return response.status(403).json(
            {
                success: false,

                message:
                    "Your account has been deactivated"
            });
        }


        const passwordMatches =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatches)
        {
            return response.status(401).json(
            {
                success: false,

                message:
                    "Invalid email or password"
            });
        }


        let profile =
            null;


        if (
            user.role ===
            "DOCTOR"
        )
        {
            profile =
                await Doctor.findOne(
                {
                    user:
                        user._id
                })
                .populate(
                    "department"
                );


            if (!profile)
            {
                return response.status(404).json(
                {
                    success: false,

                    message:
                        "Doctor profile not found"
                });
            }


            if (
                profile.isActive === false
            )
            {
                return response.status(403).json(
                {
                    success: false,

                    message:
                        "Doctor account has been deactivated"
                });
            }
        }


        if (
            user.role ===
            "PATIENT"
        )
        {
            profile =
                await Patient.findOne(
                {
                    user:
                        user._id
                });
        }


        if (
            user.role ===
            "SUPERINTENDENT"
        )
        {
            profile =
                await Superintendent.findOne(
                {
                    user:
                        user._id
                });
        }


        user.lastLogin =
            new Date();


        await user.save();


        const token =
            generateToken(
                user._id,
                user.role
            );


        return response.status(200).json(
        {
            success: true,

            message:
                "Login successful",

            token,

            user:
            {
                id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                phone:
                    user.phone,

                role:
                    user.role,

                profilePhoto:
                    user.profilePhoto,

                isActive:
                    user.isActive,

                lastLogin:
                    user.lastLogin
            },

            profile
        });
    }
    catch (error)
    {
        console.error(
            "Login error:",
            error
        );


        return response.status(500).json(
        {
            success: false,

            message:
                "Login failed",

            error:
                error.message
        });
    }
};


const doctorLogin =
    async (
        request,
        response
    ) =>
{
    try
    {
        const
        {
            email,
            password
        } =
            request.body;


        if (
            !email ||
            !password
        )
        {
            return response.status(400).json(
            {
                success: false,

                message:
                    "Doctor email and password are required"
            });
        }


        const normalizedEmail =
            email
                .trim()
                .toLowerCase();


        const user =
            await User.findOne(
            {
                email:
                    normalizedEmail
            });


        if (!user)
        {
            return response.status(401).json(
            {
                success: false,

                message:
                    "Invalid doctor email or password"
            });
        }


        if (
            user.role !==
            "DOCTOR"
        )
        {
            return response.status(403).json(
            {
                success: false,

                message:
                    "This account is not a doctor account"
            });
        }


        if (
            user.isActive === false
        )
        {
            return response.status(403).json(
            {
                success: false,

                message:
                    "Doctor account has been deactivated"
            });
        }


        const passwordMatches =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatches)
        {
            return response.status(401).json(
            {
                success: false,

                message:
                    "Invalid doctor email or password"
            });
        }


        const doctor =
            await Doctor.findOne(
            {
                user:
                    user._id
            })
            .populate(
                "department"
            );


        if (!doctor)
        {
            return response.status(404).json(
            {
                success: false,

                message:
                    "Doctor profile not found"
            });
        }


        if (
            doctor.isActive === false
        )
        {
            return response.status(403).json(
            {
                success: false,

                message:
                    "Doctor profile is inactive"
            });
        }


        user.lastLogin =
            new Date();


        await user.save();


        const token =
            generateToken(
                user._id,
                user.role
            );


        return response.status(200).json(
        {
            success: true,

            message:
                "Doctor login successful",

            token,

            user:
            {
                id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                phone:
                    user.phone,

                role:
                    user.role,

                profilePhoto:
                    user.profilePhoto,

                isActive:
                    user.isActive,

                lastLogin:
                    user.lastLogin
            },

            profile:
                doctor
        });
    }
    catch (error)
    {
        console.error(
            "Doctor login error:",
            error
        );


        return response.status(500).json(
        {
            success: false,

            message:
                "Doctor login failed",

            error:
                error.message
        });
    }
};


const getCurrentUser =
    async (
        request,
        response
    ) =>
{
    try
    {
        let profile =
            null;


        if (
            request.user.role ===
            "PATIENT"
        )
        {
            profile =
                await Patient.findOne(
                {
                    user:
                        request.user._id
                });
        }


        if (
            request.user.role ===
            "DOCTOR"
        )
        {
            profile =
                await Doctor.findOne(
                {
                    user:
                        request.user._id
                })
                .populate(
                    "department"
                );
        }


        if (
            request.user.role ===
            "SUPERINTENDENT"
        )
        {
            profile =
                await Superintendent.findOne(
                {
                    user:
                        request.user._id
                });
        }


        return response.status(200).json(
        {
            success: true,

            user:
                request.user,

            profile
        });
    }
    catch (error)
    {
        console.error(
            "Current user error:",
            error
        );


        return response.status(500).json(
        {
            success: false,

            message:
                "Unable to fetch current user"
        });
    }
};


module.exports =
{
    registerPatient,

    login,

    doctorLogin,

    getCurrentUser
};