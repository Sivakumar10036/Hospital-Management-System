const bcrypt =
    require("bcryptjs");

const User =
    require("../models/User");

const Doctor =
    require("../models/Doctor");

const Department =
    require("../models/Department");

const Schedule =
    require("../models/Schedule");

const generateId =
    require("../utils/generateId");

const getDoctorFromUser = async (userId) =>
{
    return await Doctor.findOne(
        {
            user: userId
        }
    )
    .populate(
        {
            path: "user",
            select: "-password"
        }
    )
    .populate("department");
};

const getTodayString = () =>
{
    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const getDashboard = async (request, response) =>
{
    try
    {
        const doctor =
            await getDoctorFromUser(
                request.user._id
            );

        if (!doctor)
        {
            return response.status(404).json(
                {
                    success: false,
                    message:
                        "Doctor profile not found"
                }
            );
        }

        const today =
            getTodayString();

        const [
            todayAppointments,
            upcomingAppointments,
            completedAppointments,
            cancelledAppointments,
            totalAppointments
        ] = await Promise.all(
            [
                Appointment.countDocuments(
                    {
                        doctor: doctor._id,
                        appointmentDate: today,
                        status: "CONFIRMED"
                    }
                ),

                Appointment.countDocuments(
                    {
                        doctor: doctor._id,
                        appointmentDate:
                        {
                            $gt: today
                        },
                        status: "CONFIRMED"
                    }
                ),

                Appointment.countDocuments(
                    {
                        doctor: doctor._id,
                        status: "COMPLETED"
                    }
                ),

                Appointment.countDocuments(
                    {
                        doctor: doctor._id,
                        status: "CANCELLED"
                    }
                ),

                Appointment.countDocuments(
                    {
                        doctor: doctor._id
                    }
                )
            ]
        );

        response.json(
            {
                success: true,
                dashboard:
                {
                    doctor:
                    {
                        id: doctor._id,
                        doctorId:
                            doctor.doctorId,
                        specialization:
                            doctor.specialization,
                        profilePhoto:
                            doctor.profilePhoto
                    },

                    statistics:
                    {
                        todayAppointments,
                        upcomingAppointments,
                        completedAppointments,
                        cancelledAppointments,
                        totalAppointments
                    }
                }
            }
        );
    }
    catch (error)
    {
        console.error(
            "Doctor dashboard error:",
            error
        );

        response.status(500).json(
            {
                success: false,
                message:
                    "Unable to load doctor dashboard",
                error: error.message
            }
        );
    }
};

const getDoctorAppointments =
    async (request, response) =>
{
    try
    {
        const doctor =
            await getDoctorFromUser(
                request.user._id
            );

        if (!doctor)
        {
            return response.status(404).json(
                {
                    success: false,
                    message:
                        "Doctor profile not found"
                }
            );
        }

        const
        {
            date,
            status
        } = request.query;

        const query =
        {
            doctor: doctor._id
        };

        if (date)
        {
            query.appointmentDate = date;
        }

        if (status)
        {
            query.status = status;
        }

        const appointments =
            await Appointment.find(query)
                .populate(
                    {
                        path: "patient",
                        populate:
                        {
                            path: "user",
                            select:
                                "-password"
                        }
                    }
                )
                .populate("department")
                .sort(
                    {
                        appointmentDate: 1,
                        appointmentTime: 1
                    }
                );

        response.json(
            {
                success: true,
                count:
                    appointments.length,
                appointments
            }
        );
    }
    catch (error)
    {
        console.error(
            "Doctor appointments error:",
            error
        );

        response.status(500).json(
            {
                success: false,
                message:
                    "Unable to fetch doctor appointments",
                error: error.message
            }
        );
    }
};

const getDoctorAppointmentById =
    async (request, response) =>
{
    try
    {
        const doctor =
            await getDoctorFromUser(
                request.user._id
            );

        if (!doctor)
        {
            return response.status(404).json(
                {
                    success: false,
                    message:
                        "Doctor profile not found"
                }
            );
        }

        const appointment =
            await Appointment.findOne(
                {
                    _id:
                        request.params.id,
                    doctor:
                        doctor._id
                }
            )
            .populate(
                {
                    path: "patient",
                    populate:
                    {
                        path: "user",
                        select:
                            "-password"
                    }
                }
            )
            .populate("department")
            .populate(
                {
                    path: "doctor",
                    populate:
                    {
                        path: "user",
                        select:
                            "-password"
                    }
                }
            );

        if (!appointment)
        {
            return response.status(404).json(
                {
                    success: false,
                    message:
                        "Appointment not found"
                }
            );
        }

        response.json(
            {
                success: true,
                appointment
            }
        );
    }
    catch (error)
    {
        console.error(
            "Doctor appointment details error:",
            error
        );

        response.status(500).json(
            {
                success: false,
                message:
                    "Unable to fetch appointment",
                error: error.message
            }
        );
    }
};

const updateAppointmentStatus =
    async (request, response) =>
{
    try
    {
        const doctor =
            await getDoctorFromUser(
                request.user._id
            );

        if (!doctor)
        {
            return response.status(404).json(
                {
                    success: false,
                    message:
                        "Doctor profile not found"
                }
            );
        }

        const
        {
            status,
            notes
        } = request.body;

        const allowedStatuses =
        [
            "COMPLETED",
            "NO_SHOW"
        ];

        if (!allowedStatuses.includes(status))
        {
            return response.status(400).json(
                {
                    success: false,
                    message:
                        "Doctor can only mark appointments as COMPLETED or NO_SHOW"
                }
            );
        }

        const appointment =
            await Appointment.findOne(
                {
                    _id:
                        request.params.id,
                    doctor:
                        doctor._id
                }
            );

        if (!appointment)
        {
            return response.status(404).json(
                {
                    success: false,
                    message:
                        "Appointment not found"
                }
            );
        }

        if (
            appointment.status !==
            "CONFIRMED"
        )
        {
            return response.status(400).json(
                {
                    success: false,
                    message:
                        "Only confirmed appointments can be updated"
                }
            );
        }

        appointment.status =
            status;

        if (notes !== undefined)
        {
            appointment.notes =
                notes;
        }

        await appointment.save();

        const updatedAppointment =
            await Appointment.findById(
                appointment._id
            )
            .populate(
                {
                    path: "patient",
                    populate:
                    {
                        path: "user",
                        select:
                            "-password"
                    }
                }
            )
            .populate("department");

        response.json(
            {
                success: true,
                message:
                    status === "COMPLETED"
                        ? "Appointment marked as completed"
                        : "Appointment marked as no-show",
                appointment:
                    updatedAppointment
            }
        );
    }
    catch (error)
    {
        console.error(
            "Update appointment status error:",
            error
        );

        response.status(500).json(
            {
                success: false,
                message:
                    "Unable to update appointment",
                error: error.message
            }
        );
    }
};

const updateAppointmentNotes =
    async (request, response) =>
{
    try
    {
        const doctor =
            await getDoctorFromUser(
                request.user._id
            );

        if (!doctor)
        {
            return response.status(404).json(
                {
                    success: false,
                    message:
                        "Doctor profile not found"
                }
            );
        }

        const appointment =
            await Appointment.findOne(
                {
                    _id:
                        request.params.id,
                    doctor:
                        doctor._id
                }
            );

        if (!appointment)
        {
            return response.status(404).json(
                {
                    success: false,
                    message:
                        "Appointment not found"
                }
            );
        }

        appointment.notes =
            request.body.notes || "";

        await appointment.save();

        response.json(
            {
                success: true,
                message:
                    "Appointment notes updated successfully",
                notes:
                    appointment.notes
            }
        );
    }
    catch (error)
    {
        console.error(
            "Appointment notes error:",
            error
        );

        response.status(500).json(
            {
                success: false,
                message:
                    "Unable to update appointment notes",
                error: error.message
            }
        );
    }
};

const getDoctorSchedule =
    async (request, response) =>
{
    try
    {
        const doctor =
            await getDoctorFromUser(
                request.user._id
            );

        if (!doctor)
        {
            return response.status(404).json(
                {
                    success: false,
                    message:
                        "Doctor profile not found"
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
                    dayOfWeek: 1
                }
            );

        response.json(
            {
                success: true,
                schedules
            }
        );
    }
    catch (error)
    {
        console.error(
            "Doctor schedule error:",
            error
        );

        response.status(500).json(
            {
                success: false,
                message:
                    "Unable to fetch doctor schedule",
                error: error.message
            }
        );
    }
};

const updateDoctorAvailability =
    async (request, response) =>
{
    try
    {
        const doctor =
            await getDoctorFromUser(
                request.user._id
            );

        if (!doctor)
        {
            return response.status(404).json(
                {
                    success: false,
                    message:
                        "Doctor profile not found"
                }
            );
        }

        const
        {
            isAvailable
        } = request.body;

        if (
            typeof isAvailable !==
            "boolean"
        )
        {
            return response.status(400).json(
                {
                    success: false,
                    message:
                        "isAvailable must be true or false"
                }
            );
        }

        doctor.isAvailable =
            isAvailable;

        await doctor.save();

        response.json(
            {
                success: true,
                message:
                    isAvailable
                        ? "Doctor is now available"
                        : "Doctor is now unavailable",
                isAvailable:
                    doctor.isAvailable
            }
        );
    }
    catch (error)
    {
        console.error(
            "Doctor availability error:",
            error
        );

        response.status(500).json(
            {
                success: false,
                message:
                    "Unable to update availability",
                error: error.message
            }
        );
    }
};

const exportDoctorAppointments =
    async (request, response) =>
{
    try
    {
        const doctor =
            await getDoctorFromUser(
                request.user._id
            );

        if (!doctor)
        {
            return response.status(404).json(
                {
                    success: false,
                    message:
                        "Doctor profile not found"
                }
            );
        }

        const
        {
            date,
            status
        } = request.query;

        const query =
        {
            doctor:
                doctor._id
        };

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

        const appointments =
            await Appointment.find(query)
                .populate(
                    {
                        path: "patient",
                        populate:
                        {
                            path: "user",
                            select:
                                "-password"
                        }
                    }
                )
                .populate("department")
                .sort(
                    {
                        appointmentDate: 1,
                        appointmentTime: 1
                    }
                );

        const workbook =
            new ExcelJS.Workbook();

        const worksheet =
            workbook.addWorksheet(
                "Appointments"
            );

        worksheet.columns =
        [
            {
                header: "Appointment ID",
                key: "appointmentId",
                width: 18
            },
            {
                header: "Patient ID",
                key: "patientId",
                width: 18
            },
            {
                header: "Patient Name",
                key: "patientName",
                width: 25
            },
            {
                header: "Phone",
                key: "phone",
                width: 18
            },
            {
                header: "Date",
                key: "date",
                width: 15
            },
            {
                header: "Time",
                key: "time",
                width: 12
            },
            {
                header: "Department",
                key: "department",
                width: 22
            },
            {
                header: "Reason",
                key: "reason",
                width: 30
            },
            {
                header: "Symptoms",
                key: "symptoms",
                width: 35
            },
            {
                header: "Status",
                key: "status",
                width: 16
            },
            {
                header: "Notes",
                key: "notes",
                width: 35
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
                            ?.patientId || "",

                    patientName:
                        appointment.patient
                            ?.user?.name || "",

                    phone:
                        appointment.patient
                            ?.user?.phone || "",

                    date:
                        appointment.appointmentDate,

                    time:
                        appointment.appointmentTime,

                    department:
                        appointment.department
                            ?.name || "",

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

        worksheet.getRow(1).font =
        {
            bold: true
        };

        worksheet.views =
        [
            {
                state: "frozen",
                ySplit: 1
            }
        ];

        response.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        response.setHeader(
            "Content-Disposition",
            `attachment; filename="doctor-appointments-${getTodayString()}.xlsx"`
        );

        await workbook.xlsx.write(
            response
        );

        response.end();
    }
    catch (error)
    {
        console.error(
            "Doctor Excel export error:",
            error
        );

        response.status(500).json(
            {
                success: false,
                message:
                    "Unable to export appointments",
                error: error.message
            }
        );
    }
};

const updateDoctorStatus =
    async (
        request,
        response
    ) =>
{
    try
    {
        /*
        |--------------------------------------------------------------------------
        | Get doctor ID
        |--------------------------------------------------------------------------
        */

        const doctorId =
            request.params.id;


        /*
        |--------------------------------------------------------------------------
        | Validate request body
        |--------------------------------------------------------------------------
        */

        const
        {
            isActive
        } =
            request.body;


        if (
            typeof isActive !==
            "boolean"
        )
        {
            return response
                .status(400)
                .json(
                {
                    success: false,

                    message:
                        "isActive must be true or false"
                }
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Find doctor
        |--------------------------------------------------------------------------
        */

        const doctor =
            await Doctor.findById(
                doctorId
            );


        if (!doctor)
        {
            return response
                .status(404)
                .json(
                {
                    success: false,

                    message:
                        "Doctor not found"
                }
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Update doctor status
        |--------------------------------------------------------------------------
        */

        doctor.isActive =
            isActive;


        /*
        |--------------------------------------------------------------------------
        | When inactive, doctor should
        | also become unavailable
        |--------------------------------------------------------------------------
        */

        doctor.isAvailable =
            isActive;


        await doctor.save();


        /*
        |--------------------------------------------------------------------------
        | Update linked User account
        |--------------------------------------------------------------------------
        */

        if (
            doctor.user
        )
        {
            await User.findByIdAndUpdate(
                doctor.user,
                {
                    isActive:
                        isActive
                }
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Get updated doctor
        |--------------------------------------------------------------------------
        */

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


        /*
        |--------------------------------------------------------------------------
        | Success response
        |--------------------------------------------------------------------------
        */

        return response.json(
            {
                success: true,

                message:
                    isActive
                        ? "Doctor activated successfully"
                        : "Doctor deactivated successfully",

                doctor:
                    updatedDoctor
            }
        );
    }
    catch (error)
    {
        console.error(
            "Doctor status error:",
            error
        );


        return response
            .status(500)
            .json(
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

module.exports =
{
    getDashboard,

    getDoctorAppointments,

    getDoctorAppointmentById,

    updateAppointmentStatus,

    updateAppointmentNotes,

    getDoctorSchedule,

    updateDoctorAvailability,

    exportDoctorAppointments,

    updateDoctorStatus
};