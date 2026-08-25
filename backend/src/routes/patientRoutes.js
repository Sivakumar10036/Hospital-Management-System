const express =
    require("express");

const protect =
    require("../middleware/authMiddleware");

const authorizeRoles =
    require("../middleware/roleMiddleware");

const
{
    getDoctors,

    getDoctorById,

    getAllPatients,

    getPatientById,

    getPatientDashboard,

    getMyProfile,

    updateMyProfile
}
=
    require("../controllers/patientController");


const router =
    express.Router();


/* ========================= */
/* PATIENT ROUTES */
/* ========================= */

router.get(
    "/dashboard",
    protect,
    authorizeRoles("PATIENT"),
    getPatientDashboard
);


router.get(
    "/doctors",
    protect,
    authorizeRoles("PATIENT"),
    getDoctors
);


router.get(
    "/doctors/:id",
    protect,
    authorizeRoles("PATIENT"),
    getDoctorById
);


router.get(
    "/profile",
    protect,
    authorizeRoles("PATIENT"),
    getMyProfile
);


router.put(
    "/profile",
    protect,
    authorizeRoles("PATIENT"),
    updateMyProfile
);


/* ========================= */
/* ADMIN PATIENT ROUTES */
/* ========================= */

router.get(
    "/admin",
    protect,
    authorizeRoles("ADMIN"),
    getAllPatients
);


router.get(
    "/admin/:id",
    protect,
    authorizeRoles("ADMIN"),
    getPatientById
);


module.exports =
    router;