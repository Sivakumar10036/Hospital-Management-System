import React, { useEffect, useState } from "react";
import {
    getDoctorAppointments,
    updateAppointmentStatus,
    updateAppointmentNotes
} from "../../services/doctorService";

import "./DoctorPortal.css";


const DoctorAppointments = () => {

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [filter, setFilter] = useState("ALL");

    const [selectedAppointment, setSelectedAppointment] =
        useState(null);

    const [notes, setNotes] = useState("");

    const [updating, setUpdating] = useState(false);


    const loadAppointments = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getDoctorAppointments();

            console.log(
                "Doctor appointments:",
                response
            );

            setAppointments(
                response?.appointments || []
            );

        }
        catch (error) {

            console.error(
                "Appointments error:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Unable to load appointments."
            );

        }
        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadAppointments();

    }, []);


    const filteredAppointments =
        filter === "ALL"
            ? appointments
            : appointments.filter(
                appointment =>
                    appointment.status === filter
            );


    const total =
        appointments.length;

    const pending =
        appointments.filter(
            appointment =>
                appointment.status === "CONFIRMED"
        ).length;

    const completed =
        appointments.filter(
            appointment =>
                appointment.status === "COMPLETED"
        ).length;

    const noShow =
        appointments.filter(
            appointment =>
                appointment.status === "NO_SHOW"
        ).length;


    const getPatientName = (appointment) => {

        return (
            appointment?.patient?.user?.name ||
            appointment?.patient?.name ||
            "Unknown Patient"
        );

    };


    const getPatientId = (appointment) => {

        return (
            appointment?.patient?.patientId ||
            "N/A"
        );

    };


    const handleStatusUpdate =
        async (appointment, status) => {

        try {

            setUpdating(true);

            await updateAppointmentStatus(
                appointment._id,
                {
                    status,
                    notes:
                        appointment.notes || ""
                }
            );

            await loadAppointments();

            setSelectedAppointment(null);

        }
        catch (error) {

            console.error(
                "Status update error:",
                error
            );

            alert(
                error?.response?.data?.message ||
                "Unable to update appointment."
            );

        }
        finally {

            setUpdating(false);

        }

    };


    const openNotes =
        (appointment) => {

        setSelectedAppointment(
            appointment
        );

        setNotes(
            appointment.notes || ""
        );

    };


    const saveNotes =
        async () => {

        if (!selectedAppointment)
            return;

        try {

            setUpdating(true);

            await updateAppointmentNotes(
                selectedAppointment._id,
                notes
            );

            await loadAppointments();

            setSelectedAppointment(null);

        }
        catch (error) {

            console.error(
                "Notes update error:",
                error
            );

            alert(
                error?.response?.data?.message ||
                "Unable to save notes."
            );

        }
        finally {

            setUpdating(false);

        }

    };


    const formatDate =
        (date) => {

        if (!date)
            return "N/A";

        const value =
            new Date(date);

        if (Number.isNaN(value.getTime()))
            return date;

        return value.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    const getStatusClass =
        (status) => {

        switch (status) {

            case "COMPLETED":
                return "status-completed";

            case "CONFIRMED":
                return "status-confirmed";

            case "CANCELLED":
                return "status-cancelled";

            case "NO_SHOW":
                return "status-noshow";

            default:
                return "status-default";

        }

    };


    return (

        <div className="doctor-page">

            {/* HEADER */}

            <div className="doctor-page-header">

                <div>

                    <div className="eyebrow">
                        DOCTOR PORTAL
                    </div>

                    <h1>
                        My Appointments
                    </h1>

                    <p>
                        View your appointments and
                        update their treatment status.
                    </p>

                </div>


                <button
                    className="refresh-button"
                    onClick={loadAppointments}
                    disabled={loading}
                >
                    ↻ &nbsp; Refresh
                </button>

            </div>


            {/* ERROR */}

            {error && (

                <div className="doctor-error">

                    <span>!</span>

                    {error}

                </div>

            )}


            {/* STATISTICS */}

            <div className="appointment-stats">

                <div className="stat-card">

                    <div className="stat-icon blue">
                        ◫
                    </div>

                    <div>

                        <span>
                            Total Appointments
                        </span>

                        <strong>
                            {total}
                        </strong>

                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon orange">
                        ◷
                    </div>

                    <div>

                        <span>
                            Pending
                        </span>

                        <strong>
                            {pending}
                        </strong>

                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon green">
                        ✓
                    </div>

                    <div>

                        <span>
                            Completed
                        </span>

                        <strong>
                            {completed}
                        </strong>

                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon red">
                        ×
                    </div>

                    <div>

                        <span>
                            No Show
                        </span>

                        <strong>
                            {noShow}
                        </strong>

                    </div>

                </div>

            </div>


            {/* APPOINTMENTS SECTION */}

            <div className="portal-card">

                <div className="portal-card-header">

                    <div>

                        <h2>
                            Appointment List
                        </h2>

                        <p>
                            All appointments assigned
                            to you.
                        </p>

                    </div>


                    <select
                        className="appointment-filter"
                        value={filter}
                        onChange={(e) =>
                            setFilter(e.target.value)
                        }
                    >

                        <option value="ALL">
                            All Appointments
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


                {loading ? (

                    <div className="empty-state">

                        <div className="loading-spinner"></div>

                        <h3>
                            Loading appointments...
                        </h3>

                    </div>

                ) : filteredAppointments.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            ♡
                        </div>

                        <h3>
                            No appointments found
                        </h3>

                        <p>
                            You currently have no
                            appointments matching
                            this filter.
                        </p>

                    </div>

                ) : (

                    <div className="appointment-list">

                        {filteredAppointments.map(
                            (appointment) => (

                            <div
                                className="appointment-card"
                                key={appointment._id}
                            >

                                <div className="appointment-main">

                                    <div className="patient-avatar">
                                        {getPatientName(
                                            appointment
                                        )
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>


                                    <div className="patient-info">

                                        <h3>
                                            {getPatientName(
                                                appointment
                                            )}
                                        </h3>

                                        <p>
                                            Patient ID:
                                            {" "}
                                            {getPatientId(
                                                appointment
                                            )}
                                        </p>

                                    </div>

                                </div>


                                <div className="appointment-details">

                                    <div>

                                        <span>
                                            DATE
                                        </span>

                                        <strong>
                                            {formatDate(
                                                appointment.appointmentDate
                                            )}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            TIME
                                        </span>

                                        <strong>
                                            {appointment.appointmentTime ||
                                                "N/A"}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            REASON
                                        </span>

                                        <strong>
                                            {appointment.reason ||
                                                "General consultation"}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            STATUS
                                        </span>

                                        <span
                                            className={`status-badge ${getStatusClass(
                                                appointment.status
                                            )}`}
                                        >
                                            {appointment.status}
                                        </span>

                                    </div>

                                </div>


                                <div className="appointment-actions">

                                    <button
                                        className="secondary-button"
                                        onClick={() =>
                                            openNotes(
                                                appointment
                                            )
                                        }
                                    >
                                        Notes
                                    </button>


                                    {appointment.status ===
                                        "CONFIRMED" && (

                                        <>
                                            <button
                                                className="success-button"
                                                onClick={() =>
                                                    handleStatusUpdate(
                                                        appointment,
                                                        "COMPLETED"
                                                    )
                                                }
                                                disabled={
                                                    updating
                                                }
                                            >
                                                ✓ Complete
                                            </button>

                                            <button
                                                className="danger-button"
                                                onClick={() =>
                                                    handleStatusUpdate(
                                                        appointment,
                                                        "NO_SHOW"
                                                    )
                                                }
                                                disabled={
                                                    updating
                                                }
                                            >
                                                × No Show
                                            </button>
                                        </>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>


            {/* NOTES MODAL */}

            {selectedAppointment && (

                <div
                    className="modal-overlay"
                    onClick={() =>
                        setSelectedAppointment(null)
                    }
                >

                    <div
                        className="notes-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>

                                <span>
                                    PATIENT NOTES
                                </span>

                                <h2>
                                    {getPatientName(
                                        selectedAppointment
                                    )}
                                </h2>

                            </div>

                            <button
                                className="modal-close"
                                onClick={() =>
                                    setSelectedAppointment(null)
                                }
                            >
                                ×
                            </button>

                        </div>


                        <textarea
                            value={notes}
                            onChange={(e) =>
                                setNotes(e.target.value)
                            }
                            placeholder="Add treatment notes, diagnosis, observations..."
                            rows="7"
                        />


                        <div className="modal-actions">

                            <button
                                className="secondary-button"
                                onClick={() =>
                                    setSelectedAppointment(null)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className="primary-button"
                                onClick={saveNotes}
                                disabled={updating}
                            >
                                {updating
                                    ? "Saving..."
                                    : "Save Notes"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

};


export default DoctorAppointments;