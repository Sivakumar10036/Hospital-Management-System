import React,
{
    useEffect,
    useState
}
from "react";

import
{
    Link,
    useNavigate
}
from "react-router-dom";

import
{
    Stethoscope,
    Users,
    CalendarCheck,
    Building2,
    Clock3,
    RefreshCw,
    CheckCircle,
    XCircle,
    ArrowUpRight
}
from "lucide-react";

import "../../styles/superintendent.css";

import
{
    getSuperintendentDashboard
}
from "../../services/superintendentService";


const SuperintendentDashboard =
() =>
{
    const navigate =
        useNavigate();


    const [
        dashboard,
        setDashboard
    ] =
        useState(null);


    const [
        loading,
        setLoading
    ] =
        useState(true);


    const [
        error,
        setError
    ] =
        useState("");


    const fetchDashboard =
    async () =>
    {
        try
        {
            setLoading(true);

            setError("");


            const response =
                await getSuperintendentDashboard();


            setDashboard(
                response.dashboard ||
                response
            );
        }
        catch (requestError)
        {
            console.error(
                "Superintendent dashboard error:",
                requestError
            );


            setError(
                requestError.response?.data?.message ||
                "Unable to load superintendent dashboard."
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
            fetchDashboard();
        },
        []
    );


    const statistics =
        dashboard?.statistics ||
        {};


    const totalDoctors =
        statistics.totalDoctors ||
        0;


    const activeDoctors =
        statistics.activeDoctors ||
        0;


    const totalPatients =
        statistics.totalPatients ||
        0;


    const totalDepartments =
        statistics.totalDepartments ||
        0;


    const totalAppointments =
        statistics.totalAppointments ||
        0;


    const todayAppointments =
        statistics.todayAppointments ||
        0;


    const upcomingAppointments =
        statistics.upcomingAppointments ||
        0;


    const completedAppointments =
        statistics.completedAppointments ||
        0;


    const cancelledAppointments =
        statistics.cancelledAppointments ||
        0;


    const recentAppointments =
        dashboard?.recentAppointments ||
        [];


    const formatDate =
    (date) =>
    {
        if (!date)
        {
            return "—";
        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        )
        {
            return "—";
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


    const getStatusClass =
    (status) =>
    {
        switch (status)
        {
            case "CONFIRMED":

                return "superintendent-status confirmed";


            case "COMPLETED":

                return "superintendent-status completed";


            case "CANCELLED":

                return "superintendent-status cancelled";


            case "NO_SHOW":

                return "superintendent-status no-show";


            default:

                return "superintendent-status booked";
        }
    };


    const getStatusText =
    (status) =>
    {
        if (
            status ===
            "NO_SHOW"
        )
        {
            return "No Show";
        }


        return status ||
            "BOOKED";
    };


    const statisticCards =
    [
        {
            title:
                "Total Doctors",

            value:
                totalDoctors,

            icon:
                Stethoscope,

            className:
                "blue",

            path:
                "/superintendent/doctors"
        },

        {
            title:
                "Total Patients",

            value:
                totalPatients,

            icon:
                Users,

            className:
                "green",

            path:
                "/superintendent/patients"
        },

        {
            title:
                "Today's Appointments",

            value:
                todayAppointments,

            icon:
                CalendarCheck,

            className:
                "orange",

            path:
                "/superintendent/appointments"
        },

        {
            title:
                "Departments",

            value:
                totalDepartments,

            icon:
                Building2,

            className:
                "purple",

            path:
                "/superintendent/departments"
        }
    ];


    return (
        <div
            className=
                "superintendent-dashboard-page"
        >

            <div
                className=
                    "superintendent-dashboard-container"
            >


                {/* ========================= */}
                {/* HEADER */}
                {/* ========================= */}

                <div
                    className=
                        "superintendent-dashboard-header"
                >

                    <div>

                        <span
                            className=
                                "superintendent-eyebrow"
                        >
                            HOSPITAL OPERATIONS
                        </span>


                        <h1>
                            Superintendent Dashboard
                        </h1>


                        <p>
                            Monitor hospital operations,
                            staff activity and appointments.
                        </p>

                    </div>


                    <button
                        className=
                            "superintendent-refresh-button"

                        onClick={
                            fetchDashboard
                        }

                        disabled={
                            loading
                        }
                    >

                        <RefreshCw
                            size={17}

                            className={
                                loading
                                    ?
                                    "superintendent-spin"
                                    :
                                    ""
                            }
                        />

                        Refresh

                    </button>

                </div>


                {/* ========================= */}
                {/* ERROR */}
                {/* ========================= */}

                {
                    error &&
                    (
                        <div
                            className=
                                "superintendent-error"
                        >

                            <span>
                                {error}
                            </span>


                            <button
                                onClick={
                                    fetchDashboard
                                }
                            >
                                Try Again
                            </button>

                        </div>
                    )
                }


                {/* ========================= */}
                {/* STATISTICS */}
                {/* ========================= */}

                <div
                    className=
                        "superintendent-stat-grid"
                >

                    {
                        statisticCards.map(
                            statistic =>
                            {
                                const Icon =
                                    statistic.icon;


                                return (
                                    <div
                                        className={
                                            `superintendent-stat-card ${
                                                statistic.title ===
                                                "Total Patients"
                                                    ?
                                                    "clickable"
                                                    :
                                                    ""
                                            }`
                                        }

                                        key={
                                            statistic.title
                                        }

                                        onClick={
                                            () =>
                                            {
                                                if (
                                                    statistic.path
                                                )
                                                {
                                                    navigate(
                                                        statistic.path
                                                    );
                                                }
                                            }
                                        }

                                        role="button"

                                        tabIndex={0}

                                        onKeyDown={
                                            event =>
                                            {
                                                if (
                                                    event.key ===
                                                    "Enter"
                                                    ||
                                                    event.key ===
                                                    " "
                                                )
                                                {
                                                    if (
                                                        statistic.path
                                                    )
                                                    {
                                                        navigate(
                                                            statistic.path
                                                        );
                                                    }
                                                }
                                            }
                                        }
                                    >

                                        <div
                                            className={
                                                `superintendent-stat-icon ${statistic.className}`
                                            }
                                        >

                                            <Icon
                                                size={23}
                                            />

                                        </div>


                                        <div>

                                            <p>
                                                {
                                                    statistic.title
                                                }
                                            </p>


                                            <h2>

                                                {
                                                    loading
                                                        ?
                                                        "..."
                                                        :
                                                        statistic.value
                                                }

                                            </h2>

                                        </div>

                                    </div>
                                );
                            }
                        )
                    }

                </div>


                {/* ========================= */}
                {/* OVERVIEW */}
                {/* ========================= */}

                <div
                    className=
                        "superintendent-overview-grid"
                >


                    {/* APPOINTMENT OVERVIEW */}

                    <div
                        className=
                            "superintendent-panel"
                    >

                        <div
                            className=
                                "superintendent-panel-header"
                        >

                            <div>

                                <h2>
                                    Appointment Overview
                                </h2>

                                <p>
                                    Current hospital
                                    appointment activity.
                                </p>

                            </div>

                        </div>


                        <div
                            className=
                                "superintendent-overview-list"
                        >


                            <div
                                className=
                                    "superintendent-overview-item"
                            >

                                <div
                                    className=
                                        "overview-item-icon blue"
                                >

                                    <CalendarCheck
                                        size={19}
                                    />

                                </div>


                                <div>

                                    <span>
                                        Total Appointments
                                    </span>

                                    <strong>

                                        {
                                            loading
                                                ?
                                                "..."
                                                :
                                                totalAppointments
                                        }

                                    </strong>

                                </div>

                            </div>


                            <div
                                className=
                                    "superintendent-overview-item"
                            >

                                <div
                                    className=
                                        "overview-item-icon orange"
                                >

                                    <Clock3
                                        size={19}
                                    />

                                </div>


                                <div>

                                    <span>
                                        Upcoming
                                    </span>

                                    <strong>

                                        {
                                            loading
                                                ?
                                                "..."
                                                :
                                                upcomingAppointments
                                        }

                                    </strong>

                                </div>

                            </div>


                            <div
                                className=
                                    "superintendent-overview-item"
                            >

                                <div
                                    className=
                                        "overview-item-icon green"
                                >

                                    <CheckCircle
                                        size={19}
                                    />

                                </div>


                                <div>

                                    <span>
                                        Completed
                                    </span>

                                    <strong>

                                        {
                                            loading
                                                ?
                                                "..."
                                                :
                                                completedAppointments
                                        }

                                    </strong>

                                </div>

                            </div>


                            <div
                                className=
                                    "superintendent-overview-item"
                            >

                                <div
                                    className=
                                        "overview-item-icon red"
                                >

                                    <XCircle
                                        size={19}
                                    />

                                </div>


                                <div>

                                    <span>
                                        Cancelled
                                    </span>

                                    <strong>

                                        {
                                            loading
                                                ?
                                                "..."
                                                :
                                                cancelledAppointments
                                        }

                                    </strong>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* STAFF OVERVIEW */}

                    <div
                        className=
                            "superintendent-panel"
                    >

                        <div
                            className=
                                "superintendent-panel-header"
                        >

                            <div>

                                <h2>
                                    Staff Overview
                                </h2>

                                <p>
                                    Current doctor
                                    availability.
                                </p>

                            </div>

                        </div>


                        <div
                            className=
                                "staff-overview"
                        >


                            <div
                                className=
                                    "staff-overview-row"
                            >

                                <span>
                                    Total Doctors
                                </span>

                                <strong>

                                    {
                                        loading
                                            ?
                                            "..."
                                            :
                                            totalDoctors
                                    }

                                </strong>

                            </div>


                            <div
                                className=
                                    "staff-overview-row"
                            >

                                <span>
                                    Active Doctors
                                </span>

                                <strong
                                    className=
                                        "staff-active"
                                >

                                    {
                                        loading
                                            ?
                                            "..."
                                            :
                                            activeDoctors
                                    }

                                </strong>

                            </div>


                            <div
                                className=
                                    "staff-overview-row"
                            >

                                <span>
                                    Inactive Doctors
                                </span>

                                <strong
                                    className=
                                        "staff-inactive"
                                >

                                    {
                                        loading
                                            ?
                                            "..."
                                            :
                                            (
                                                totalDoctors -
                                                activeDoctors
                                            )
                                    }

                                </strong>

                            </div>


                            <div
                                className=
                                    "staff-progress"
                            >

                                <div
                                    className=
                                        "staff-progress-header"
                                >

                                    <span>
                                        Active Doctor Ratio
                                    </span>


                                    <strong>

                                        {
                                            totalDoctors > 0
                                                ?
                                                Math.round(
                                                    (
                                                        activeDoctors /
                                                        totalDoctors
                                                    ) *
                                                    100
                                                )
                                                :
                                                0
                                        }%

                                    </strong>

                                </div>


                                <div
                                    className=
                                        "staff-progress-track"
                                >

                                    <div
                                        className=
                                            "staff-progress-value"

                                        style={
                                            {
                                                width:
                                                    totalDoctors > 0
                                                        ?
                                                        `${(
                                                            activeDoctors /
                                                            totalDoctors
                                                        ) * 100}%`
                                                        :
                                                        "0%"
                                            }
                                        }
                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ========================= */}
                {/* RECENT APPOINTMENTS */}
                {/* ========================= */}

                <div
                    className=
                        "superintendent-panel"
                >

                    <div
                        className=
                            "superintendent-panel-header"
                    >

                        <div>

                            <h2>
                                Recent Appointments
                            </h2>

                            <p>
                                Latest appointments
                                across the hospital.
                            </p>

                        </div>


                        <Link
                            to="/superintendent/appointments"

                            className=
                                "superintendent-view-all"
                        >

                            View All

                            <ArrowUpRight
                                size={16}
                            />

                        </Link>

                    </div>


                    {
                        loading
                            ?
                            (
                                <div
                                    className=
                                        "superintendent-loading"
                                >

                                    <RefreshCw
                                        size={28}

                                        className=
                                            "superintendent-spin"
                                    />

                                    <p>
                                        Loading appointments...
                                    </p>

                                </div>
                            )
                            :
                            recentAppointments.length === 0
                                ?
                                (
                                    <div
                                        className=
                                            "superintendent-empty"
                                    >

                                        <CalendarCheck
                                            size={42}
                                        />

                                        <h3>
                                            No recent appointments
                                        </h3>

                                        <p>
                                            Recent hospital
                                            appointments will
                                            appear here.
                                        </p>

                                    </div>
                                )
                                :
                                (
                                    <div
                                        className=
                                            "superintendent-appointment-list"
                                    >

                                        {
                                            recentAppointments.map(
                                                appointment =>
                                                (
                                                    <div
                                                        className=
                                                            "superintendent-appointment-item"

                                                        key={
                                                            appointment._id
                                                        }
                                                    >

                                                        <div
                                                            className=
                                                                "superintendent-appointment-icon"
                                                        >

                                                            <CalendarCheck
                                                                size={19}
                                                            />

                                                        </div>


                                                        <div
                                                            className=
                                                                "superintendent-appointment-info"
                                                        >

                                                            <strong>
                                                                {
                                                                    appointment.patient?.name ||
                                                                    "Patient"
                                                                }
                                                            </strong>


                                                            <span>
                                                                Dr.{" "}
                                                                {
                                                                    appointment.doctor?.name ||
                                                                    "Doctor"
                                                                }
                                                            </span>


                                                            <small>

                                                                {
                                                                    formatDate(
                                                                        appointment.appointmentDate
                                                                    )
                                                                }

                                                                {" • "}

                                                                {
                                                                    appointment.appointmentTime ||
                                                                    appointment.startTime ||
                                                                    "—"
                                                                }

                                                            </small>

                                                        </div>


                                                        <span
                                                            className={
                                                                getStatusClass(
                                                                    appointment.status
                                                                )
                                                            }
                                                        >

                                                            {
                                                                getStatusText(
                                                                    appointment.status
                                                                )
                                                            }

                                                        </span>

                                                    </div>
                                                )
                                            )
                                        }

                                    </div>
                                )
                    }

                </div>


                {/* ========================= */}
                {/* QUICK ACCESS */}
                {/* ========================= */}

                <div
                    className=
                        "superintendent-quick-grid"
                >


                    <Link
                        to="/superintendent/doctors"

                        className=
                            "superintendent-quick-card"
                    >

                        <div
                            className=
                                "quick-icon blue"
                        >

                            <Stethoscope
                                size={22}
                            />

                        </div>


                        <div>

                            <h3>
                                Doctors
                            </h3>

                            <p>
                                Monitor doctors and
                                availability.
                            </p>

                        </div>


                        <ArrowUpRight
                            size={18}
                        />

                    </Link>


                    <Link
                        to="/superintendent/patients"

                        className=
                            "superintendent-quick-card"
                    >

                        <div
                            className=
                                "quick-icon green"
                        >

                            <Users
                                size={22}
                            />

                        </div>


                        <div>

                            <h3>
                                Patients
                            </h3>

                            <p>
                                View registered
                                patients.
                            </p>

                        </div>


                        <ArrowUpRight
                            size={18}
                        />

                    </Link>


                    <Link
                        to="/superintendent/appointments"

                        className=
                            "superintendent-quick-card"
                    >

                        <div
                            className=
                                "quick-icon orange"
                        >

                            <CalendarCheck
                                size={22}
                            />

                        </div>


                        <div>

                            <h3>
                                Appointments
                            </h3>

                            <p>
                                Monitor hospital
                                appointments.
                            </p>

                        </div>


                        <ArrowUpRight
                            size={18}
                        />

                    </Link>


                    <Link
                        to="/superintendent/reports"

                        className=
                            "superintendent-quick-card"
                    >

                        <div
                            className=
                                "quick-icon purple"
                        >

                            <Building2
                                size={22}
                            />

                        </div>


                        <div>

                            <h3>
                                Reports
                            </h3>

                            <p>
                                View operational
                                reports.
                            </p>

                        </div>


                        <ArrowUpRight
                            size={18}
                        />

                    </Link>

                </div>

            </div>

        </div>
    );
};


export default SuperintendentDashboard;