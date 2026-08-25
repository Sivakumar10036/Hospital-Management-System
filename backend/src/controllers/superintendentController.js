const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Superintendent = require("../models/Superintendent");
const Department = require("../models/Department");
const Appointment = require("../models/Appointment");
const ExcelJS = require("exceljs");
const bcrypt = require("bcryptjs");
const generateId = require("../utils/generateId");


const getNextSuperintendentId =
    async () =>
    {
        const superintendentCount =
            await Superintendent.countDocuments();

        return generateId(
            "SUP",
            superintendentCount + 1
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


const cleanDoctorName =
    (name) =>
    {
        if (!name)
        {
            return "";
        }

        let doctorName =
            String(name)
                .trim();

        const imageMarker =
            "profilePhoto File Select doctor image:";

        const lowerDoctorName =
            doctorName.toLowerCase();

        const lowerImageMarker =
            imageMarker.toLowerCase();

        const imageMarkerIndex =
            lowerDoctorName.lastIndexOf(
                lowerImageMarker
            );

        if (
            imageMarkerIndex !== -1
        )
        {
            doctorName =
                doctorName
                    .substring(
                        imageMarkerIndex +
                        imageMarker.length
                    )
                    .trim();
        }

        const doctorMatches =
            [
                ...doctorName.matchAll(
                    /\bdr\.\s*/gi
                )
            ];

        if (
            doctorMatches.length > 0
        )
        {
            const lastDoctorMatch =
                doctorMatches[
                    doctorMatches.length - 1
                ];

            doctorName =
                doctorName
                    .substring(
                        lastDoctorMatch.index +
                        lastDoctorMatch[0].length
                    )
                    .trim();
        }

        doctorName =
            doctorName
                .replace(
                    /^[:\-\s]+/,
                    ""
                )
                .replace(
                    /\s+/g,
                    " "
                )
                .trim();

        return doctorName;
    };


const formatDoctor =
    (doctor) =>
    {
        const doctorObject =
            doctor.toObject
            ? doctor.toObject()
            : doctor;

        if (
            doctorObject.user
        )
        {
            doctorObject.user.name =
                cleanDoctorName(
                    doctorObject
                        .user
                        .name
                );
        }

        return doctorObject;
    };


const formatAppointment =
    (appointment) =>
    {
        const appointmentObject =
            appointment.toObject
            ? appointment.toObject()
            : appointment;

        if (
            appointmentObject.doctor &&
            appointmentObject.doctor.user
        )
        {
            appointmentObject.doctor.user.name =
                cleanDoctorName(
                    appointmentObject
                        .doctor
                        .user
                        .name
                );
        }

        if (
            appointmentObject.patient &&
            appointmentObject.patient.user
        )
        {
            appointmentObject.patient.user.name =
                String(
                    appointmentObject
                        .patient
                        .user
                        .name ||
                    ""
                )
                    .trim();
        }

        return appointmentObject;
    };


const createSuperintendent =
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
                employeeId,
                designation,
                department
            } =
                request.body;

            if (
                !name ||
                !email ||
                !password ||
                !phone ||
                !employeeId
            )
            {
                return response
                    .status(400)
                    .json(
                    {
                        success: false,
                        message:
                            "Name, email, password, phone and employee ID are required"
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
                return response
                    .status(409)
                    .json(
                    {
                        success: false,
                        message:
                            "A user with this email already exists"
                    }
                );
            }

            const existingEmployee =
                await Superintendent.findOne(
                {
                    employeeId
                }
            );

            if (existingEmployee)
            {
                return response
                    .status(409)
                    .json(
                    {
                        success: false,
                        message:
                            "This employee ID already exists"
                    }
                );
            }

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    12
                );

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
                        "SUPERINTENDENT"
                }
            );

            const superintendentId =
                await getNextSuperintendentId();

            let superintendent;

            try
            {
                superintendent =
                    await Superintendent.create(
                    {
                        user:
                            user._id,
                        superintendentId,
                        employeeId,
                        designation:
                            designation ||
                            "Hospital Superintendent",
                        department:
                            department ||
                            "Hospital Administration",
                        isActive:
                            true
                    }
                );
            }
            catch (error)
            {
                await User.findByIdAndDelete(
                    user._id
                );

                throw error;
            }

            const populatedSuperintendent =
                await Superintendent.findById(
                    superintendent._id
                )
                .populate(
                {
                    path:
                        "user",
                    select:
                        "-password"
                }
            );

            response
                .status(201)
                .json(
                {
                    success: true,
                    message:
                        "Superintendent created successfully",
                    superintendent:
                        populatedSuperintendent
                }
            );
        }
        catch (error)
        {
            console.error(
                "Create superintendent error:",
                error
            );

            response
                .status(500)
                .json(
                {
                    success: false,
                    message:
                        "Superintendent creation failed",
                    error:
                        error.message
                }
            );
        }
    };


