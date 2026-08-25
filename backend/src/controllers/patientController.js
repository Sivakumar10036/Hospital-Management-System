const Doctor =
    require("../models/Doctor");

const Patient =
    require("../models/Patient");

const User =
    require("../models/User");

const Appointment =
    require("../models/Appointment");


const getDoctors =
async (
    request,
    response
) =>
{
    try
    {
        const doctors =
            await Doctor.find(
                {
                    isActive: true,
                    isAvailable: true
                }
            )
            .populate(
                "department"
            )
            .populate(
                {
                    path: "user",
                    select:
                        "name email phone"
                }
            )
            .sort(
                {
                    createdAt: -1
                }
            );

        const formattedDoctors =
            doctors.map(
                doctor =>
                ({
                    _id:
                        doctor._id,

                    doctorId:
                        doctor.doctorId,

                    name:
                        doctor.user?.name ||
                        "Doctor",

                    email:
                        doctor.user?.email ||
                        "",

                    phone:
                        doctor.user?.phone ||
                        "",

                    specialization:
                        doctor.specialization ||
                        "",

                    department:
                        doctor.department?.name ||
                        "",

                    qualification:
                        doctor.qualification ||
                        "",

                    experience:
                        doctor.experience ||
                        0,

                    consultationFee:
                        doctor.consultationFee ||
                        0,

                    profilePhoto:
                        doctor.profilePhoto ||
                        doctor.user?.profilePhoto ||
                        "",

                    isActive:
                        doctor.isActive,

                    isAvailable:
                        doctor.isAvailable
                })
            );

        return response.json(
            {
                success: true,

                count:
                    formattedDoctors.length,

                doctors:
                    formattedDoctors
            }
        );
    }
    catch (error)
    {
        console.error(
            "Get doctors error:",
            error
        );

        return response.status(500).json(
            {
                success: false,

                message:
                    "Unable to fetch doctors",

                error:
                    error.message
            }
        );
    }
};


const getDoctorById =
async (
    request,
    response
) =>
{
    try
    {
        const doctor =
            await Doctor.findOne(
                {
                    _id:
                        request.params.id,

                    isActive:
                        true
                }
            )
            .populate(
                "department"
            )
            .populate(
                {
                    path: "user",
                    select:
                        "name email phone profilePhoto"
                }
            );

        if (!doctor)
        {
            return response.status(404).json(
                {
                    success: false,

                    message:
                        "Doctor not found"
                }
            );
        }

        return response.json(
            {
                success: true,

                doctor:
                {
                    _id:
                        doctor._id,

                    doctorId:
                        doctor.doctorId,

                    name:
                        doctor.user?.name ||
                        "Doctor",

                    email:
                        doctor.user?.email ||
                        "",

                    phone:
                        doctor.user?.phone ||
                        "",

                    specialization:
                        doctor.specialization ||
                        "",

                    department:
                        doctor.department?.name ||
                        "",

                    qualification:
                        doctor.qualification ||
                        "",

                    experience:
                        doctor.experience ||
                        0,

                    consultationFee:
                        doctor.consultationFee ||
                        0,

                    profilePhoto:
                        doctor.profilePhoto ||
                        doctor.user?.profilePhoto ||
                        "",

                    availableDays:
                        doctor.availableDays ||
                        [],

                    startTime:
                        doctor.startTime ||
                        "",

                    endTime:
                        doctor.endTime ||
                        "",

                    isActive:
                        doctor.isActive,

                    isAvailable:
                        doctor.isAvailable
                }
            }
        );
    }
    catch (error)
    {
        console.error(
            "Get doctor details error:",
            error
        );

        return response.status(500).json(
            {
                success: false,

                message:
                    "Unable to fetch doctor",

                error:
                    error.message
            }
        );
    }
};


const getAllPatients =
async (
    request,
    response
) =>
{
    try
    {
        const patients =
            await Patient.find()
            .populate(
                {
                    path: "user",
                    select:
                        "name email phone profilePhoto isActive lastLogin createdAt"
                }
            )
            .sort(
                {
                    createdAt: -1
                }
            );

        const formattedPatients =
            patients.map(
                patient =>
                ({
                    _id:
                        patient._id,

                    patientId:
                        patient.patientId,

                    name:
                        patient.user?.name ||
                        "Patient",

                    email:
                        patient.user?.email ||
                        "",

                    phone:
                        patient.user?.phone ||
                        "",

                    dateOfBirth:
                        patient.dateOfBirth,

                    gender:
                        patient.gender,

                    bloodGroup:
                        patient.bloodGroup,

                    address:
                        patient.address,

                    emergencyContactName:
                        patient.emergencyContactName,

                    emergencyContactPhone:
                        patient.emergencyContactPhone,

                    profilePhoto:
                        patient.profilePhoto ||
                        patient.user?.profilePhoto ||
                        "",

                    medicalHistory:
                        patient.medicalHistory,

                    isActive:
                        patient.user?.isActive ??
                        true,

                    lastLogin:
                        patient.user?.lastLogin ||
                        null,

                    createdAt:
                        patient.createdAt
                })
            );

        return response.json(
            {
                success: true,

                count:
                    formattedPatients.length,

                patients:
                    formattedPatients
            }
        );
    }
    catch (error)
    {
        console.error(
            "Get all patients error:",
            error
        );

        return response.status(500).json(
            {
                success: false,

                message:
                    "Unable to fetch patients",

                error:
                    error.message
            }
        );
    }
};


