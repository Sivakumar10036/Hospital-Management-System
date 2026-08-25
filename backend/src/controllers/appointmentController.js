const Appointment =
    require("../models/Appointment");

const Doctor =
    require("../models/Doctor");

const Patient =
    require("../models/Patient");

const Schedule =
    require("../models/Schedule");

const generateId =
    require("../utils/generateId");


const dayNames =
[
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];


const isValidDateFormat =
    (date) =>
{
    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(
            date
        )
    )
    {
        return false;
    }

    const
    [
        year,
        month,
        day
    ] =
        date.split("-").map(
            Number
        );

    const parsedDate =
        new Date(
            Date.UTC(
                year,
                month - 1,
                day
            )
        );

    return (
        parsedDate.getUTCFullYear() ===
            year &&
        parsedDate.getUTCMonth() ===
            month - 1 &&
        parsedDate.getUTCDate() ===
            day
    );
};


const getDayOfWeek =
    (date) =>
{
    const
    [
        year,
        month,
        day
    ] =
        date.split("-").map(
            Number
        );

    const parsedDate =
        new Date(
            Date.UTC(
                year,
                month - 1,
                day
            )
        );

    return dayNames[
        parsedDate.getUTCDay()
    ];
};


const timeToMinutes =
    (time) =>
{
    const
    [
        hours,
        minutes
    ] =
        time.split(":").map(
            Number
        );

    return (
        hours * 60 +
        minutes
    );
};


const minutesToTime =
    (minutes) =>
{
    const hours =
        Math.floor(
            minutes / 60
        );

    const remainingMinutes =
        minutes % 60;

    return (
        `${String(hours).padStart(2, "0")}:` +
        `${String(remainingMinutes).padStart(2, "0")}`
    );
};


const getTodayString =
    () =>
{
    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );

    return `${year}-${month}-${day}`;
};


const getNextAppointmentId =
    async () =>
{
    const appointmentCount =
        await Appointment.countDocuments();

    return generateId(
        "APT",
        appointmentCount + 1
    );
};


const generateSlotsForSchedule =
    (
        schedule,
        bookedTimes
    ) =>
{
    const slots = [];

    const startMinutes =
        timeToMinutes(
            schedule.startTime
        );

    const endMinutes =
        timeToMinutes(
            schedule.endTime
        );

    const duration =
        Number(
            schedule.slotDuration
        ) || 30;

    const breakStart =
        schedule.breakStart
            ? timeToMinutes(
                schedule.breakStart
            )
            : null;

    const breakEnd =
        schedule.breakEnd
            ? timeToMinutes(
                schedule.breakEnd
            )
            : null;

    for (
        let current = startMinutes;
        current + duration <= endMinutes;
        current += duration
    )
    {
        const slotEnd =
            current + duration;

        const insideBreak =
            breakStart !== null &&
            breakEnd !== null &&
            current < breakEnd &&
            slotEnd > breakStart;

        if (insideBreak)
        {
            continue;
        }

        const time =
            minutesToTime(
                current
            );

        const isBooked =
            bookedTimes.includes(
                time
            );

        slots.push(
            {
                time,

                available:
                    !isBooked,

                status:
                    isBooked
                        ? "BOOKED"
                        : "AVAILABLE"
            }
        );
    }

    return slots;
};


