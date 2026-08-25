const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Department = require("../models/Department");
const Schedule = require("../models/Schedule");
const Patient = require("../models/Patient");
const Superintendent = require("../models/Superintendent");
const Appointment = require("../models/Appointment");
const ExcelJS = require("exceljs");
const generateId = require("../utils/generateId");

const parseAvailableDays = (availableDays) =>
{
    if (!availableDays)
    {
        return [];
    }

    if (Array.isArray(availableDays))
    {
        return availableDays;
    }

    try
    {
        const parsedDays =
            JSON.parse(availableDays);

        if (!Array.isArray(parsedDays))
        {
            return [];
        }

        return parsedDays;
    }
    catch (error)
    {
        return null;
    }
};

const getNextDoctorId = async () =>
{
    const doctors =
        await Doctor.find(
            {
                doctorId:
                {
                    $regex:
                        /^DOC\d+$/
                }
            }
        )
        .select(
            "doctorId"
        )
        .lean();

    let highestNumber =
        0;

    for (
        const doctor
        of doctors
    )
    {
        const number =
            parseInt(
                doctor.doctorId.replace(
                    "DOC",
                    ""
                ),
                10
            );

        if (
            !Number.isNaN(number) &&
            number > highestNumber
        )
        {
            highestNumber =
                number;
        }
    }

    return generateId(
        "DOC",
        highestNumber + 1
    );
};

const createDoctor = async (request, response) =>
{
    try
    {
        const
        {
            name,
            email,
            password,
            phone,
            specialization,
            department,
            qualification,
            experience,
            consultationFee,
            about,
            availableDays,
            startTime,
            endTime,
            slotDuration,
            breakStart,
            breakEnd
        } = request.body;

        if (
            !name ||
            !email ||
            !password ||
            !phone ||
            !specialization ||
            !department ||
            !qualification ||
            experience === undefined ||
            consultationFee === undefined
        )
        {
            return response.status(400).json(
                {
                    success: false,
                    message:
                        "All required doctor fields must be provided"
                }
            );
        }

        const parsedAvailableDays =
            parseAvailableDays(
                availableDays
            );

        if (parsedAvailableDays === null)
        {
            return response.status(400).json(
                {
                    success: false,
                    message:
                        "Available days must be a valid JSON array"
                }
            );
        }

        const existingUser =
            await User.findOne(
                {
                    email:
                        email.toLowerCase()
                }
            );

        if (existingUser)
        {
            return response.status(409).json(
                {
                    success: false,
                    message:
                        "A user with this email already exists"
                }
            );
        }

        const departmentExists =
            await Department.findById(
                department
            );

        if (!departmentExists)
        {
            return response.status(404).json(
                {
                    success: false,
                    message:
                        "Department not found"
                }
            );
        }

        const hashedPassword =
            await bcrypt.hash(
                password,
                12
            );

        const profilePhoto =
            request.file
                ? `/uploads/doctors/${request.file.filename}`
                : "";

        const user =
            await User.create(
                {
                    name,
                    email:
                        email.toLowerCase(),
                    password:
                        hashedPassword,
                    phone,
                    role:
                        "DOCTOR",
                    profilePhoto
                }
            );

        const doctorId =
            await getNextDoctorId();

        let doctor;

        try
        {
            doctor =
                await Doctor.create(
                    {
                        user:
                            user._id,
                        doctorId,
                        specialization,
                        department:
                            departmentExists._id,
                        qualification,
                        experience:
                            Number(experience),
                        consultationFee:
                            Number(consultationFee),
                        about:
                            about || "",
                        profilePhoto,
                        phone,
                        availableDays:
                            parsedAvailableDays,
                        isAvailable:
                            true,
                        isActive:
                            true
                    }
                );
        }
        catch (doctorError)
        {
            await User.findByIdAndDelete(
                user._id
            );

            throw doctorError;
        }

        if (
            startTime &&
            endTime &&
            parsedAvailableDays.length > 0
        )
        {
            try
            {
                for (
                    const day
                    of parsedAvailableDays
                )
                {
                    await Schedule.create(
                        {
                            doctor:
                                doctor._id,
                            dayOfWeek:
                                day,
                            startTime,
                            endTime,
                            slotDuration:
                                Number(
                                    slotDuration
                                ) || 30,
                            breakStart:
                                breakStart || "",
                            breakEnd:
                                breakEnd || "",
                            isAvailable:
                                true
                        }
                    );
                }
            }
            catch (scheduleError)
            {
                await Schedule.deleteMany(
                    {
                        doctor:
                            doctor._id
                    }
                );

                await Doctor.findByIdAndDelete(
                    doctor._id
                );

                await User.findByIdAndDelete(
                    user._id
                );

                throw scheduleError;
            }
        }

        const populatedDoctor =
            await Doctor.findById(
                doctor._id
            )
            .populate(
                {
                    path: "user",
                    select:
                        "-password"
                }
            )
            .populate(
                "department"
            );

        const schedules =
            await Schedule.find(
                {
                    doctor:
                        doctor._id
                }
            ).sort(
                {
                    dayOfWeek:
                        1
                }
            );

        response.status(201).json(
            {
                success: true,
                message:
                    "Doctor created successfully",
                doctor:
                    populatedDoctor,
                schedules
            }
        );
    }
    catch (error)
    {
        console.error(
            "Doctor creation error:",
            error
        );

        response.status(500).json(
            {
                success: false,
                message:
                    "Doctor creation failed",
                error:
                    error.message
            }
        );
    }
};