const getAllSuperintendents =
    async (
        request,
        response
    ) =>
    {
        try
        {
            const superintendents =
                await Superintendent.find()
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

            response.json(
            {
                success: true,
                count:
                    superintendents.length,
                superintendents
            });
        }
        catch (error)
        {
            console.error(
                "Get superintendents error:",
                error
            );

            response
                .status(500)
                .json(
                {
                    success: false,
                    message:
                        "Unable to fetch superintendents",
                    error:
                        error.message
                }
            );
        }
    };


const getSuperintendentById =
    async (
        request,
        response
    ) =>
    {
        try
        {
            const superintendent =
                await Superintendent.findById(
                    request.params.id
                )
                .populate(
                {
                    path:
                        "user",
                    select:
                        "-password"
                }
            );

            if (!superintendent)
            {
                return response
                    .status(404)
                    .json(
                    {
                        success: false,
                        message:
                            "Superintendent not found"
                    }
                );
            }

            response.json(
            {
                success: true,
                superintendent
            });
        }
        catch (error)
        {
            console.error(
                "Get superintendent error:",
                error
            );

            response
                .status(500)
                .json(
                {
                    success: false,
                    message:
                        "Unable to fetch superintendent",
                    error:
                        error.message
                }
            );
        }
    };


const updateSuperintendent =
    async (
        request,
        response
    ) =>
    {
        try
        {
            const superintendent =
                await Superintendent.findById(
                    request.params.id
                );

            if (!superintendent)
            {
                return response
                    .status(404)
                    .json(
                    {
                        success: false,
                        message:
                            "Superintendent not found"
                    }
                );
            }

            const user =
                await User.findById(
                    superintendent.user
                );

            if (!user)
            {
                return response
                    .status(404)
                    .json(
                    {
                        success: false,
                        message:
                            "Superintendent user account not found"
                    }
                );
            }

            const
            {
                name,
                email,
                phone,
                designation,
                department
            } =
                request.body;

            if (
                email &&
                email.toLowerCase() !==
                    user.email
            )
            {
                const existingEmail =
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

                if (existingEmail)
                {
                    return response
                        .status(409)
                        .json(
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
            }

            if (designation)
            {
                superintendent.designation =
                    designation;
            }

            if (department)
            {
                superintendent.department =
                    department;
            }

            await user.save();

            await superintendent.save();

            const updatedSuperintendent =
                await Superintendent.findById(
                    superintendent._id
                )
                .populate(
                {
                    path:
                        "user",
                    select:
                        "-password"
                }
            );

            response.json(
            {
                success: true,
                message:
                    "Superintendent updated successfully",
                superintendent:
                    updatedSuperintendent
            });
        }
        catch (error)
        {
            console.error(
                "Update superintendent error:",
                error
            );

            response
                .status(500)
                .json(
                {
                    success: false,
                    message:
                        "Superintendent update failed",
                    error:
                        error.message
                }
            );
        }
    };

const updateSuperintendentStatus =
    async (
        request,
        response
    ) =>
    {
        try
        {
            const { id } =
                request.params;

            const { isActive } =
                request.body;

            if (!id)
            {
                return response
                    .status(400)
                    .json(
                    {
                        success: false,
                        message:
                            "Superintendent ID is required"
                    }
                );
            }

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
             * IMPORTANT:
             * The frontend sends the Superintendent document _id.
             * Therefore we must find the Superintendent here,
             * not the User document.
             */
            const superintendent =
                await Superintendent
                    .findById(id);

            if (!superintendent)
            {
                return response
                    .status(404)
                    .json(
                    {
                        success: false,
                        message:
                            "Superintendent not found"
                    }
                );
            }

            superintendent.isActive =
                isActive;

            await superintendent.save();

            /*
             * Keep the linked User account in sync when the User
             * schema contains an isActive field. This allows the
             * login middleware to also block an inactive account
             * without breaking projects whose User schema does not
             * define isActive.
             */
            if (superintendent.user)
            {
                const user =
                    await User.findById(
                        superintendent.user
                    );

                if (
                    user &&
                    Object.prototype
                        .hasOwnProperty
                        .call(
                            user.toObject(),
                            "isActive"
                        )
                )
                {
                    user.isActive =
                        isActive;

                    await user.save();
                }
            }

            const updatedSuperintendent =
                await Superintendent
                    .findById(
                        superintendent._id
                    )
                    .populate(
                    {
                        path:
                            "user",
                        select:
                            "-password"
                    }
                );

            return response
                .status(200)
                .json(
                {
                    success: true,

                    message:
                        isActive
                            ?
                            "Superintendent activated successfully"
                            :
                            "Superintendent deactivated successfully",

                    superintendent:
                        updatedSuperintendent
                }
            );
        }
        catch (error)
        {
            console.error(
                "UPDATE SUPERINTENDENT STATUS ERROR:",
                error
            );

            return response
                .status(500)
                .json(
                {
                    success: false,
                    message:
                        "Unable to update superintendent status",
                    error:
                        error.message
                }
            );
        }
    };

const getDashboard =
    async (
        request,
        response
    ) =>
    {
        try
        {
            const today =
                getTodayString();

            const
            [
                totalDoctors,
                activeDoctors,
                inactiveDoctors,
                totalPatients,
                totalSuperintendents,
                todayAppointments,
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
                    }),

                    Doctor.countDocuments(
                    {
                        isActive:
                            false
                    }),

                    Patient.countDocuments(),

                    Superintendent.countDocuments(
                    {
                        isActive:
                            true
                    }),

                    Appointment.countDocuments(
                    {
                        appointmentDate:
                            today
                    }),

                    Appointment.countDocuments(
                    {
                        status:
                            "COMPLETED"
                    }),

                    Appointment.countDocuments(
                    {
                        status:
                            "CANCELLED"
                    }),

                    Appointment.countDocuments(
                    {
                        status:
                            "NO_SHOW"
                    }),

                    Appointment.countDocuments()
                ]
            );

            const upcomingAppointments =
                await Appointment.countDocuments(
                {
                    appointmentDate:
                    {
                        $gt:
                            today
                    },

                    status:
                        "CONFIRMED"
                }
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
                    })
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
                    })
                    .populate(
                        "department"
                    )
                    .sort(
                    {
                        createdAt:
                            -1
                    }
                )
                    .limit(10);

            const formattedAppointments =
                recentAppointments.map(
                    formatAppointment
                );

            response.json(
            {
                success: true,

                dashboard:
                {
                    statistics:
                    {
                        totalDoctors,
                        activeDoctors,
                        inactiveDoctors,
                        totalPatients,
                        totalSuperintendents,
                        todayAppointments,
                        upcomingAppointments,
                        completedAppointments,
                        cancelledAppointments,
                        noShowAppointments,
                        totalAppointments
                    },

                    recentAppointments:
                        formattedAppointments
                }
            });
        }
        catch (error)
        {
            console.error(
                "Superintendent dashboard error:",
                error
            );

            response
                .status(500)
                .json(
                {
                    success: false,
                    message:
                        "Unable to load hospital dashboard",
                    error:
                        error.message
                }
            );
        }
    };


