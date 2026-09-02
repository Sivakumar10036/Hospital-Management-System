import React, {
    useEffect,
    useState
} from "react";


import {
    CalendarDays,
    Clock,
    CheckCircle,
    XCircle,
    Users,
    ArrowRight,
    RefreshCw,
    Stethoscope,
    User,
    Phone,
    Activity,
    LogOut
} from "lucide-react";


import {
    useNavigate
} from "react-router-dom";


import {
    getDoctorDashboard,
    getDoctorAppointments,
    updateAppointmentStatus
} from "../../services/doctorService";


import useAuth
    from "../../hooks/useAuth";


import "./DoctorDashboard.css";



const DoctorDashboard =
() =>
{

    const navigate =
        useNavigate();


    const {
        user,
        logout
    } =
        useAuth();



    /* -----------------------------------------
       STATE
    ----------------------------------------- */

    const [
        dashboard,
        setDashboard
    ] =
        useState(null);


    const [
        appointments,
        setAppointments
    ] =
        useState([]);


    const [
        loading,
        setLoading
    ] =
        useState(true);


    const [
        updatingId,
        setUpdatingId
    ] =
        useState(null);


    const [
        error,
        setError
    ] =
        useState("");



    /* -----------------------------------------
       LOGOUT
    ----------------------------------------- */

    const handleLogout =
    () =>
    {

        const confirmed =
            window.confirm(
                "Are you sure you want to logout?"
            );


        if (!confirmed)
        {
            return;
        }


        try
        {
            logout();
        }
        catch (logoutError)
        {
            console.error(
                "Logout error:",
                logoutError
            );
        }


        navigate(
            "/login",
            {
                replace: true
            }
        );
    };



    /* -----------------------------------------
       LOAD DASHBOARD DATA
    ----------------------------------------- */

    const loadDashboard =
    async () =>
    {

        try
        {
            setLoading(true);

            setError("");


            const [
                dashboardResponse,
                appointmentsResponse
            ] =
                await Promise.all(
                    [
                        getDoctorDashboard(),

                        getDoctorAppointments(
                            {
                                status:
                                    "CONFIRMED"
                            }
                        )
                    ]
                );


            /*
             * Dashboard API:
             *
             * response.dashboard
             */

            setDashboard(
                dashboardResponse?.dashboard ||
                null
            );


            /*
             * Appointments API:
             *
             * response.appointments
             */

            setAppointments(
                appointmentsResponse?.appointments ||
                []
            );
        }

        catch (requestError)
        {

            console.error(
                "Doctor dashboard error:",
                requestError
            );


            setError(
                requestError
                    ?.response
                    ?.data
                    ?.message ||

                "Unable to load doctor dashboard."
            );
        }

        finally
        {
            setLoading(false);
        }
    };



    useEffect(
        () =>
        {
            loadDashboard();
        },
        []
    );



    /* -----------------------------------------
       MARK APPOINTMENT COMPLETED
    ----------------------------------------- */

    const handleComplete =
    async (
        appointmentId
    ) =>
    {

        const confirmed =
            window.confirm(
                "Are you sure you want to mark this appointment as completed?"
            );


        if (!confirmed)
        {
            return;
        }


        try
        {

            setUpdatingId(
                appointmentId
            );


            await updateAppointmentStatus(
                appointmentId,
                {
                    status:
                        "COMPLETED"
                }
            );


            /*
             * Reload dashboard after
             * status update.
             */

            await loadDashboard();
        }

        catch (requestError)
        {

            console.error(
                "Complete appointment error:",
                requestError
            );


            alert(
                requestError
                    ?.response
                    ?.data
                    ?.message ||

                "Unable to complete appointment."
            );
        }

        finally
        {

            setUpdatingId(
                null
            );
        }
    };



    /* -----------------------------------------
       MARK APPOINTMENT NO SHOW
    ----------------------------------------- */

    const handleNoShow =
    async (
        appointmentId
    ) =>
    {

        const confirmed =
            window.confirm(
                "Are you sure this patient did not show up?"
            );


        if (!confirmed)
        {
            return;
        }


        try
        {

            setUpdatingId(
                appointmentId
            );


            await updateAppointmentStatus(
                appointmentId,
                {
                    status:
                        "NO_SHOW"
                }
            );


            await loadDashboard();
        }

        catch (requestError)
        {

            console.error(
                "No-show update error:",
                requestError
            );


            alert(
                requestError
                    ?.response
                    ?.data
                    ?.message ||

                "Unable to update appointment."
            );
        }

        finally
        {

            setUpdatingId(
                null
            );
        }
    };



    /* -----------------------------------------
       HELPER FUNCTIONS
    ----------------------------------------- */

    const getPatientName =
    (
        appointment
    ) =>
    {

        return (

            appointment
                ?.patient
                ?.user
                ?.name ||

            appointment
                ?.patient
                ?.name ||

            "Unknown Patient"
        );
    };



    const getPatientPhone =
    (
        appointment
    ) =>
    {

        return (

            appointment
                ?.patient
                ?.user
                ?.phone ||

            appointment
                ?.patient
                ?.phone ||

            "Not available"
        );
    };



    const getDepartment =
    (
        appointment
    ) =>
    {

        if (
            appointment?.department &&
            typeof appointment.department ===
                "object"
        )
        {

            return (

                appointment
                    .department
                    .name ||

                "Department"
            );
        }


        return (

            appointment?.department ||

            "General"
        );
    };



    const formatDate =
    (
        date
    ) =>
    {

        if (!date)
        {
            return "-";
        }


        const parsedDate =
            new Date(
                `${date}T00:00:00`
            );


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        )
        {
            return date;
        }


        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day:
                    "2-digit",

                month:
                    "short",

                year:
                    "numeric"
            }
        );
    };



    const statistics =
        dashboard?.statistics ||

        {
            todayAppointments:
                0,

            upcomingAppointments:
                0,

            completedAppointments:
                0,

            cancelledAppointments:
                0,

            totalAppointments:
                0
        };



    const doctorInfo =
        dashboard?.doctor ||
        {};



    /* -----------------------------------------
       LOADING
    ----------------------------------------- */

    if (loading)
    {

        return (

            <div className="doctor-dashboard">

                <div className="doctor-loading">

                    <RefreshCw
                        size={34}
                        className="doctor-spin"
                    />

                    <p>
                        Loading doctor dashboard...
                    </p>

                </div>

            </div>
        );
    }



    /* -----------------------------------------
       MAIN DASHBOARD
    ----------------------------------------- */

    return (

        <div className="doctor-dashboard">


            {/* =====================================
                HEADER
            ===================================== */}

            <div className="doctor-dashboard-header">

                <div>

                    <span className="doctor-eyebrow">
                        DOCTOR PORTAL
                    </span>


                    <h1>
                        Doctor Dashboard
                    </h1>


                    <p>
                        Welcome back,
                        {" "}

                        <strong>
                            {
                                user?.name ||
                                "Doctor"
                            }
                        </strong>
                        .
                        Here's your appointment
                        overview.
                    </p>

                </div>



                {/* HEADER ACTIONS */}

                <div className="doctor-header-actions">


                    {/* REFRESH */}

                    <button
                        className="doctor-refresh-button"
                        onClick={
                            loadDashboard
                        }
                        disabled={
                            loading
                        }
                    >

                        <RefreshCw
                            size={17}
                        />

                        Refresh

                    </button>



                    {/* LOGOUT */}

                    <button
                        className="doctor-logout-button"
                        onClick={
                            handleLogout
                        }
                    >

                        <LogOut
                            size={17}
                        />

                        Logout

                    </button>


                </div>

            </div>



            {/* =====================================
                ERROR
            ===================================== */}

            {error && (

                <div className="doctor-error">

                    <XCircle
                        size={18}
                    />

                    {error}

                </div>

            )}



            {/* =====================================
                DOCTOR PROFILE CARD
            ===================================== */}

            <div className="doctor-profile-card">

                <div className="doctor-profile-left">

                    <div className="doctor-profile-avatar">

                        {
                            doctorInfo?.profilePhoto

                                ? (

                                    <img
                                        src={
                                            doctorInfo
                                                .profilePhoto
                                        }
                                        alt="Doctor"
                                    />

                                )

                                : (

                                    <Stethoscope
                                        size={32}
                                    />

                                )
                        }

                    </div>


                    <div>

                        <span className="profile-label">
                            Welcome
                        </span>


                        <h2>
                            Dr.{" "}
                            {
                                user?.name ||
                                "Doctor"
                            }
                        </h2>


                        <p>
                            {
                                doctorInfo
                                    ?.specialization ||

                                "Medical Specialist"
                            }
                        </p>

                    </div>

                </div>



                <div className="doctor-profile-details">


                    <div>

                        <span>
                            Doctor ID
                        </span>

                        <strong>
                            {
                                doctorInfo
                                    ?.doctorId ||

                                "-"
                            }
                        </strong>

                    </div>



                    <div>

                        <span>
                            Email
                        </span>

                        <strong>
                            {
                                user?.email ||
                                "-"
                            }
                        </strong>

                    </div>



                    <div>

                        <span>
                            Role
                        </span>

                        <strong
                            className="role-badge"
                        >
                            DOCTOR
                        </strong>

                    </div>


                </div>

            </div>



            {/* =====================================
                STATISTICS
            ===================================== */}

            <div className="doctor-statistics">


                {/* TODAY */}

                <div className="doctor-stat-card">

                    <div className="doctor-stat-icon today">

                        <CalendarDays
                            size={23}
                        />

                    </div>


                    <div>

                        <span>
                            Today's Appointments
                        </span>

                        <strong>
                            {
                                statistics
                                    .todayAppointments
                            }
                        </strong>

                    </div>

                </div>



                {/* UPCOMING */}

                <div className="doctor-stat-card">

                    <div className="doctor-stat-icon upcoming">

                        <Clock
                            size={23}
                        />

                    </div>


                    <div>

                        <span>
                            Upcoming
                        </span>

                        <strong>
                            {
                                statistics
                                    .upcomingAppointments
                            }
                        </strong>

                    </div>

                </div>



                {/* COMPLETED */}

                <div className="doctor-stat-card">

                    <div className="doctor-stat-icon completed">

                        <CheckCircle
                            size={23}
                        />

                    </div>


                    <div>

                        <span>
                            Completed
                        </span>

                        <strong>
                            {
                                statistics
                                    .completedAppointments
                            }
                        </strong>

                    </div>

                </div>



                {/* TOTAL */}

                <div className="doctor-stat-card">

                    <div className="doctor-stat-icon total">

                        <Users
                            size={23}
                        />

                    </div>


                    <div>

                        <span>
                            Total Appointments
                        </span>

                        <strong>
                            {
                                statistics
                                    .totalAppointments
                            }
                        </strong>

                    </div>

                </div>

            </div>



            {/* =====================================
                MAIN CONTENT
            ===================================== */}

            <div className="doctor-dashboard-grid">


                {/* =================================
                    TODAY'S PATIENTS
                ================================= */}

                <section className="doctor-panel">

                    <div className="doctor-panel-header">

                        <div>

                            <span className="panel-label">
                                TODAY
                            </span>

                            <h2>
                                Today's Patients
                            </h2>

                            <p>
                                Patients currently
                                scheduled with you.
                            </p>

                        </div>


                        <button
                            className="view-all-button"
                            onClick={() =>
                                navigate(
                                    "/doctor/appointments"
                                )
                            }
                        >

                            View All

                            <ArrowRight
                                size={16}
                            />

                        </button>

                    </div>



                    {
                        appointments.length === 0

                            ? (

                                <div className="doctor-empty">

                                    <CalendarDays
                                        size={42}
                                    />

                                    <h3>
                                        No confirmed appointments
                                    </h3>

                                    <p>
                                        You don't have any
                                        confirmed appointments
                                        at the moment.
                                    </p>

                                </div>

                            )

                            : (

                                <div className="doctor-appointment-list">

                                    {
                                        appointments
                                            .slice(
                                                0,
                                                5
                                            )
                                            .map(
                                                (
                                                    appointment
                                                ) =>
                                                {

                                                    const
                                                        patientName =
                                                        getPatientName(
                                                            appointment
                                                        );


                                                    const
                                                        patientPhone =
                                                        getPatientPhone(
                                                            appointment
                                                        );


                                                    const
                                                        updating =
                                                        updatingId ===
                                                        appointment._id;


                                                    return (

                                                        <div
                                                            className="doctor-appointment-card"
                                                            key={
                                                                appointment._id
                                                            }
                                                        >


                                                            {/* PATIENT */}

                                                            <div className="appointment-patient">

                                                                <div className="patient-avatar">

                                                                    <User
                                                                        size={19}
                                                                    />

                                                                </div>


                                                                <div>

                                                                    <h3>
                                                                        {
                                                                            patientName
                                                                        }
                                                                    </h3>


                                                                    <span className="patient-phone">

                                                                        <Phone
                                                                            size={13}
                                                                        />

                                                                        {
                                                                            patientPhone
                                                                        }

                                                                    </span>

                                                                </div>

                                                            </div>



                                                            {/* DATE/TIME */}

                                                            <div className="appointment-info">

                                                                <div>

                                                                    <CalendarDays
                                                                        size={15}
                                                                    />

                                                                    {
                                                                        formatDate(
                                                                            appointment
                                                                                .appointmentDate
                                                                        )
                                                                    }

                                                                </div>


                                                                <div>

                                                                    <Clock
                                                                        size={15}
                                                                    />

                                                                    {
                                                                        appointment
                                                                            .appointmentTime ||

                                                                        "-"
                                                                    }

                                                                </div>

                                                            </div>



                                                            {/* DEPARTMENT */}

                                                            <div className="appointment-department">

                                                                <span>
                                                                    Department
                                                                </span>

                                                                <strong>
                                                                    {
                                                                        getDepartment(
                                                                            appointment
                                                                        )
                                                                    }
                                                                </strong>

                                                            </div>



                                                            {/* STATUS */}

                                                            <div className="appointment-status-area">

                                                                <span className="doctor-status-confirmed">
                                                                    CONFIRMED
                                                                </span>

                                                            </div>



                                                            {/* ACTIONS */}

                                                            <div className="appointment-actions">

                                                                <button
                                                                    className="complete-button"
                                                                    onClick={() =>
                                                                        handleComplete(
                                                                            appointment._id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        updating
                                                                    }
                                                                >

                                                                    {
                                                                        updating

                                                                            ? (

                                                                                <RefreshCw
                                                                                    size={15}
                                                                                    className="doctor-spin"
                                                                                />

                                                                            )

                                                                            : (

                                                                                <CheckCircle
                                                                                    size={15}
                                                                                />

                                                                            )
                                                                    }

                                                                    Complete

                                                                </button>



                                                                <button
                                                                    className="no-show-button"
                                                                    onClick={() =>
                                                                        handleNoShow(
                                                                            appointment._id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        updating
                                                                    }
                                                                >

                                                                    <XCircle
                                                                        size={15}
                                                                    />

                                                                    No Show

                                                                </button>

                                                            </div>

                                                        </div>

                                                    );
                                                }
                                            )
                                    }

                                </div>

                            )
                    }

                </section>



                {/* =================================
                    QUICK ACTIONS
                ================================= */}

                <section className="doctor-panel quick-actions-panel">

                    <div className="doctor-panel-header">

                        <div>

                            <span className="panel-label">
                                QUICK ACCESS
                            </span>

                            <h2>
                                Doctor Tools
                            </h2>

                            <p>
                                Manage your daily work.
                            </p>

                        </div>

                    </div>



                    <div className="quick-actions">


                        {/* APPOINTMENTS */}

                        <button
                            className="quick-action"
                            onClick={() =>
                                navigate(
                                    "/doctor/appointments"
                                )
                            }
                        >

                            <div className="quick-action-icon">

                                <CalendarDays
                                    size={21}
                                />

                            </div>


                            <div>

                                <strong>
                                    My Appointments
                                </strong>

                                <span>
                                    View and manage
                                    appointments
                                </span>

                            </div>


                            <ArrowRight
                                size={17}
                            />

                        </button>



                        {/* SCHEDULE */}

                        <button
                            className="quick-action"
                            onClick={() =>
                                navigate(
                                    "/doctor/schedule"
                                )
                            }
                        >

                            <div className="quick-action-icon">

                                <Clock
                                    size={21}
                                />

                            </div>


                            <div>

                                <strong>
                                    My Schedule
                                </strong>

                                <span>
                                    View your working
                                    schedule
                                </span>

                            </div>


                            <ArrowRight
                                size={17}
                            />

                        </button>



                        {/* PROFILE */}

                        <button
                            className="quick-action"
                            onClick={() =>
                                navigate(
                                    "/doctor/profile"
                                )
                            }
                        >

                            <div className="quick-action-icon">

                                <User
                                    size={21}
                                />

                            </div>


                            <div>

                                <strong>
                                    My Profile
                                </strong>

                                <span>
                                    View doctor profile
                                </span>

                            </div>


                            <ArrowRight
                                size={17}
                            />

                        </button>



                        {/* STATUS */}

                        <div className="availability-card">

                            <div className="availability-icon">

                                <Activity
                                    size={21}
                                />

                            </div>


                            <div>

                                <strong>
                                    Doctor Status
                                </strong>

                                <span>
                                    Currently logged in
                                </span>

                            </div>


                            <span className="active-badge">
                                ACTIVE
                            </span>

                        </div>

                    </div>

                </section>

            </div>



            {/* =====================================
                FOOTER INFORMATION
            ===================================== */}

            <div className="doctor-footer-card">

                <div className="footer-icon">

                    <Stethoscope
                        size={22}
                    />

                </div>


                <div>

                    <strong>
                        Healthcare Management
                    </strong>

                    <p>
                        Manage appointments, patients
                        and your daily schedule securely
                        from one place.
                    </p>

                </div>

            </div>


        </div>
    );
};



export default DoctorDashboard;