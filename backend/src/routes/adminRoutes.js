const express =
    require("express");

const protect =
    require("../middleware/authMiddleware");

const authorizeRoles =
    require("../middleware/roleMiddleware");

const uploadDoctorPhoto =
    require("../middleware/uploadMiddleware");


const
{
    createDoctor,

    getAllDoctors,

    getDoctorById,

    updateDoctor,

    updateDoctorStatus,

    getDashboard,

    getAllPatients,

    getAllAppointments,

    exportHospitalAppointments
} =
    require("../controllers/adminController");


const
{
    getDepartments,

    createDepartment,

    updateDepartment,

    updateDepartmentStatus
} =
    require("../controllers/departmentController");


const router =
    express.Router();


router.use(
    protect
);

router.use(
    authorizeRoles(
        "ADMIN",
        "SUPERINTENDENT"
    )
);


/* =========================
   DASHBOARD
========================= */

router.get(
    "/dashboard",
    getDashboard
);


/* =========================
   DEPARTMENTS
========================= */

router.get(
    "/departments",
    getDepartments
);

router.post(
    "/departments",
    createDepartment
);

router.put(
    "/departments/:id",
    updateDepartment
);

router.patch(
    "/departments/:id/status",
    updateDepartmentStatus
);


/* =========================
   PATIENTS
========================= */

router.get(
    "/patients",
    getAllPatients
);


/* =========================
   APPOINTMENTS
========================= */

router.get(
    "/appointments",
    getAllAppointments
);

router.get(
    "/appointments/export",
    exportHospitalAppointments
);


/* =========================
   DOCTORS
========================= */

router.post(
    "/doctors",
    uploadDoctorPhoto.single(
        "profilePhoto"
    ),
    createDoctor
);

router.get(
    "/doctors",
    getAllDoctors
);

router.get(
    "/doctors/:id",
    getDoctorById
);

router.put(
    "/doctors/:id",
    uploadDoctorPhoto.single(
        "profilePhoto"
    ),
    updateDoctor
);

router.patch(
    "/doctors/:id/status",
    updateDoctorStatus
);


module.exports =
    router;