const getAvailableSlots =
    async (
        request,
        response
    ) =>
{
    try
    {
        const
        {
            doctorId,
            date
        } =
            request.query;

        if (
            !doctorId ||
            !date
        )
        {
            return response.status(400).json(
                {
                    success: false,

                    message:
                        "Doctor ID and date are required"
                }
            );
        }

        if (
            !isValidDateFormat(
                date
            )
        )
        {
            return response.status(400).json(
                {
                    success: false,

                    message:
                        "Date must be in YYYY-MM-DD format"
                }
            );
        }

        const today =
            getTodayString();

        if (date < today)
        {
            return response.status(400).json(
                {
                    success: false,

                    message:
                        "Appointments cannot be booked for a past date"
                }
            );
        }

        const doctor =
            await Doctor.findById(
                doctorId
            ).populate(
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

        if (!doctor.isActive)
        {
            return response.status(400).json(
                {
                    success: false,

                    message:
                        "Doctor is currently inactive"
                }
            );
        }

        if (!doctor.isAvailable)
        {
            return response.status(400).json(
                {
                    success: false,

                    message:
                        "Doctor is currently unavailable"
                }
            );
        }

        const dayOfWeek =
            getDayOfWeek(
                date
            );

        const schedules =
            await Schedule.find(
                {
                    doctor:
                        doctor._id,

                    dayOfWeek,

                    isAvailable:
                        true
                }
            );

        if (
            schedules.length === 0
        )
        {
            return response.json(
                {
                    success: true,

                    doctor:
                    {
                        id:
                            doctor._id,

                        doctorId:
                            doctor.doctorId,

                        name:
                            doctor.user?.name,

                        specialization:
                            doctor.specialization
                    },

                    date,

                    dayOfWeek,

                    slots: []
                }
            );
        }

        const appointments =
            await Appointment.find(
                {
                    doctor:
                        doctor._id,

                    appointmentDate:
                        date,

                    status:
                        {
                            $in:
                            [
                                "BOOKED",
                                "CONFIRMED"
                            ]
                        }
                }
            );

        const bookedTimes =
            appointments.map(
                appointment =>
                    appointment.appointmentTime
            );

        let slots = [];

        for (
            const schedule
            of schedules
        )
        {
            const generatedSlots =
                generateSlotsForSchedule(
                    schedule,
                    bookedTimes
                );

            slots.push(
                ...generatedSlots
            );
        }

        const uniqueSlots =
            Array.from(
                new Map(
                    slots.map(
                        slot =>
                        [
                            slot.time,
                            slot
                        ]
                    )
                ).values()
            );

        uniqueSlots.sort(
            (
                first,
                second
            ) =>
                timeToMinutes(
                    first.time
                ) -
                timeToMinutes(
                    second.time
                )
        );

        return response.json(
            {
                success: true,

                doctor:
                {
                    id:
                        doctor._id,

                    doctorId:
                        doctor.doctorId,

                    name:
                        doctor.user?.name,

                    specialization:
                        doctor.specialization,

                    department:
                        doctor.department?.name,

                    profilePhoto:
                        doctor.profilePhoto
                },

                date,

                dayOfWeek,

                slots:
                    uniqueSlots
            }
        );
    }
    catch (error)
    {
        console.error(
            "Get available slots error:",
            error
        );

        return response.status(500).json(
            {
                success: false,

                message:
                    "Unable to fetch available slots",

                error:
                    error.message
            }
        );
    }
};


const bookAppointment =
    async (
        request,
        response
    ) =>
{
    try
    {
        const
        {
            doctorId,
            appointmentDate,
            appointmentTime,
            reason,
            symptoms
        } =
            request.body;

        if (
            !doctorId ||
            !appointmentDate ||
            !appointmentTime
        )
        {
            return response.status(400).json(
                {
                    success: false,

                    message:
                        "Doctor, date and time are required"
                }
            );
        }

        if (
            !isValidDateFormat(
                appointmentDate
            )
        )
        {
            return response.status(400).json(
                {
                    success: false,

                    message:
                        "Date must be in YYYY-MM-DD format"
                }
            );
        }

        if (
            !/^([01]\d|2[0-3]):([0-5]\d)$/.test(
                appointmentTime
            )
        )
        {
            return response.status(400).json(
                {
                    success: false,

                    message:
                        "Time must be in HH:mm format"
                }
            );
        }

        const today =
            getTodayString();

        if (
            appointmentDate < today
        )
        {
            return response.status(400).json(
                {
                    success: false,

                    message:
                        "Cannot book an appointment for a past date"
                }
            );
        }

        const doctor =
            await Doctor.findById(
                doctorId
            ).populate(
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

        if (!doctor.isActive)
        {
            return response.status(400).json(
                {
                    success: false,

                    message:
                        "Doctor is currently inactive"
                }
            );
        }

        if (!doctor.isAvailable)
        {
            return response.status(400).json(
                {
                    success: false,

                    message:
                        "Doctor is currently unavailable"
                }
            );
        }

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

        const dayOfWeek =
            getDayOfWeek(
                appointmentDate
            );

        const schedule =
            await Schedule.findOne(
                {
                    doctor:
                        doctor._id,

                    dayOfWeek,

                    isAvailable:
                        true
                }
            );

        if (!schedule)
        {
            return response.status(400).json(
                {
                    success: false,

                    message:
                        "Doctor is not available on this day"
                }
            );
        }

        const requestedMinutes =
            timeToMinutes(
                appointmentTime
            );

        const startMinutes =
            timeToMinutes(
                schedule.startTime
            );

        const endMinutes =
            timeToMinutes(
                schedule.endTime
            );

        if (
            requestedMinutes <
                startMinutes ||
            requestedMinutes >=
                endMinutes
        )
        {
            return response.status(400).json(
                {
                    success: false,

                    message:
                        "Selected time is outside the doctor's working hours"
                }
            );
        }

        if (
            schedule.breakStart &&
            schedule.breakEnd
        )
        {
            const breakStart =
                timeToMinutes(
                    schedule.breakStart
                );

            const breakEnd =
                timeToMinutes(
                    schedule.breakEnd
                );

            if (
                requestedMinutes >=
                    breakStart &&
                requestedMinutes <
                    breakEnd
            )
            {
                return response.status(400).json(
                    {
                        success: false,

                        message:
                            "Selected time is during the doctor's break"
                    }
                );
            }
        }

        const duration =
            Number(
                schedule.slotDuration
            ) || 30;

        const offset =
            requestedMinutes -
            startMinutes;

        if (
            offset % duration !== 0
        )
        {
            return response.status(400).json(
                {
                    success: false,

                    message:
                        "Selected time is not a valid appointment slot"
                }
            );
        }

        const existingAppointment =
            await Appointment.findOne(
                {
                    doctor:
                        doctor._id,

                    appointmentDate,

                    appointmentTime,

                    status:
                        {
                            $in:
                            [
                                "BOOKED",
                                "CONFIRMED"
                            ]
                        }
                }
            );

        if (existingAppointment)
        {
            return response.status(409).json(
                {
                    success: false,

                    message:
                        "This appointment slot is already booked"
                }
            );
        }

        const patientExistingAppointment =
            await Appointment.findOne(
                {
                    patient:
                        patient._id,

                    appointmentDate,

                    appointmentTime,

                    status:
                        {
                            $in:
                            [
                                "BOOKED",
                                "CONFIRMED"
                            ]
                        }
                }
            );

        if (patientExistingAppointment)
        {
            return response.status(409).json(
                {
                    success: false,

                    message:
                        "You already have an appointment at this time"
                }
            );
        }

        const appointmentId =
            await getNextAppointmentId();

        const appointment =
            await Appointment.create(
                {
                    appointmentId,

                    patient:
                        patient._id,

                    doctor:
                        doctor._id,

                    department:
                        doctor.department?._id,

                    appointmentDate,

                    appointmentTime,

                    startTime:
                        appointmentTime,

                    endTime:
                        minutesToTime(
                            requestedMinutes +
                            duration
                        ),

                    reason:
                        reason || "",

                    symptoms:
                        symptoms || "",

                    consultationFee:
                        doctor.consultationFee || 0,

                    status:
                        "CONFIRMED"
                }
            );

        const populatedAppointment =
            await Appointment.findById(
                appointment._id
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
            );

        return response.status(201).json(
            {
                success: true,

                message:
                    "Appointment booked successfully",

                appointment:
                    populatedAppointment
            }
        );
    }
    catch (error)
    {
        console.error(
            "Book appointment error:",
            error
        );

        return response.status(500).json(
            {
                success: false,

                message:
                    "Unable to book appointment",

                error:
                    error.message
            }
        );
    }
};


const getMyAppointments =
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

        const appointments =
            await Appointment.find(
                {
                    patient:
                        patient._id
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
                    appointmentDate: 1,

                    appointmentTime: 1
                }
            );

        return response.json(
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
            "Get patient appointments error:",
            error
        );

        return response.status(500).json(
            {
                success: false,

                message:
                    "Unable to fetch appointments",

                error:
                    error.message
            }
        );
    }
};


