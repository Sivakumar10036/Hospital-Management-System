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


/* =========================================
   LOAD ENVIRONMENT VARIABLES
========================================= */

dotenv.config();


/* =========================================
   CREATE EXPRESS APP
========================================= */

const app =
    express();


/* =========================================
   CONNECT DATABASE
========================================= */

connectDatabase();


/* =========================================
   CORS CONFIGURATION
========================================= */

const allowedOrigins =
[
    "http://localhost:3000",

    "https://hospital-management-system-ser.vercel.app",

    "https://hospital-management-system-wduj-3jnsm2f8p-siva-kumar-s-projects.vercel.app"
];


app.use(
    cors(
        {
            origin:
                function(
                    origin,
                    callback
                )
                {
                    /*
                    Allow requests that do not
                    contain an Origin header.

                    Example:
                    Postman
                    server-to-server requests
                    */

                    if (!origin)
                    {
                        return callback(
                            null,
                            true
                        );
                    }


                    /*
                    Check whether the frontend
                    origin is allowed.
                    */

                    if (
                        allowedOrigins.includes(
                            origin
                        )
                    )
                    {
                        return callback(
                            null,
                            true
                        );
                    }


                    console.log(
                        "CORS blocked origin:",
                        origin
                    );


                    return callback(
                        new Error(
                            "Not allowed by CORS"
                        )
                    );
                },


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
        }
    )
);


/* =========================================
   BODY PARSERS
========================================= */

app.use(
    express.json()
);


app.use(
    express.urlencoded(
        {
            extended: true
        }
    )
);


/* =========================================
   COOKIE PARSER
========================================= */

app.use(
    cookieParser()
);


/* =========================================
   STATIC UPLOADS
========================================= */

app.use(
    "/uploads",
    express.static(
        path.join(
            __dirname,
            "../uploads"
        )
    )
);


/* =========================================
   AUTH ROUTES
========================================= */

app.use(
    "/api/auth",
    authRoutes
);


/* =========================================
   ADMIN ROUTES
========================================= */

app.use(
    "/api/admin",
    adminRoutes
);


/* =========================================
   DOCTOR ROUTES
========================================= */

app.use(
    "/api/doctor",
    doctorRoutes
);


/* =========================================
   SUPERINTENDENT ROUTES
========================================= */

app.use(
    "/api/superintendents",
    superintendentRoutes
);


/* =========================================
   APPOINTMENT ROUTES
========================================= */

app.use(
    "/api/appointments",
    appointmentRoutes
);


/* =========================================
   PATIENT ROUTES
========================================= */

app.use(
    "/api/patients",
    patientRoutes
);


/* =========================================
   ROOT ROUTE
========================================= */

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
            }
        );
    }
);


/* =========================================
   HEALTH CHECK
========================================= */

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
            }
        );
    }
);


/* =========================================
   SERVER
========================================= */

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
