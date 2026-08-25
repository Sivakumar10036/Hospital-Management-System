const express =
    require("express");


const router =
    express.Router();


const
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
} =
    require("../controllers/doctorController");


const protect =
    require("../middleware/authMiddleware");


const authorizeRoles =
    require("../middleware/roleMiddleware");


router.patch(
    "/:id/status",

    protect,

    authorizeRoles(
        "ADMIN",
        "SUPERINTENDENT"
    ),

    updateDoctorStatus
);


router.get(
    "/dashboard",

    protect,

    authorizeRoles(
        "DOCTOR"
    ),

    getDashboard
);


router.get(
    "/appointments",

    protect,

    authorizeRoles(
        "DOCTOR"
    ),

    getDoctorAppointments
);


router.get(
    "/appointments/export",

    protect,

    authorizeRoles(
        "DOCTOR"
    ),

    exportDoctorAppointments
);


router.get(
    "/appointments/:id",

    protect,

    authorizeRoles(
        "DOCTOR"
    ),

    getDoctorAppointmentById
);


router.patch(
    "/appointments/:id/status",

    protect,

    authorizeRoles(
        "DOCTOR"
    ),

    updateAppointmentStatus
);


router.patch(
    "/appointments/:id/notes",

    protect,

    authorizeRoles(
        "DOCTOR"
    ),

    updateAppointmentNotes
);


router.get(
    "/schedule",

    protect,

    authorizeRoles(
        "DOCTOR"
    ),

    getDoctorSchedule
);


router.patch(
    "/availability",

    protect,

    authorizeRoles(
        "DOCTOR"
    ),

    updateDoctorAvailability
);


module.exports =
    router;