import React,
{
    useEffect,
    useState
}
from "react";

import
{
    useNavigate
}
from "react-router-dom";

import
{
    Search,
    RefreshCw,
    Eye,
    CalendarDays,
    Clock3,
    UserRound,
    Stethoscope
}
from "lucide-react";

import
{
    getAdminAppointments,
    updateAppointmentStatus
}
from "../../services/appointmentService";


const AdminAppointments =
() =>
{
    const navigate =
        useNavigate();


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
        error,
        setError
    ] =
        useState("");


    const [
        search,
        setSearch
    ] =
        useState("");


    const [
        statusFilter,
        setStatusFilter
    ] =
        useState("ALL");


    const [
        updatingId,
        setUpdatingId
    ] =
        useState(null);


    const loadAppointments =
    async () =>
    {
        try
        {
            setLoading(true);

            setError("");


            const data =
                await getAdminAppointments();


            setAppointments(
                data.appointments ||
                []
            );
        }
        catch (requestError)
        {
            console.error(
                "Appointments error:",
                requestError
            );

            setError(
                requestError.response?.data?.message ||
                "Unable to load appointments."
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
            loadAppointments();
        },
        []
    );


    const handleStatusChange =
    async (
        id,
        status
    ) =>
    {
        try
        {
            setUpdatingId(id);


            await updateAppointmentStatus(
                id,
                status
            );


            setAppointments(
                previousAppointments =>
                    previousAppointments.map(
                        appointment =>
                            appointment._id === id
                            ?
                            {
                                ...appointment,
                                status
                            }
                            :
                            appointment
                    )
            );
        }
        catch (requestError)
        {
            console.error(
                "Status update error:",
                requestError
            );

            alert(
                requestError.response?.data?.message ||
                "Unable to update appointment status."
            );
        }
        finally
        {
            setUpdatingId(null);
        }
    };


    const handleViewAppointment =
    (
        appointmentId
    ) =>
    {
        navigate(
            `/admin/appointments/${appointmentId}`
        );
    };


    const filteredAppointments =
        appointments.filter(
            appointment =>
            {
                const patientName =
                    appointment.patient?.name ||
                    "";

                const patientId =
                    appointment.patient?.patientId ||
                    "";

                const doctorName =
                    appointment.doctor?.name ||
                    "";

                const appointmentId =
                    appointment.appointmentId ||
                    "";

                const department =
                    appointment.department?.name ||
                    "";

                const searchValue =
                    search
                        .toLowerCase()
                        .trim();


                const matchesSearch =
                    patientName
                        .toLowerCase()
                        .includes(searchValue)
                    ||
                    patientId
                        .toLowerCase()
                        .includes(searchValue)
                    ||
                    doctorName
                        .toLowerCase()
                        .includes(searchValue)
                    ||
                    appointmentId
                        .toLowerCase()
                        .includes(searchValue)
                    ||
                    department
                        .toLowerCase()
                        .includes(searchValue);


                const matchesStatus =
                    statusFilter === "ALL"
                    ||
                    appointment.status ===
                        statusFilter;


                return (
                    matchesSearch &&
                    matchesStatus
                );
            }
        );


    const totalAppointments =
        appointments.length;


    const bookedAppointments =
        appointments.filter(
            appointment =>
                appointment.status ===
                "BOOKED"
        ).length;


    const confirmedAppointments =
        appointments.filter(
            appointment =>
                appointment.status ===
                "CONFIRMED"
        ).length;


    const completedAppointments =
        appointments.filter(
            appointment =>
                appointment.status ===
                "COMPLETED"
        ).length;


    const cancelledAppointments =
        appointments.filter(
            appointment =>
                appointment.status ===
                "CANCELLED"
        ).length;


    const formatDate =
    date =>
    {
        if (!date)
        {
            return "-";
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


    const getStatusClass =
    status =>
    {
        switch (status)
        {
            case "CONFIRMED":
                return "appointment-status confirmed";

            case "BOOKED":
                return "appointment-status booked";

            case "COMPLETED":
                return "appointment-status completed";

            case "CANCELLED":
                return "appointment-status cancelled";

            case "NO_SHOW":
                return "appointment-status no-show";

            default:
                return "appointment-status";
        }
    };


    return (
        <div className="dashboard-page">


            <div className="page-heading">

                <div>

                    <span className="page-eyebrow">
                        MEDICARE
                    </span>

                    <h1>
                        Appointments
                    </h1>

                    <p>
                        View and manage hospital appointments.
                    </p>

                </div>

            </div>


            <div className="appointment-stats">


                <div className="appointment-stat-card">

                    <div className="appointment-stat-icon">

                        <CalendarDays
                            size={22}
                        />

                    </div>

                    <div>

                        <span>
                            Total Appointments
                        </span>

                        <strong>
                            {
                                loading
                                ? "..."
                                : totalAppointments
                            }
                        </strong>

                    </div>

                </div>


                <div className="appointment-stat-card">

                    <div className="appointment-stat-icon">

                        <Clock3
                            size={22}
                        />

                    </div>

                    <div>

                        <span>
                            Booked
                        </span>

                        <strong>
                            {
                                loading
                                ? "..."
                                : bookedAppointments
                            }
                        </strong>

                    </div>

                </div>


                <div className="appointment-stat-card">

                    <div className="appointment-stat-icon">

                        <UserRound
                            size={22}
                        />

                    </div>

                    <div>

                        <span>
                            Confirmed
                        </span>

                        <strong>
                            {
                                loading
                                ? "..."
                                : confirmedAppointments
                            }
                        </strong>

                    </div>

                </div>


                <div className="appointment-stat-card">

                    <div className="appointment-stat-icon">

                        <Stethoscope
                            size={22}
                        />

                    </div>

                    <div>

                        <span>
                            Completed
                        </span>

                        <strong>
                            {
                                loading
                                ? "..."
                                : completedAppointments
                            }
                        </strong>

                    </div>

                </div>


                <div className="appointment-stat-card">

                    <div className="appointment-stat-icon">

                        <CalendarDays
                            size={22}
                        />

                    </div>

                    <div>

                        <span>
                            Cancelled
                        </span>

                        <strong>
                            {
                                loading
                                ? "..."
                                : cancelledAppointments
                            }
                        </strong>

                    </div>

                </div>

            </div>


            <div className="appointments-container">


                <div className="appointments-header">

                    <div>

                        <h2>
                            Registered Appointments
                        </h2>

                        <p>
                            Manage patient appointments and status.
                        </p>

                    </div>


                    <button
                        className="refresh-button"
                        onClick={
                            loadAppointments
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
                                "appointment-spin"
                                :
                                ""
                            }
                        />

                        Refresh

                    </button>

                </div>


                <div className="appointments-filters">


                    <div className="appointment-search">

                        <Search
                            size={19}
                        />

                        <input
                            type="text"
                            placeholder="Search by patient, doctor, department or appointment ID..."
                            value={search}
                            onChange={
                                event =>
                                    setSearch(
                                        event.target.value
                                    )
                            }
                        />

                    </div>


                    <select
                        value={
                            statusFilter
                        }
                        onChange={
                            event =>
                                setStatusFilter(
                                    event.target.value
                                )
                        }
                    >

                        <option value="ALL">
                            All Status
                        </option>

                        <option value="BOOKED">
                            Booked
                        </option>

                        <option value="CONFIRMED">
                            Confirmed
                        </option>

                        <option value="COMPLETED">
                            Completed
                        </option>

                        <option value="CANCELLED">
                            Cancelled
                        </option>

                        <option value="NO_SHOW">
                            No Show
                        </option>

                    </select>

                </div>


                {
                    error &&
                    (
                        <div className="appointment-error">

                            <span>
                                {error}
                            </span>

                            <button
                                onClick={
                                    loadAppointments
                                }
                            >
                                Retry
                            </button>

                        </div>
                    )
                }


                {
                    loading
                    ?
                    (
                        <div className="appointment-loading">

                            <RefreshCw
                                size={30}
                                className="appointment-spin"
                            />

                            <p>
                                Loading appointments...
                            </p>

                        </div>
                    )
                    :
                    filteredAppointments.length === 0
                    ?
                    (
                        <div className="appointment-empty">

                            <CalendarDays
                                size={42}
                            />

                            <h3>
                                No appointments found
                            </h3>

                            <p>
                                There are no appointments matching your search.
                            </p>

                        </div>
                    )
                    :
                    (
                        <div className="appointment-table-wrapper">

                            <table className="appointment-table">


                                <thead>

                                    <tr>

                                        <th>
                                            APPOINTMENT
                                        </th>

                                        <th>
                                            PATIENT
                                        </th>

                                        <th>
                                            DOCTOR
                                        </th>

                                        <th>
                                            DEPARTMENT
                                        </th>

                                        <th>
                                            DATE & TIME
                                        </th>

                                        <th>
                                            FEE
                                        </th>

                                        <th>
                                            STATUS
                                        </th>

                                        <th>
                                            ACTION
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {
                                        filteredAppointments.map(
                                            appointment =>
                                            (
                                                <tr
                                                    key={
                                                        appointment._id
                                                    }
                                                >

                                                    <td>

                                                        <div className="appointment-id">
                                                            {
                                                                appointment.appointmentId ||
                                                                "N/A"
                                                            }
                                                        </div>

                                                    </td>


                                                    <td>

                                                        <div className="appointment-person">

                                                            <div className="person-avatar">

                                                                {
                                                                    appointment.patient?.name
                                                                        ?.charAt(
                                                                            0
                                                                        )
                                                                        ?.toUpperCase()
                                                                    ||
                                                                    "P"
                                                                }

                                                            </div>

                                                            <div>

                                                                <strong>
                                                                    {
                                                                        appointment.patient?.name ||
                                                                        "Patient"
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    {
                                                                        appointment.patient?.patientId ||
                                                                        ""
                                                                    }
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <div className="doctor-info">

                                                            <strong>
                                                                Dr.{" "}
                                                                {
                                                                    appointment.doctor?.name ||
                                                                    "Doctor"
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    appointment.doctor?.specialization ||
                                                                    ""
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <span className="department-name">
                                                            {
                                                                appointment.department?.name ||
                                                                "General"
                                                            }
                                                        </span>

                                                    </td>


                                                    <td>

                                                        <div className="appointment-date">

                                                            <strong>
                                                                {
                                                                    formatDate(
                                                                        appointment.appointmentDate
                                                                    )
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    appointment.appointmentTime ||
                                                                    appointment.startTime ||
                                                                    "-"
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <strong>
                                                            ₹
                                                            {
                                                                appointment.consultationFee ||
                                                                0
                                                            }
                                                        </strong>

                                                    </td>


                                                    <td>

                                                        <select
                                                            className={
                                                                getStatusClass(
                                                                    appointment.status
                                                                )
                                                            }
                                                            value={
                                                                appointment.status
                                                            }
                                                            disabled={
                                                                updatingId ===
                                                                appointment._id
                                                            }
                                                            onChange={
                                                                event =>
                                                                    handleStatusChange(
                                                                        appointment._id,
                                                                        event.target.value
                                                                    )
                                                            }
                                                        >

                                                            <option value="BOOKED">
                                                                Booked
                                                            </option>

                                                            <option value="CONFIRMED">
                                                                Confirmed
                                                            </option>

                                                            <option value="COMPLETED">
                                                                Completed
                                                            </option>

                                                            <option value="CANCELLED">
                                                                Cancelled
                                                            </option>

                                                            <option value="NO_SHOW">
                                                                No Show
                                                            </option>

                                                        </select>

                                                    </td>


                                                    <td>

                                                        <button
                                                            className="view-appointment-button"
                                                            title="View appointment"
                                                            onClick={() =>
                                                                handleViewAppointment(
                                                                    appointment._id
                                                                )
                                                            }
                                                        >

                                                            <Eye
                                                                size={17}
                                                            />

                                                            View

                                                        </button>

                                                    </td>

                                                </tr>
                                            )
                                        )
                                    }

                                </tbody>

                            </table>

                        </div>
                    )
                }

            </div>

        </div>
    );
};


export default AdminAppointments;