const cancelAppointment =
    async (
        request,
        response
    ) =>
{
    try
    {
        const
        {
            cancellationReason
        } =
            request.body;

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

        const appointment =
            await Appointment.findOne(
                {
                    _id:
                        request.params.id,

                    patient:
                        patient._id
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
                        "Only confirmed appointments can be cancelled"
                }
            );
        }

        appointment.status =
            "CANCELLED";

        appointment.cancelledBy =
            request.user._id;

        appointment.cancellationReason =
            cancellationReason || "";

        await appointment.save();

        return response.json(
            {
                success: true,

                message:
                    "Appointment cancelled successfully",

                appointment
            }
        );
    }
    catch (error)
    {
        console.error(
            "Cancel appointment error:",
            error
        );

        return response.status(500).json(
            {
                success: false,

                message:
                    "Unable to cancel appointment",

                error:
                    error.message
            }
        );
    }
};


const getAdminAppointments =
    async (
        request,
        response
    ) =>
{
    try
    {
        const appointments =
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
                            "name email phone profilePhoto"
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
                            "name email phone profilePhoto"
                    }
                }
            )
            .populate(
                "department"
            )
            .sort(
                {
                    appointmentDate: -1,

                    appointmentTime: 1
                }
            );

        return response.json(
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
            "Get admin appointments error:",
            error
        );

        return response.status(500).json(
            {
                success: false,

                message:
                    "Unable to fetch appointments",

                error:
                    error.message
            }
        );
    }
};


