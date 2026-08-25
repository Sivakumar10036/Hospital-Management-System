import React,
{
    useEffect,
    useState
}
from "react";

import
{
    Stethoscope,
    Users,
    CalendarCheck,
    Building2,
    ArrowUpRight,
    Clock3,
    RefreshCw,
    CalendarDays,
    ShieldCheck
}
from "lucide-react";

import api
from "../../api/axios";


const AdminDashboard =
() =>
{
    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const loadDashboard =
    async () =>
    {
        try
        {
            setLoading(true);

            setError("");

            const response =
                await api.get(
                    "/admin/dashboard"
                );

            setDashboard(
                response.data.dashboard
            );
        }
        catch (requestError)
        {
            console.error(
                "Dashboard error:",
                requestError
            );

            setError(
                requestError.response?.data?.message ||
                "Unable to load dashboard."
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


    const statistics =
        dashboard?.statistics ||
        {};


    const doctors =
        statistics.totalDoctors ||
        0;

    const activeDoctors =
        statistics.activeDoctors ||
        0;

    const patients =
        statistics.totalPatients ||
        0;

    const appointments =
        statistics.totalAppointments ||
        0;

    const departments =
        statistics.totalDepartments ||
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


    const statisticCards =
    [
        {
            title:
                "Total Doctors",

            value:
                doctors,

            icon:
                Stethoscope,

            className:
                "blue"
        },

        {
            title:
                "Total Patients",

            value:
                patients,

            icon:
                Users,

            className:
                "green"
        },

        {
            title:
                "Appointments",

            value:
                appointments,

            icon:
                CalendarCheck,

            className:
                "orange"
        },

        {
            title:
                "Departments",

            value:
                departments,

            icon:
                Building2,

            className:
                "purple"
        }
    ];


    const formatDate =
    (date) =>
    {
        if (!date)
        {
            return "—";
        }

        return new Date(
            date
        ).toLocaleDateString(
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


    const getPatientName =
    (appointment) =>
    {
        return (
            appointment.patient?.user?.name ||
            appointment.patient?.name ||
            "Patient"
        );
    };


    const getDoctorName =
    (appointment) =>
    {
        return (
            appointment.doctor?.user?.name ||
            appointment.doctor?.name ||
            "Doctor"
        );
    };


    const getStatusClass =
    (status) =>
    {
        return (
            status ||
            "BOOKED"
        )
            .toLowerCase()
            .replace(
                "_",
                "-"
            );
    };


    return (
        <div className="dashboard-page">

            <div className="page-heading">

                <div>

                    <span className="page-eyebrow">
                        OVERVIEW
                    </span>

                    <h1>
                        Admin Dashboard
                    </h1>

                    <p>
                        Welcome back. Here's
                        what's happening
                        at MediCare today.
                    </p>

                </div>


                <div className="dashboard-date">

                    <Clock3
                        size={17}
                    />

                    <span>
                        Hospital Administration
                    </span>

                </div>

            </div>


            {
                error &&
                (
                    <div className="dashboard-error">

                        {error}

                        <button
                            onClick={
                                loadDashboard
                            }
                        >
                            Try Again
                        </button>

                    </div>
                )
            }


            <section
                className="statistics-grid"
            >

                {
                    statisticCards.map(
                        (stat) =>
                        {
                            const Icon =
                                stat.icon;

                            return (
                                <div
                                    className="stat-card"
                                    key={
                                        stat.title
                                    }
                                >

                                    <div
                                        className={
                                            `stat-icon ${stat.className}`
                                        }
                                    >

                                        <Icon
                                            size={23}
                                        />

                                    </div>


                                    <div
                                        className="stat-details"
                                    >

                                        <span>
                                            {
                                                stat.title
                                            }
                                        </span>

                                        <strong>
                                            {
                                                loading
                                                    ? "..."
                                                    : stat.value
                                            }
                                        </strong>

                                    </div>


                                    <ArrowUpRight
                                        size={18}
                                        className="stat-arrow"
                                    />

                                </div>
                            );
                        }
                    )
                }

            </section>


            <section
                className="dashboard-grid"
            >

                <div
                    className="dashboard-panel"
                >

                    <div
                        className="panel-header"
                    >

                        <div>

                            <h2>
                                Appointment Overview
                            </h2>

                            <p>
                                Current hospital
                                appointment summary
                            </p>

                        </div>


                        <button
                            className="dashboard-refresh-button"
                            onClick={
                                loadDashboard
                            }
                            disabled={
                                loading
                            }
                        >

                            <RefreshCw
                                size={17}
                                className={
                                    loading
                                        ? "dashboard-spin"
                                        : ""
                                }
                            />

                            Refresh

                        </button>

                    </div>


                    <div
                        className="appointment-summary"
                    >

                        <div
                            className="summary-item"
                        >

                            <CalendarDays
                                size={20}
                            />

                            <span>
                                Today
                            </span>

                            <strong>
                                {
                                    loading
                                        ? "..."
                                        : todayAppointments
                                }
                            </strong>

                        </div>


                        <div
                            className="summary-item"
                        >

                            <Clock3
                                size={20}
                            />

                            <span>
                                Upcoming
                            </span>

                            <strong>
                                {
                                    loading
                                        ? "..."
                                        : upcomingAppointments
                                }
                            </strong>

                        </div>


                        <div
                            className="summary-item"
                        >

                            <CalendarCheck
                                size={20}
                            />

                            <span>
                                Completed
                            </span>

                            <strong
                                className="text-green"
                            >
                                {
                                    loading
                                        ? "..."
                                        : completedAppointments
                                }
                            </strong>

                        </div>


                        <div
                            className="summary-item"
                        >

                            <CalendarCheck
                                size={20}
                            />

                            <span>
                                Cancelled
                            </span>

                            <strong
                                className="text-red"
                            >
                                {
                                    loading
                                        ? "..."
                                        : cancelledAppointments
                                }
                            </strong>

                        </div>

                    </div>

                </div>


                <div
                    className="dashboard-panel"
                >

                    <div
                        className="panel-header"
                    >

                        <div>

                            <h2>
                                Doctor Overview
                            </h2>

                            <p>
                                Current medical
                                staff summary
                            </p>

                        </div>

                    </div>


                    <div
                        className="doctor-summary"
                    >

                        <div
                            className="summary-item"
                        >

                            <span>
                                Total Doctors
                            </span>

                            <strong>
                                {
                                    loading
                                        ? "..."
                                        : doctors
                                }
                            </strong>

                        </div>


                        <div
                            className="summary-item"
                        >

                            <span>
                                Active
                            </span>

                            <strong
                                className="text-green"
                            >
                                {
                                    loading
                                        ? "..."
                                        : activeDoctors
                                }
                            </strong>

                        </div>


                        <div
                            className="summary-item"
                        >

                            <span>
                                Inactive
                            </span>

                            <strong
                                className="text-red"
                            >
                                {
                                    loading
                                        ? "..."
                                        :
                                        (
                                            doctors -
                                            activeDoctors
                                        )
                                }
                            </strong>

                        </div>

                    </div>

                </div>

            </section>


            <section
                className="dashboard-panel"
            >

                <div
                    className="panel-header"
                >

                    <div>

                        <h2>
                            Recent Appointments
                        </h2>

                        <p>
                            Latest appointments
                            booked in MediCare
                        </p>

                    </div>


                    <a
                        href="/admin/appointments"
                        className="view-all-link"
                    >

                        View all

                        <ArrowUpRight
                            size={16}
                        />

                    </a>

                </div>


                {
                    loading
                    ?
                    (
                        <div
                            className="dashboard-loading"
                        >

                            <RefreshCw
                                size={28}
                                className="dashboard-spin"
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
                            className="empty-state"
                        >

                            <CalendarCheck
                                size={40}
                            />

                            <h3>
                                No appointments found
                            </h3>

                            <p>
                                Appointments will
                                appear here once
                                patients book them.
                            </p>

                        </div>
                    )
                    :
                    (
                        <div
                            className="recent-appointment-list"
                        >

                            {
                                recentAppointments.map(
                                    (
                                        appointment
                                    ) =>
                                    (
                                        <div
                                            className="recent-appointment"
                                            key={
                                                appointment._id
                                            }
                                        >

                                            <div
                                                className="recent-appointment-icon"
                                            >

                                                <CalendarCheck
                                                    size={20}
                                                />

                                            </div>


                                            <div
                                                className="recent-appointment-info"
                                            >

                                                <strong>
                                                    {
                                                        getPatientName(
                                                            appointment
                                                        )
                                                    }
                                                </strong>

                                                <span>
                                                    Doctor:{" "}
                                                    {
                                                        getDoctorName(
                                                            appointment
                                                        )
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
                                                        "—"
                                                    }
                                                </small>

                                            </div>


                                            <span
                                                className={
                                                    `appointment-status ${getStatusClass(
                                                        appointment.status
                                                    )}`
                                                }
                                            >

                                                {
                                                    appointment.status ||
                                                    "BOOKED"
                                                }

                                            </span>

                                        </div>
                                    )
                                )
                            }

                        </div>
                    )
                }

            </section>


            <section
                className="dashboard-panel"
            >

                <div
                    className="panel-header"
                >

                    <div>

                        <h2>
                            Quick Actions
                        </h2>

                        <p>
                            Frequently used
                            administration tools
                        </p>

                    </div>

                </div>


                <div
                    className="quick-actions"
                >

                    <a
                        href="/admin/doctors"
                        className="quick-action"
                    >

                        <Stethoscope
                            size={20}
                        />

                        <span>
                            Manage Doctors
                        </span>

                    </a>


                    <a
                        href="/admin/patients"
                        className="quick-action"
                    >

                        <Users
                            size={20}
                        />

                        <span>
                            Manage Patients
                        </span>

                    </a>


                    <a
                        href="/admin/appointments"
                        className="quick-action"
                    >

                        <CalendarCheck
                            size={20}
                        />

                        <span>
                            Appointments
                        </span>

                    </a>


                    <a
                        href="/admin/departments"
                        className="quick-action"
                    >

                        <Building2
                            size={20}
                        />

                        <span>
                            Departments
                        </span>

                    </a>


                    <a
                        href="/admin/superintendents"
                        className="quick-action"
                    >

                        <ShieldCheck
                            size={20}
                        />

                        <span>
                            Manage Superintendents
                        </span>

                    </a>

                </div>

            </section>

        </div>
    );
};


export default AdminDashboard;