const getAllDoctors =
    async (
        request,
        response
    ) =>
    {
        try
        {
            const
            {
                search,
                department,
                status
            } =
                request.query;

            const query = {};

            if (department)
            {
                query.department =
                    department;
            }

            if (status === "active")
            {
                query.isActive =
                    true;
            }

            if (status === "inactive")
            {
                query.isActive =
                    false;
            }

            const doctors =
                await Doctor.find(
                    query
                )
                .populate(
                {
                    path:
                        "user",
                    select:
                        "-password"
                })
                .populate(
                    "department"
                )
                .sort(
                {
                    createdAt:
                        -1
                });

            let filteredDoctors =
                doctors;

            if (search)
            {
                const searchValue =
                    search
                        .toLowerCase()
                        .trim();

                filteredDoctors =
                    doctors.filter(
                        doctor =>
                        {
                            const name =
                                doctor.user
                                    ?.name
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

                            return (
                                name.includes(
                                    searchValue
                                ) ||
                                specialization.includes(
                                    searchValue
                                ) ||
                                doctorId.includes(
                                    searchValue
                                )
                            );
                        }
                    );
            }

            const formattedDoctors =
                filteredDoctors.map(
                    formatDoctor
                );

            response.json(
            {
                success: true,
                count:
                    formattedDoctors.length,
                doctors:
                    formattedDoctors
            });
        }
        catch (error)
        {
            console.error(
                "Superintendent doctors error:",
                error
            );

            response
                .status(500)
                .json(
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


const getAllPatients =
    async (
        request,
        response
    ) =>
    {
        try
        {
            const
            {
                search
            } =
                request.query;

            const patients =
                await Patient.find()
                    .populate(
                    {
                        path:
                            "user",
                        select:
                            "-password"
                    })
                    .sort(
                    {
                        createdAt:
                            -1
                    });

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
                        patient =>
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
                success: true,
                count:
                    filteredPatients.length,
                patients:
                    filteredPatients
            });
        }
        catch (error)
        {
            console.error(
                "Superintendent patients error:",
                error
            );

            response
                .status(500)
                .json(
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


const getAllAppointments =
    async (
        request,
        response
    ) =>
    {
        try
        {
            const
            {
                date,
                status,
                doctor,
                department
            } =
                request.query;

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
                })
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
                })
                .populate(
                    "department"
                )
                .sort(
                {
                    appointmentDate:
                        1,

                    appointmentTime:
                        1
                });

            const formattedAppointments =
                appointments.map(
                    formatAppointment
                );

            response.json(
            {
                success: true,

                count:
                    formattedAppointments.length,

                appointments:
                    formattedAppointments
            });
        }
        catch (error)
        {
            console.error(
                "Superintendent appointments error:",
                error
            );

            response
                .status(500)
                .json(
                {
                    success: false,
                    message:
                        "Unable to fetch hospital appointments",
                    error:
                        error.message
                }
            );
        }
    };


