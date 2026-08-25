const express =
    require("express");

const protect =
    require("../middleware/authMiddleware");

const authorizeRoles =
    require("../middleware/roleMiddleware");

const
{
    getAvailableSlots,
    bookAppointment,
    getMyAppointments,
    cancelAppointment,
    getAdminAppointments,
    getAppointmentById,
    updateAppointmentStatus
} =
    require("../controllers/appointmentController");

const router =
    express.Router();

router.get(
    "/slots",
    protect,
    authorizeRoles(
        "PATIENT"
    ),
    getAvailableSlots
);

router.post(
    "/book",
    protect,
    authorizeRoles(
        "PATIENT"
    ),
    bookAppointment
);

router.get(
    "/my",
    protect,
    authorizeRoles(
        "PATIENT"
    ),
    getMyAppointments
);

router.patch(
    "/:id/cancel",
    protect,
    authorizeRoles(
        "PATIENT"
    ),
    cancelAppointment
);

router.get(
    "/admin",
    protect,
    authorizeRoles(
        "ADMIN"
    ),
    getAdminAppointments
);

router.get(
    "/admin/:id",
    protect,
    authorizeRoles(
        "ADMIN"
    ),
    getAppointmentById
);

router.patch(
    "/admin/:id/status",
    protect,
    authorizeRoles(
        "ADMIN"
    ),
    updateAppointmentStatus
);

module.exports =
    router;