const getPatientById =
async (
    request,
    response
) =>
{
    try
    {
        const patient =
            await Patient.findById(
                request.params.id
            )
            .populate(
                {
                    path: "user",
                    select:
                        "name email phone profilePhoto isActive lastLogin createdAt"
                }
            );

        if (!patient)
        {
            return response.status(404).json(
                {
                    success: false,

                    message:
                        "Patient not found"
                }
            );
        }

        return response.json(
            {
                success: true,

                patient:
                {
                    _id:
                        patient._id,

                    patientId:
                        patient.patientId,

                    name:
                        patient.user?.name ||
                        "Patient",

                    email:
                        patient.user?.email ||
                        "",

                    phone:
                        patient.user?.phone ||
                        "",

                    dateOfBirth:
                        patient.dateOfBirth,

                    gender:
                        patient.gender,

                    bloodGroup:
                        patient.bloodGroup,

                    address:
                        patient.address,

                    emergencyContactName:
                        patient.emergencyContactName,

                    emergencyContactPhone:
                        patient.emergencyContactPhone,

                    profilePhoto:
                        patient.profilePhoto ||
                        patient.user?.profilePhoto ||
                        "",

                    medicalHistory:
                        patient.medicalHistory,

                    isActive:
                        patient.user?.isActive ??
                        true,

                    lastLogin:
                        patient.user?.lastLogin ||
                        null,

                    createdAt:
                        patient.createdAt
                }
            }
        );
    }
    catch (error)
    {
        console.error(
            "Get patient details error:",
            error
        );

        return response.status(500).json(
            {
                success: false,

                message:
                    "Unable to fetch patient",

                error:
                    error.message
            }
        );
    }
};


/* ========================= */
/* PATIENT DASHBOARD */
/* ========================= */

const getPatientDashboard =
async (
    request,
    response
) =>
{
    try
    {
        const patient =
            await Patient.findOne(
                {
                    user:
                        request.user._id
                }
            );

        if (!patient)
        {
            return response.status(404).json(
                {
                    success: false,

                    message:
                        "Patient profile not found"
                }
            );
        }


        const availableDoctors =
            await Doctor.countDocuments(
                {
                    isActive: true,
                    isAvailable: true
                }
            );


        const totalAppointments =
            await Appointment.countDocuments(
                {
                    patient:
                        patient._id
                }
            );


        const upcomingAppointments =
            await Appointment.find(
                {
                    patient:
                        patient._id,

                    appointmentDate:
                    {
                        $gte:
                            new Date()
                    },

                    status:
                    {
                        $in:
                        [
                            "BOOKED",
                            "CONFIRMED"
                        ]
                    }
                }
            )
            .populate(
                {
                    path: "doctor",
                    populate:
                    {
                        path: "user",
                        select:
                            "name"
                    }
                }
            )
            .populate(
                "department"
            )
            .sort(
                {
                    appointmentDate: 1
                }
            )
            .limit(5);


        const healthcareTeam =
            await Appointment.distinct(
                "doctor",
                {
                    patient:
                        patient._id,

                    status:
                    {
                        $ne:
                            "CANCELLED"
                    }
                }
            );


        const formattedAppointments =
            upcomingAppointments.map(
                appointment =>
                ({
                    _id:
                        appointment._id,

                    appointmentId:
                        appointment.appointmentId,

                    doctorName:
                        appointment.doctor?.user?.name ||
                        "Doctor",

                    specialization:
                        appointment.doctor?.specialization ||
                        "",

                    department:
                        appointment.department?.name ||
                        "",

                    appointmentDate:
                        appointment.appointmentDate,

                    appointmentTime:
                        appointment.appointmentTime,

                    reason:
                        appointment.reason ||
                        "",

                    status:
                        appointment.status
                })
            );


        return response.json(
            {
                success: true,

                statistics:
                {
                    availableDoctors,

                    totalAppointments,

                    upcomingAppointments:
                        upcomingAppointments.length,

                    healthcareTeam:
                        healthcareTeam.length
                },

                appointments:
                    formattedAppointments
            }
        );
    }
    catch (error)
    {
        console.error(
            "Patient dashboard error:",
            error
        );

        return response.status(500).json(
            {
                success: false,

                message:
                    "Unable to load patient dashboard",

                error:
                    error.message
            }
        );
    }
};