const getDepartmentStatistics =
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
                        name:
                            1
                    }
                );

            const statistics = [];

            for (
                const department
                of departments
            )
            {
                const
                [
                    doctorCount,
                    patientIds,
                    appointmentCount
                ] =
                    await Promise.all(
                    [
                        Doctor.countDocuments(
                        {
                            department:
                                department._id,

                            isActive:
                                true
                        }),

                        Appointment.distinct(
                            "patient",
                        {
                            department:
                                department._id
                        }),

                        Appointment.countDocuments(
                        {
                            department:
                                department._id
                        })
                    ]
                );

                statistics.push(
                {
                    departmentId:
                        department._id,

                    departmentName:
                        department.name,

                    doctorCount:
                        doctorCount,

                    patientCount:
                        patientIds.length,

                    appointmentCount:
                        appointmentCount
                });
            }

            response.json(
            {
                success:
                    true,

                statistics:
                    statistics
            });
        }
        catch (error)
        {
            console.error(
                "Department statistics error:",
                error
            );

            response
                .status(500)
                .json(
                {
                    success:
                        false,

                    message:
                        "Unable to fetch department statistics",

                    error:
                        error.message
                }
            );
        }
    };


const exportHospitalAppointments =
    async (
        request,
        response
    ) =>
    {
        try
        {
            const
            {
                date,
                status,
                doctor,
                department
            } =
                request.query;

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
                })
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
                })
                .populate(
                    "department"
                )
                .sort(
                {
                    appointmentDate:
                        1,

                    appointmentTime:
                        1
                });

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
                        "Appointment Date",
                    key:
                        "appointmentDate",
                    width:
                        18
                },

                {
                    header:
                        "Appointment Time",
                    key:
                        "appointmentTime",
                    width:
                        18
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
                const formattedAppointment =
                    formatAppointment(
                        appointment
                    );

                worksheet.addRow(
                {
                    appointmentId:
                        formattedAppointment
                            .appointmentId,

                    patientId:
                        formattedAppointment
                            .patient
                            ?.patientId ||
                        "",

                    patientName:
                        formattedAppointment
                            .patient
                            ?.user
                            ?.name ||
                        "",

                    patientPhone:
                        formattedAppointment
                            .patient
                            ?.user
                            ?.phone ||
                        "",

                    doctorId:
                        formattedAppointment
                            .doctor
                            ?.doctorId ||
                        "",

                    doctorName:
                        formattedAppointment
                            .doctor
                            ?.user
                            ?.name ||
                        "",

                    specialization:
                        formattedAppointment
                            .doctor
                            ?.specialization ||
                        "",

                    department:
                        formattedAppointment
                            .department
                            ?.name ||
                        "",

                    appointmentDate:
                        formattedAppointment
                            .appointmentDate,

                    appointmentTime:
                        formattedAppointment
                            .appointmentTime,

                    reason:
                        formattedAppointment
                            .reason,

                    symptoms:
                        formattedAppointment
                            .symptoms,

                    status:
                        formattedAppointment
                            .status,

                    notes:
                        formattedAppointment
                            .notes ||
                        ""
                });
            }

            worksheet.getRow(1).font =
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

            response.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );

            response.setHeader(
                "Content-Disposition",
                `attachment; filename="hospital-appointments-${getTodayString()}.xlsx"`
            );

            await workbook.xlsx.write(
                response
            );

            response.end();
        }
        catch (error)
        {
            console.error(
                "Hospital Excel export error:",
                error
            );

            response
                .status(500)
                .json(
                {
                    success: false,
                    message:
                        "Unable to export hospital appointments",
                    error:
                        error.message
                }
            );
        }
    };



