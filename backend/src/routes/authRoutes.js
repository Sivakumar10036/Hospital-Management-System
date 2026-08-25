const express =
    require("express");


const
{
    registerPatient,
    login,
    getCurrentUser
} =
    require("../controllers/authController");


const protect =
    require("../middleware/authMiddleware");


const router =
    express.Router();


router.post(
    "/register",
    registerPatient
);


router.post(
    "/login",
    login
);


router.get(
    "/me",
    protect,
    getCurrentUser
);


module.exports =
    router;