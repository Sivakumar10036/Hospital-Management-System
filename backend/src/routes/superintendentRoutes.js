const express =
    require("express");

const protect =
    require("../middleware/authMiddleware");

const authorizeRoles =
    require("../middleware/roleMiddleware");

const
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
} =
    require("../controllers/superintendentController");

const router =
    express.Router();

/*
 * Superintendent portal
 */

router.get(
    "/dashboard",
    protect,
    authorizeRoles("SUPERINTENDENT"),
    getDashboard
);

router.get(
    "/doctors",
    protect,
    authorizeRoles("SUPERINTENDENT"),
    getAllDoctors
);

router.get(
    "/patients",
    protect,
    authorizeRoles("SUPERINTENDENT"),
    getAllPatients
);

router.get(
    "/appointments",
    protect,
    authorizeRoles("SUPERINTENDENT"),
    getAllAppointments
);

router.get(
    "/appointments/export",
    protect,
    authorizeRoles("SUPERINTENDENT"),
    exportHospitalAppointments
);

router.get(
    "/departments/statistics",
    protect,
    authorizeRoles("SUPERINTENDENT"),
    getDepartmentStatistics
);

/*
 * Superintendent settings
 * A logged-in Superintendent can change their own password.
 */
router.patch(
    "/change-password",
    protect,
    authorizeRoles("SUPERINTENDENT"),
    changeSuperintendentPassword
);

/*
 * Admin superintendent management
 */

router.post(
    "/",
    protect,
    authorizeRoles("ADMIN"),
    createSuperintendent
);

router.get(
    "/",
    protect,
    authorizeRoles("ADMIN"),
    getAllSuperintendents
);

router.get(
    "/:id",
    protect,
    authorizeRoles("ADMIN"),
    getSuperintendentById
);

router.put(
    "/:id",
    protect,
    authorizeRoles("ADMIN"),
    updateSuperintendent
);

router.patch(
    "/:id/status",
    protect,
    authorizeRoles("ADMIN"),
    updateSuperintendentStatus
);

module.exports = router;
