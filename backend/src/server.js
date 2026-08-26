const express =
    require("express");

const cors =
    require("cors");

const dotenv =
    require("dotenv");

const cookieParser =
    require("cookie-parser");

const path =
    require("path");

const connectDatabase =
    require("./config/db");

const authRoutes =
    require("./routes/authRoutes");

const adminRoutes =
    require("./routes/adminRoutes");

const doctorRoutes =
    require("./routes/doctorRoutes");

const superintendentRoutes =
    require("./routes/superintendentRoutes");

const appointmentRoutes =
    require("./routes/appointmentRoutes");

const patientRoutes =
    require("./routes/patientRoutes");

dotenv.config();

const app =
    express();

connectDatabase();

app.use(
    cors(
    {
        origin:
            "http://localhost:3000",
            "https://hospital-management-system-ser.vercel.app"

        credentials:
            true,

        methods:
        [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders:
        [
            "Content-Type",
            "Authorization"
        ]
    })
);

app.use(
    express.json()
);

app.use(
    express.urlencoded(
    {
        extended: true
    })
);

app.use(
    cookieParser()
);

app.use(
    "/uploads",
    express.static(
        path.join(
            __dirname,
            "../uploads"
        )
    )
);

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);

app.use(
    "/api/doctor",
    doctorRoutes
);

app.use(
    "/api/superintendents",
    superintendentRoutes
);

app.use(
    "/api/appointments",
    appointmentRoutes
);

app.use(
    "/api/patients",
    patientRoutes
);

app.get(
    "/",
    (
        request,
        response
    ) =>
    {
        response.json(
        {
            success:
                true,

            message:
                "Hospital Management System API is running"
        });
    }
);

app.get(
    "/api/health",
    (
        request,
        response
    ) =>
    {
        response.json(
        {
            success:
                true,

            message:
                "Server is healthy"
        });
    }
);

const PORT =
    process.env.PORT ||
    5000;

app.listen(
    PORT,
    () =>
    {
        console.log(
            `Server running on port ${PORT}`
        );
    }
);