const getAppointmentById =
    async (
        request,
        response
    ) =>
{
    try
    {
        const appointment =
            await Appointment.findById(
                request.params.id
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
                            "name email phone profilePhoto"
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
                            "name email phone profilePhoto"
                    }
                }
            )
            .populate(
                "department"
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

        return response.json(
            {
                success: true,

                appointment
            }
        );
    }
    catch (error)
    {
        console.error(
            "Get appointment error:",
            error
        );

        return response.status(500).json(
            {
                success: false,

                message:
                    "Unable to fetch appointment",

                error:
                    error.message
            }
        );
    }
};


const updateAppointmentStatus =
    async (
        request,
        response
    ) =>
{
    try
    {
        const
        {
            status
        } =
            request.body;

        const allowedStatuses =
        [
            "BOOKED",
            "CONFIRMED",
            "COMPLETED",
            "CANCELLED",
            "NO_SHOW"
        ];

        if (
            !allowedStatuses.includes(
                status
            )
        )
        {
            return response.status(400).json(
                {
                    success: false,

                    message:
                        "Invalid appointment status"
                }
            );
        }

        const appointment =
            await Appointment.findById(
                request.params.id
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

        appointment.status =
            status;

        if (
            status === "CANCELLED"
        )
        {
            appointment.cancelledBy =
                request.user._id;
        }

        await appointment.save();

        return response.json(
            {
                success: true,

                message:
                    "Appointment status updated successfully",

                appointment
            }
        );
    }
    catch (error)
    {
        console.error(
            "Update appointment status error:",
            error
        );

        return response.status(500).json(
            {
                success: false,

                message:
                    "Unable to update appointment status",

                error:
                    error.message
            }
        );
    }
};


module.exports =
{
    getAvailableSlots,

    bookAppointment,

    getMyAppointments,

    cancelAppointment,

    getAdminAppointments,

    getAppointmentById,

    updateAppointmentStatus
};