/* ========================= */
/* GET MY PROFILE */
/* ========================= */

const getMyProfile =
async (
    request,
    response
) =>
{
    try
    {
        const patient =
            await Patient.findOne(
                {
                    user:
                        request.user._id
                }
            )
            .populate(
                {
                    path: "user",
                    select:
                        "name email phone profilePhoto isActive lastLogin createdAt"
                }
            );

        if (!patient)
        {
            return response.status(404).json(
                {
                    success: false,

                    message:
                        "Patient profile not found"
                }
            );
        }

        return response.json(
            {
                success: true,

                patient:
                {
                    _id:
                        patient._id,

                    patientId:
                        patient.patientId,

                    name:
                        patient.user?.name ||
                        "Patient",

                    email:
                        patient.user?.email ||
                        "",

                    phone:
                        patient.user?.phone ||
                        "",

                    dateOfBirth:
                        patient.dateOfBirth,

                    gender:
                        patient.gender,

                    bloodGroup:
                        patient.bloodGroup,

                    address:
                        patient.address,

                    emergencyContactName:
                        patient.emergencyContactName,

                    emergencyContactPhone:
                        patient.emergencyContactPhone,

                    profilePhoto:
                        patient.profilePhoto ||
                        patient.user?.profilePhoto ||
                        "",

                    medicalHistory:
                        patient.medicalHistory,

                    isActive:
                        patient.user?.isActive ??
                        true,

                    lastLogin:
                        patient.user?.lastLogin ||
                        null,

                    createdAt:
                        patient.createdAt
                }
            }
        );
    }
    catch (error)
    {
        console.error(
            "Get my profile error:",
            error
        );

        return response.status(500).json(
            {
                success: false,

                message:
                    "Unable to fetch profile",

                error:
                    error.message
            }
        );
    }
};


/* ========================= */
/* UPDATE MY PROFILE */
/* ========================= */

const updateMyProfile =
async (
    request,
    response
) =>
{
    try
    {
        const patient =
            await Patient.findOne(
                {
                    user:
                        request.user._id
                }
            );

        if (!patient)
        {
            return response.status(404).json(
                {
                    success: false,

                    message:
                        "Patient profile not found"
                }
            );
        }

        const user =
            await User.findById(
                request.user._id
            );

        if (!user)
        {
            return response.status(404).json(
                {
                    success: false,

                    message:
                        "User not found"
                }
            );
        }

        const
        {
            name,
            phone,
            dateOfBirth,
            gender,
            bloodGroup,
            address,
            emergencyContactName,
            emergencyContactPhone,
            profilePhoto
        } =
            request.body;


        if (name !== undefined)
        {
            user.name =
                name.trim();
        }


        if (phone !== undefined)
        {
            user.phone =
                phone.trim();
        }


        if (dateOfBirth !== undefined)
        {
            patient.dateOfBirth =
                dateOfBirth;
        }


        if (gender !== undefined)
        {
            patient.gender =
                gender;
        }


        if (bloodGroup !== undefined)
        {
            patient.bloodGroup =
                bloodGroup;
        }


        if (address !== undefined)
        {
            patient.address =
                address;
        }


        if (
            emergencyContactName !==
            undefined
        )
        {
            patient.emergencyContactName =
                emergencyContactName;
        }


        if (
            emergencyContactPhone !==
            undefined
        )
        {
            patient.emergencyContactPhone =
                emergencyContactPhone;
        }


        if (profilePhoto !== undefined)
        {
            patient.profilePhoto =
                profilePhoto;
        }


        await user.save();

        await patient.save();


        return response.json(
            {
                success: true,

                message:
                    "Profile updated successfully"
            }
        );
    }
    catch (error)
    {
        console.error(
            "Update my profile error:",
            error
        );

        return response.status(500).json(
            {
                success: false,

                message:
                    "Unable to update profile",

                error:
                    error.message
            }
        );
    }
};


module.exports =
{
    getDoctors,

    getDoctorById,

    getAllPatients,

    getPatientById,

    getPatientDashboard,

    getMyProfile,

    updateMyProfile
};