const changeSuperintendentPassword =
    async (
        request,
        response
    ) =>
    {
        try
        {
            const
            {
                currentPassword,
                newPassword,
                confirmPassword
            } =
                request.body;

            if (
                !currentPassword ||
                !newPassword ||
                !confirmPassword
            )
            {
                return response.status(400).json({
                    success: false,
                    message:
                        "Current password, new password and confirm password are required"
                });
            }

            if (
                typeof newPassword !== "string" ||
                newPassword.length < 6
            )
            {
                return response.status(400).json({
                    success: false,
                    message:
                        "New password must contain at least 6 characters"
                });
            }

            if (newPassword !== confirmPassword)
            {
                return response.status(400).json({
                    success: false,
                    message:
                        "New passwords do not match"
                });
            }

            const userId =
                request.user?._id ||
                request.user?.id;

            if (!userId)
            {
                return response.status(401).json({
                    success: false,
                    message:
                        "Unable to identify logged-in user"
                });
            }

            const user =
                await User.findById(userId);

            if (!user)
            {
                return response.status(404).json({
                    success: false,
                    message:
                        "User account not found"
                });
            }

            if (
                String(user.role || "")
                    .trim()
                    .toUpperCase() !==
                "SUPERINTENDENT"
            )
            {
                return response.status(403).json({
                    success: false,
                    message:
                        "Only a Superintendent can change this password"
                });
            }

            const passwordMatches =
                await bcrypt.compare(
                    currentPassword,
                    user.password
                );

            if (!passwordMatches)
            {
                return response.status(400).json({
                    success: false,
                    message:
                        "Current password is incorrect"
                });
            }

            const samePassword =
                await bcrypt.compare(
                    newPassword,
                    user.password
                );

            if (samePassword)
            {
                return response.status(400).json({
                    success: false,
                    message:
                        "New password must be different from the current password"
                });
            }

            user.password =
                await bcrypt.hash(
                    newPassword,
                    12
                );

            await user.save();

            return response.status(200).json({
                success: true,
                message:
                    "Password changed successfully"
            });
        }
        catch (error)
        {
            console.error(
                "Superintendent password change error:",
                error
            );

            return response.status(500).json({
                success: false,
                message:
                    "Unable to change password",
                error:
                    error.message
            });
        }
    };


module.exports =
{
    createSuperintendent,
    getAllSuperintendents,
    getSuperintendentById,
    updateSuperintendent,
    updateSuperintendentStatus,
    getDashboard,
    getAllDoctors,
    getAllPatients,
    getAllAppointments,
    getDepartmentStatistics,
    exportHospitalAppointments,
    changeSuperintendentPassword
};