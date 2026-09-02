import React,
{
    useEffect,
    useState
}
from "react";

import
{
    Stethoscope,
    CalendarDays,
    Clock,
    Users,
    ArrowRight,
    RefreshCw,
    LogOut
}
from "lucide-react";

import
{
    useNavigate
}
from "react-router-dom";

import api
from "../../api/axios";

import
{
    useAuth
}
from "../../hooks/useAuth";

import "./PatientDashboard.css";


const PatientDashboard =
() =>
{
    const navigate =
        useNavigate();

    const {
        logout
    } =
        useAuth();


    const [dashboard, setDashboard] =
        useState(
            {
                availableDoctors: 0,

                totalAppointments: 0,

                upcomingAppointments: 0,

                healthcareTeam: 0
            }
        );


    const [appointments, setAppointments] =
        useState([]);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    const fetchDashboard =
    async () =>
    {
        try
        {
            setLoading(true);

            setError("");


            const response =
                await api.get(
                    "/patients/dashboard"
                );


            setDashboard(
                response.data.statistics ||
                {
                    availableDoctors: 0,

                    totalAppointments: 0,

                    upcomingAppointments: 0,

                    healthcareTeam: 0
                }
            );


            setAppointments(
                response.data.appointments ||
                []
            );
        }
        catch (requestError)
        {
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
            fetchDashboard();
        },
        []
    );


    const formatDate =
    (date) =>
    {
        if (!date)
        {
            return "Date unavailable";
        }


        return new Date(
            date
        ).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",

                month: "short",

                year: "numeric"
            }
        );
    };


    const formatStatus =
    (status) =>
    {
        if (!status)
        {
            return "";
        }


        return status
            .toLowerCase()
            .replace(
                "_",
                " "
            );
    };


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


    return (
        <div className="patient-dashboard-page">

            <div className="patient-dashboard-container">


                <div className="patient-dashboard-header">

                    <div>

                        <span className="patient-eyebrow">
                            PATIENT PORTAL
                        </span>

                        <h1>
                            Patient Dashboard
                        </h1>

                        <p>
                            Manage your appointments and
                            find the right doctor for your
                            healthcare needs.
                        </p>

                    </div>


                    <div className="patient-header-actions">

                        <button
                            className="patient-refresh-button"
                            onClick={fetchDashboard}
                            disabled={loading}
                        >

                            <RefreshCw
                                size={17}
                                className={
                                    loading
                                        ? "patient-spin"
                                        : ""
                                }
                            />

                            Refresh

                        </button>


                        <button
                            className="patient-logout-button"
                            onClick={handleLogout}
                        >

                            <LogOut
                                size={17}
                            />

                            Logout

                        </button>

                    </div>

                </div>


                {
                    error &&
                    (
                        <div className="patient-dashboard-error">
                            {error}
                        </div>
                    )
                }


                <div className="patient-stat-grid">


                    <div className="patient-stat-card">

                        <div className="patient-stat-icon blue">

                            <Stethoscope
                                size={24}
                            />

                        </div>

                        <div>

                            <p>
                                Available Doctors
                            </p>

                            <h2>
                                {
                                    dashboard.availableDoctors
                                }
                            </h2>

                        </div>

                    </div>


                    <div className="patient-stat-card">

                        <div className="patient-stat-icon green">

                            <CalendarDays
                                size={24}
                            />

                        </div>

                        <div>

                            <p>
                                My Appointments
                            </p>

                            <h2>
                                {
                                    dashboard.totalAppointments
                                }
                            </h2>

                        </div>

                    </div>


                    <div className="patient-stat-card">

                        <div className="patient-stat-icon purple">

                            <Clock
                                size={24}
                            />

                        </div>

                        <div>

                            <p>
                                Upcoming
                            </p>

                            <h2>
                                {
                                    dashboard.upcomingAppointments
                                }
                            </h2>

                        </div>

                    </div>


                    <div className="patient-stat-card">

                        <div className="patient-stat-icon orange">

                            <Users
                                size={24}
                            />

                        </div>

                        <div>

                            <p>
                                Healthcare Team
                            </p>

                            <h2>
                                {
                                    dashboard.healthcareTeam
                                }
                            </h2>

                        </div>

                    </div>

                </div>


                <div className="patient-action-grid">


                    <div
                        className="patient-action-card"
                        onClick={() =>
                            navigate(
                                "/patient/doctors"
                            )
                        }
                    >

                        <div className="patient-action-icon">

                            <Stethoscope
                                size={28}
                            />

                        </div>


                        <div className="patient-action-content">

                            <h2>
                                Find a Doctor
                            </h2>

                            <p>
                                Browse doctors by
                                specialization and
                                department.
                            </p>

                            <span>

                                Find Doctor

                                <ArrowRight
                                    size={15}
                                />

                            </span>

                        </div>


                        <ArrowRight
                            size={20}
                        />

                    </div>


                    <div
                        className="patient-action-card"
                        onClick={() =>
                            navigate(
                                "/patient/appointments"
                            )
                        }
                    >

                        <div className="patient-action-icon green">

                            <CalendarDays
                                size={28}
                            />

                        </div>


                        <div className="patient-action-content">

                            <h2>
                                My Appointments
                            </h2>

                            <p>
                                View and manage your
                                booked appointments.
                            </p>

                            <span>

                                View Appointments

                                <ArrowRight
                                    size={15}
                                />

                            </span>

                        </div>


                        <ArrowRight
                            size={20}
                        />

                    </div>


                    <div
                        className="patient-action-card"
                        onClick={() =>
                            navigate(
                                "/patient/profile"
                            )
                        }
                    >

                        <div className="patient-action-icon purple">

                            <Users
                                size={28}
                            />

                        </div>


                        <div className="patient-action-content">

                            <h2>
                                My Profile
                            </h2>

                            <p>
                                View and update your
                                personal information.
                            </p>

                            <span>

                                View Profile

                                <ArrowRight
                                    size={15}
                                />

                            </span>

                        </div>


                        <ArrowRight
                            size={20}
                        />

                    </div>

                </div>


                <div className="patient-upcoming-card">


                    <div className="patient-section-header">

                        <div>

                            <h2>
                                Upcoming Appointments
                            </h2>

                            <p>
                                Your next scheduled
                                appointments.
                            </p>

                        </div>


                        <button
                            className="patient-view-all-button"
                            onClick={() =>
                                navigate(
                                    "/patient/appointments"
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
                        loading
                            ?
                            (
                                <div className="patient-empty-state">

                                    <RefreshCw
                                        size={30}
                                        className="patient-spin"
                                    />

                                    <p>
                                        Loading appointments...
                                    </p>

                                </div>
                            )
                            :
                            appointments.length === 0
                                ?
                                (
                                    <div className="patient-empty-state">

                                        <CalendarDays
                                            size={42}
                                        />

                                        <h3>
                                            No Upcoming Appointments
                                        </h3>

                                        <p>
                                            You don't have any
                                            upcoming appointments.
                                        </p>

                                        <button
                                            className="patient-primary-button"
                                            onClick={() =>
                                                navigate(
                                                    "/patient/doctors"
                                                )
                                            }
                                        >
                                            Book an Appointment
                                        </button>

                                    </div>
                                )
                                :
                                (
                                    <div className="patient-appointment-list">

                                        {
                                            appointments.map(
                                                appointment =>
                                                (
                                                    <div
                                                        className="patient-appointment-item"
                                                        key={
                                                            appointment._id
                                                        }
                                                    >

                                                        <div className="patient-appointment-icon">

                                                            <CalendarDays
                                                                size={21}
                                                            />

                                                        </div>


                                                        <div className="patient-appointment-info">

                                                            <h3>
                                                                {
                                                                    appointment.doctorName
                                                                }
                                                            </h3>

                                                            <p>

                                                                {
                                                                    appointment.specialization
                                                                }

                                                                {
                                                                    appointment.department &&
                                                                    ` • ${appointment.department}`
                                                                }

                                                            </p>

                                                            <p>

                                                                {
                                                                    formatDate(
                                                                        appointment.appointmentDate
                                                                    )
                                                                }

                                                                {" • "}

                                                                {
                                                                    appointment.appointmentTime
                                                                }

                                                            </p>

                                                        </div>


                                                        <span
                                                            className={
                                                                `patient-status ${
                                                                    appointment.status
                                                                        .toLowerCase()
                                                                }`
                                                            }
                                                        >
                                                            {
                                                                formatStatus(
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

            </div>

        </div>
    );
};


export default PatientDashboard;