const getAllDoctors = async (request, response) =>
{
    try
    {
        const
        {
            search,
            department,
            status
        } = request.query;

        const doctors =
            await Doctor.find()
                .populate(
                    {
                        path:
                            "user",
                        select:
                            "-password"
                    }
                )
                .populate(
                    "department"
                )
                .sort(
                    {
                        createdAt:
                            -1
                    }
                );

        let filteredDoctors =
            doctors;

        if (search)
        {
            const searchValue =
                search
                    .toLowerCase()
                    .trim();

            filteredDoctors =
                filteredDoctors.filter(
                    (doctor) =>
                    {
                        const doctorName =
                            doctor.user?.name
                                ?.toLowerCase() ||
                            "";

                        const specialization =
                            doctor.specialization
                                ?.toLowerCase() ||
                            "";

                        const doctorId =
                            doctor.doctorId
                                ?.toLowerCase() ||
                            "";

                        const departmentName =
                            doctor.department?.name
                                ?.toLowerCase() ||
                            "";

                        return (
                            doctorName.includes(
                                searchValue
                            ) ||
                            specialization.includes(
                                searchValue
                            ) ||
                            doctorId.includes(
                                searchValue
                            ) ||
                            departmentName.includes(
                                searchValue
                            )
                        );
                    }
                );
        }

        if (department)
        {
            filteredDoctors =
                filteredDoctors.filter(
                    (doctor) =>
                    {
                        return (
                            doctor.department &&
                            doctor.department._id.toString() ===
                                department
                        );
                    }
                );
        }

        if (status === "active")
        {
            filteredDoctors =
                filteredDoctors.filter(
                    (doctor) =>
                        doctor.isActive ===
                        true
                );
        }

        if (status === "inactive")
        {
            filteredDoctors =
                filteredDoctors.filter(
                    (doctor) =>
                        doctor.isActive ===
                        false
                );
        }

        response.json(
            {
                success: true,
                count:
                    filteredDoctors.length,
                doctors:
                    filteredDoctors
            }
        );
    }
    catch (error)
    {
        console.error(
            "Get doctors error:",
            error
        );

        response.status(500).json(
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

const getDoctorById = async (request, response) =>
{
    try
    {
        const doctor =
            await Doctor.findById(
                request.params.id
            )
            .populate(
                {
                    path:
                        "user",
                    select:
                        "-password"
                }
            )
            .populate(
                "department"
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

        const schedules =
            await Schedule.find(
                {
                    doctor:
                        doctor._id
                }
            ).sort(
                {
                    dayOfWeek:
                        1
                }
            );

        response.json(
            {
                success: true,
                doctor,
                schedules
            }
        );
    }
    catch (error)
    {
        console.error(
            "Get doctor error:",
            error
        );

        response.status(500).json(
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

const updateDoctor = async (request, response) =>
{
    try
    {
        const doctor =
            await Doctor.findById(
                request.params.id
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

        const user =
            await User.findById(
                doctor.user
            );

        if (!user)
        {
            return response.status(404).json(
                {
                    success: false,
                    message:
                        "Doctor user account not found"
                }
            );
        }

        const
        {
            name,
            email,
            phone,
            specialization,
            department,
            qualification,
            experience,
            consultationFee,
            about,
            availableDays,
            startTime,
            endTime,
            slotDuration,
            breakStart,
            breakEnd
        } = request.body;

        if (
            email &&
            email.toLowerCase() !==
                user.email
        )
        {
            const emailExists =
                await User.findOne(
                    {
                        email:
                            email.toLowerCase(),
                        _id:
                        {
                            $ne:
                                user._id
                        }
                    }
                );

            if (emailExists)
            {
                return response.status(409).json(
                    {
                        success: false,
                        message:
                            "Email already belongs to another user"
                    }
                );
            }

            user.email =
                email.toLowerCase();
        }

        if (name)
        {
            user.name =
                name;
        }

        if (phone)
        {
            user.phone =
                phone;

            doctor.phone =
                phone;
        }

        if (request.file)
        {
            const profilePhoto =
                `/uploads/doctors/${request.file.filename}`;

            user.profilePhoto =
                profilePhoto;

            doctor.profilePhoto =
                profilePhoto;
        }

        if (specialization)
        {
            doctor.specialization =
                specialization;
        }

        if (department)
        {
            const departmentExists =
                await Department.findById(
                    department
                );

            if (!departmentExists)
            {
                return response.status(404).json(
                    {
                        success: false,
                        message:
                            "Department not found"
                    }
                );
            }

            doctor.department =
                department;
        }

        if (qualification)
        {
            doctor.qualification =
                qualification;
        }

        if (experience !== undefined)
        {
            doctor.experience =
                Number(experience);
        }

        if (
            consultationFee !==
            undefined
        )
        {
            doctor.consultationFee =
                Number(
                    consultationFee
                );
        }

        if (about !== undefined)
        {
            doctor.about =
                about;
        }

        const parsedAvailableDays =
            availableDays !== undefined
                ? parseAvailableDays(
                    availableDays
                )
                : doctor.availableDays;

        if (
            parsedAvailableDays ===
            null
        )
        {
            return response.status(400).json(
                {
                    success: false,
                    message:
                        "Available days must be a valid JSON array"
                }
            );
        }

        if (
            availableDays !==
            undefined
        )
        {
            doctor.availableDays =
                parsedAvailableDays;
        }

        await user.save();

        await doctor.save();

        if (
            startTime &&
            endTime &&
            availableDays !==
                undefined
        )
        {
            await Schedule.deleteMany(
                {
                    doctor:
                        doctor._id
                }
            );

            for (
                const day
                of parsedAvailableDays
            )
            {
                await Schedule.create(
                    {
                        doctor:
                            doctor._id,
                        dayOfWeek:
                            day,
                        startTime,
                        endTime,
                        slotDuration:
                            Number(
                                slotDuration
                            ) || 30,
                        breakStart:
                            breakStart || "",
                        breakEnd:
                            breakEnd || "",
                        isAvailable:
                            true
                    }
                );
            }
        }

        const updatedDoctor =
            await Doctor.findById(
                doctor._id
            )
            .populate(
                {
                    path:
                        "user",
                    select:
                        "-password"
                }
            )
            .populate(
                "department"
            );

        const schedules =
            await Schedule.find(
                {
                    doctor:
                        doctor._id
                }
            );

        response.json(
            {
                success: true,
                message:
                    "Doctor updated successfully",
                doctor:
                    updatedDoctor,
                schedules
            }
        );
    }
    catch (error)
    {
        console.error(
            "Doctor update error:",
            error
        );

        response.status(500).json(
            {
                success: false,
                message:
                    "Doctor update failed",
                error:
                    error.message
            }
        );
    }
};

const updateDoctorStatus =
    async (request, response) =>
{
    try
    {
        const doctor =
            await Doctor.findById(
                request.params.id
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

        const isActive =
            Boolean(
                request.body.isActive
            );

        doctor.isActive =
            isActive;

        doctor.isAvailable =
            isActive;

        await doctor.save();

        await User.findByIdAndUpdate(
            doctor.user,
            {
                isActive
            }
        );

        response.json(
            {
                success: true,
                message:
                    isActive
                        ? "Doctor activated successfully"
                        : "Doctor deactivated successfully",
                doctor
            }
        );
    }
    catch (error)
    {
        console.error(
            "Doctor status error:",
            error
        );

        response.status(500).json(
            {
                success: false,
                message:
                    "Unable to update doctor status",
                error:
                    error.message
            }
        );
    }
};

const getDepartments =
    async (request, response) =>
{
    try
    {
        const departments =
            await Department.find(
                {
                    isActive:
                        true
                }
            ).sort(
                {
                    name:
                        1
                }
            );

        response.json(
            {
                success: true,
                departments
            }
        );
    }
    catch (error)
    {
        console.error(
            "Get departments error:",
            error
        );

        response.status(500).json(
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

const getDashboard =
    async (request, response) =>
{
    try
    {
        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const day =
            String(
                today.getDate()
            ).padStart(
                2,
                "0"
            );

        const todayString =
            `${year}-${month}-${day}`;

        const
        [
            totalDoctors,
            activeDoctors,
            inactiveDoctors,
            totalPatients,
            totalSuperintendents,
            totalDepartments,
            todayAppointments,
            upcomingAppointments,
            completedAppointments,
            cancelledAppointments,
            noShowAppointments,
            totalAppointments
        ] =
        await Promise.all(
            [
                Doctor.countDocuments(),

                Doctor.countDocuments(
                    {
                        isActive:
                            true
                    }
                ),

                Doctor.countDocuments(
                    {
                        isActive:
                            false
                    }
                ),

                Patient.countDocuments(),

                Superintendent.countDocuments(),

                Department.countDocuments(),

                Appointment.countDocuments(
                    {
                        appointmentDate:
                            todayString
                    }
                ),

                Appointment.countDocuments(
                    {
                        appointmentDate:
                        {
                            $gt:
                                todayString
                        },
                        status:
                            "CONFIRMED"
                    }
                ),

                Appointment.countDocuments(
                    {
                        status:
                            "COMPLETED"
                    }
                ),

                Appointment.countDocuments(
                    {
                        status:
                            "CANCELLED"
                    }
                ),

                Appointment.countDocuments(
                    {
                        status:
                            "NO_SHOW"
                    }
                ),

                Appointment.countDocuments()
            ]
        );

        const recentAppointments =
            await Appointment.find()
                .populate(
                    {
                        path:
                            "patient",
                        populate:
                        {
                            path:
                                "user",
                            select:
                                "name email phone"
                        }
                    }
                )
                .populate(
                    {
                        path:
                            "doctor",
                        populate:
                        {
                            path:
                                "user",
                            select:
                                "name email"
                        }
                    }
                )
                .populate(
                    "department"
                )
                .sort(
                    {
                        createdAt:
                            -1
                    }
                )
                .limit(
                    10
                );

        response.json(
            {
                success:
                    true,

                dashboard:
                {
                    statistics:
                    {
                        totalDoctors,
                        activeDoctors,
                        inactiveDoctors,
                        totalPatients,
                        totalSuperintendents,
                        totalDepartments,
                        todayAppointments,
                        upcomingAppointments,
                        completedAppointments,
                        cancelledAppointments,
                        noShowAppointments,
                        totalAppointments
                    },

                    recentAppointments
                }
            }
        );
    }
    catch (error)
    {
        console.error(
            "Admin dashboard error:",
            error
        );

        response.status(500).json(
            {
                success:
                    false,
                message:
                    "Unable to load admin dashboard",
                error:
                    error.message
            }
        );
    }
};

const getAllPatients =
    async (request, response) =>
{
    try
    {
        const
        {
            search
        } = request.query;

        const patients =
            await Patient.find()
                .populate(
                    {
                        path:
                            "user",
                        select:
                            "-password"
                    }
                )
                .sort(
                    {
                        createdAt:
                            -1
                    }
                );

        let filteredPatients =
            patients;

        if (search)
        {
            const searchValue =
                search
                    .toLowerCase()
                    .trim();

            filteredPatients =
                patients.filter(
                    (patient) =>
                    {
                        const name =
                            patient.user
                                ?.name
                                ?.toLowerCase() ||
                            "";

                        const email =
                            patient.user
                                ?.email
                                ?.toLowerCase() ||
                            "";

                        const patientId =
                            patient.patientId
                                ?.toLowerCase() ||
                            "";

                        const phone =
                            patient.user
                                ?.phone
                                ?.toLowerCase() ||
                            "";

                        return (
                            name.includes(
                                searchValue
                            ) ||
                            email.includes(
                                searchValue
                            ) ||
                            patientId.includes(
                                searchValue
                            ) ||
                            phone.includes(
                                searchValue
                            )
                        );
                    }
                );
        }

        response.json(
            {
                success:
                    true,
                count:
                    filteredPatients.length,
                patients:
                    filteredPatients
            }
        );
    }
    catch (error)
    {
        console.error(
            "Admin patients error:",
            error
        );

        response.status(500).json(
            {
                success:
                    false,
                message:
                    "Unable to fetch patients",
                error:
                    error.message
            }
        );
    }
};

const getAllAppointments =
    async (request, response) =>
{
    try
    {
        const
        {
            date,
            status,
            doctor,
            department
        } = request.query;

        const query = {};

        if (date)
        {
            query.appointmentDate =
                date;
        }

        if (status)
        {
            query.status =
                status;
        }

        if (doctor)
        {
            query.doctor =
                doctor;
        }

        if (department)
        {
            query.department =
                department;
        }

        const appointments =
            await Appointment.find(
                query
            )
            .populate(
                {
                    path:
                        "patient",
                    populate:
                    {
                        path:
                            "user",
                        select:
                            "-password"
                    }
                }
            )
            .populate(
                {
                    path:
                        "doctor",
                    populate:
                    {
                        path:
                            "user",
                        select:
                            "-password"
                    }
                }
            )
            .populate(
                "department"
            )
            .sort(
                {
                    appointmentDate:
                        1,
                    appointmentTime:
                        1
                }
            );

        response.json(
            {
                success:
                    true,
                count:
                    appointments.length,
                appointments
            }
        );
    }
    catch (error)
    {
        console.error(
            "Admin appointments error:",
            error
        );

        response.status(500).json(
            {
                success:
                    false,
                message:
                    "Unable to fetch appointments",
                error:
                    error.message
            }
        );
    }
};

const exportHospitalAppointments =
    async (request, response) =>
{
    try
    {
        const
        {
            date,
            status,
            doctor,
            department
        } = request.query;

        const query = {};

        if (date)
        {
            query.appointmentDate =
                date;
        }

        if (status)
        {
            query.status =
                status;
        }

        if (doctor)
        {
            query.doctor =
                doctor;
        }

        if (department)
        {
            query.department =
                department;
        }

        const appointments =
            await Appointment.find(
                query
            )
            .populate(
                {
                    path:
                        "patient",
                    populate:
                    {
                        path:
                            "user",
                        select:
                            "-password"
                    }
                }
            )
            .populate(
                {
                    path:
                        "doctor",
                    populate:
                    {
                        path:
                            "user",
                        select:
                            "-password"
                    }
                }
            )
            .populate(
                "department"
            )
            .sort(
                {
                    appointmentDate:
                        1,
                    appointmentTime:
                        1
                }
            );

        const workbook =
            new ExcelJS.Workbook();

        const worksheet =
            workbook.addWorksheet(
                "Hospital Appointments"
            );

        worksheet.columns =
        [
            {
                header:
                    "Appointment ID",
                key:
                    "appointmentId",
                width:
                    18
            },
            {
                header:
                    "Patient ID",
                key:
                    "patientId",
                width:
                    18
            },
            {
                header:
                    "Patient Name",
                key:
                    "patientName",
                width:
                    25
            },
            {
                header:
                    "Patient Phone",
                key:
                    "patientPhone",
                width:
                    18
            },
            {
                header:
                    "Doctor ID",
                key:
                    "doctorId",
                width:
                    18
            },
            {
                header:
                    "Doctor Name",
                key:
                    "doctorName",
                width:
                    25
            },
            {
                header:
                    "Specialization",
                key:
                    "specialization",
                width:
                    28
            },
            {
                header:
                    "Department",
                key:
                    "department",
                width:
                    22
            },
            {
                header:
                    "Date",
                key:
                    "date",
                width:
                    15
            },
            {
                header:
                    "Time",
                key:
                    "time",
                width:
                    12
            },
            {
                header:
                    "Reason",
                key:
                    "reason",
                width:
                    30
            },
            {
                header:
                    "Symptoms",
                key:
                    "symptoms",
                width:
                    35
            },
            {
                header:
                    "Status",
                key:
                    "status",
                width:
                    18
            },
            {
                header:
                    "Notes",
                key:
                    "notes",
                width:
                    35
            }
        ];

        for (
            const appointment
            of appointments
        )
        {
            worksheet.addRow(
                {
                    appointmentId:
                        appointment.appointmentId,

                    patientId:
                        appointment.patient
                            ?.patientId ||
                        "",

                    patientName:
                        appointment.patient
                            ?.user?.name ||
                        "",

                    patientPhone:
                        appointment.patient
                            ?.user?.phone ||
                        "",

                    doctorId:
                        appointment.doctor
                            ?.doctorId ||
                        "",

                    doctorName:
                        appointment.doctor
                            ?.user?.name ||
                        "",

                    specialization:
                        appointment.doctor
                            ?.specialization ||
                        "",

                    department:
                        appointment.department
                            ?.name ||
                        "",

                    date:
                        appointment.appointmentDate,

                    time:
                        appointment.appointmentTime,

                    reason:
                        appointment.reason,

                    symptoms:
                        appointment.symptoms,

                    status:
                        appointment.status,

                    notes:
                        appointment.notes
                }
            );
        }

        worksheet.getRow(
            1
        ).font =
        {
            bold:
                true
        };

        worksheet.views =
        [
            {
                state:
                    "frozen",
                ySplit:
                    1
            }
        ];

        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const day =
            String(
                today.getDate()
            ).padStart(
                2,
                "0"
            );

        response.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        response.setHeader(
            "Content-Disposition",
            `attachment; filename="admin-hospital-report-${year}-${month}-${day}.xlsx"`
        );

        await workbook.xlsx.write(
            response
        );

        response.end();
    }
    catch (error)
    {
        console.error(
            "Admin Excel export error:",
            error
        );

        response.status(500).json(
            {
                success:
                    false,
                message:
                    "Unable to export hospital report",
                error:
                    error.message
            }
        );
    }
};

module.exports =
{
    createDoctor,
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    updateDoctorStatus,
    getDepartments,
    getDashboard,
    getAllPatients,
    getAllAppointments,
    exportHospitalAppointments
};