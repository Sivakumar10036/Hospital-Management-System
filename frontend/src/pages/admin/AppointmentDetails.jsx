import React, { useEffect, useState } from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    ArrowLeft,
    CalendarDays,
    Clock3,
    User,
    Stethoscope,
    IndianRupee,
    FileText,
    CheckCircle,
    XCircle
} from "lucide-react";

import api from "../../api/axios";

const AppointmentDetails =
() =>
{
    const { id } = useParams();

    const navigate = useNavigate();

    const [appointment, setAppointment] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(
        () =>
        {
            const fetchAppointment =
                async () =>
            {
                try
                {
                    setLoading(true);
                    setError("");

                    const response =
                        await api.get(
                            `/appointments/admin/${id}`
                        );

                    if (
                        response.data &&
                        response.data.success
                    )
                    {
                        setAppointment(
                            response.data.appointment
                        );
                    }
                    else
                    {
                        setError(
                            "Unable to load appointment"
                        );
                    }
                }
                catch (requestError)
                {
                    console.error(
                        "Appointment details error:",
                        requestError
                    );

                    setError(
                        requestError.response?.data?.message ||
                        "Unable to load appointment"
                    );
                }
                finally
                {
                    setLoading(false);
                }
            };

            if (id)
            {
                fetchAppointment();
            }
        },
        [id]
    );

    const getStatusClass =
        (status) =>
        {
            if (status === "CONFIRMED")
            {
                return "appointment-status confirmed";
            }

            if (status === "COMPLETED")
            {
                return "appointment-status completed";
            }

            if (status === "CANCELLED")
            {
                return "appointment-status cancelled";
            }

            if (status === "NO_SHOW")
            {
                return "appointment-status no-show";
            }

            return "appointment-status booked";
        };

    if (loading)
    {
        return (
            <div className="appointment-details-page">

                <div className="appointment-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading appointment details...
                    </p>

                </div>

            </div>
        );
    }

    if (error)
    {
        return (
            <div className="appointment-details-page">

                <div className="appointment-error">

                    <XCircle size={48} />

                    <h2>
                        Unable to load appointment
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/admin/appointments"
                            )
                        }
                    >
                        <ArrowLeft size={18} />
                        Back to Appointments
                    </button>

                </div>

            </div>
        );
    }

    if (!appointment)
    {
        return (
            <div className="appointment-details-page">

                <div className="appointment-error">

                    <XCircle size={48} />

                    <h2>
                        Appointment not found
                    </h2>

                    <button
                        onClick={() =>
                            navigate(
                                "/admin/appointments"
                            )
                        }
                    >
                        <ArrowLeft size={18} />
                        Back to Appointments
                    </button>

                </div>

            </div>
        );
    }

    const patient =
        appointment.patient || {};

    const doctor =
        appointment.doctor || {};

    const department =
        appointment.department || {};

    return (
        <div className="appointment-details-page">

            <div className="appointment-details-header">

                <button
                    className="back-button"
                    onClick={() =>
                        navigate(
                            "/admin/appointments"
                        )
                    }
                >
                    <ArrowLeft size={18} />
                    Back to Appointments
                </button>

                <div className="appointment-heading">

                    <div>

                        <span className="page-eyebrow">
                            MEDICARE
                        </span>

                        <h1>
                            Appointment Details
                        </h1>

                        <p>
                            View complete appointment information.
                        </p>

                    </div>

                    <span
                        className={
                            getStatusClass(
                                appointment.status
                            )
                        }
                    >
                        {appointment.status}
                    </span>

                </div>

            </div>

            <div className="appointment-id-card">

                <div>

                    <span>
                        Appointment ID
                    </span>

                    <strong>
                        {appointment.appointmentId ||
                            appointment._id}
                    </strong>

                </div>

                <div>

                    <span>
                        Created
                    </span>

                    <strong>
                        {appointment.createdAt
                            ? new Date(
                                appointment.createdAt
                            ).toLocaleDateString()
                            : "—"}
                    </strong>

                </div>

            </div>

            <div className="appointment-details-grid">

                <div className="details-card">

                    <div className="details-card-header">

                        <div className="details-icon">
                            <User size={21} />
                        </div>

                        <div>

                            <h2>
                                Patient Information
                            </h2>

                            <p>
                                Patient details
                            </p>

                        </div>

                    </div>

                    <div className="details-content">

                        <div className="detail-row">

                            <span>
                                Name
                            </span>

                            <strong>
                                {patient.name ||
                                    "Patient"}
                            </strong>

                        </div>

                        <div className="detail-row">

                            <span>
                                Patient ID
                            </span>

                            <strong>
                                {patient.patientId ||
                                    "—"}
                            </strong>

                        </div>

                        <div className="detail-row">

                            <span>
                                Email
                            </span>

                            <strong>
                                {patient.email ||
                                    "—"}
                            </strong>

                        </div>

                        <div className="detail-row">

                            <span>
                                Phone
                            </span>

                            <strong>
                                {patient.phone ||
                                    "—"}
                            </strong>

                        </div>

                    </div>

                </div>

                <div className="details-card">

                    <div className="details-card-header">

                        <div className="details-icon">
                            <Stethoscope size={21} />
                        </div>

                        <div>

                            <h2>
                                Doctor Information
                            </h2>

                            <p>
                                Assigned doctor
                            </p>

                        </div>

                    </div>

                    <div className="details-content">

                        <div className="detail-row">

                            <span>
                                Doctor
                            </span>

                            <strong>
                                {doctor.name ||
                                    "Doctor"}
                            </strong>

                        </div>

                        <div className="detail-row">

                            <span>
                                Specialization
                            </span>

                            <strong>
                                {doctor.specialization ||
                                    "—"}
                            </strong>

                        </div>

                        <div className="detail-row">

                            <span>
                                Department
                            </span>

                            <strong>
                                {department.name ||
                                    doctor.department ||
                                    "—"}
                            </strong>

                        </div>

                        <div className="detail-row">

                            <span>
                                Consultation Fee
                            </span>

                            <strong>
                                ₹
                                {appointment.consultationFee ||
                                    0}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>

            <div className="details-card appointment-information-card">

                <div className="details-card-header">

                    <div className="details-icon">
                        <CalendarDays size={21} />
                    </div>

                    <div>

                        <h2>
                            Appointment Information
                        </h2>

                        <p>
                            Date, time and consultation details
                        </p>

                    </div>

                </div>

                <div className="appointment-info-grid">

                    <div className="info-box">

                        <CalendarDays size={20} />

                        <div>

                            <span>
                                Date
                            </span>

                            <strong>
                                {appointment.appointmentDate
                                    ? new Date(
                                        appointment.appointmentDate
                                    ).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        }
                                    )
                                    : "—"}
                            </strong>

                        </div>

                    </div>

                    <div className="info-box">

                        <Clock3 size={20} />

                        <div>

                            <span>
                                Time
                            </span>

                            <strong>
                                {appointment.startTime ||
                                    "—"}

                                {" - "}

                                {appointment.endTime ||
                                    "—"}
                            </strong>

                        </div>

                    </div>

                    <div className="info-box">

                        <IndianRupee size={20} />

                        <div>

                            <span>
                                Consultation Fee
                            </span>

                            <strong>
                                ₹
                                {appointment.consultationFee ||
                                    0}
                            </strong>

                        </div>

                    </div>

                    <div className="info-box">

                        <CheckCircle size={20} />

                        <div>

                            <span>
                                Status
                            </span>

                            <strong>
                                {appointment.status ||
                                    "BOOKED"}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>

            <div className="details-card">

                <div className="details-card-header">

                    <div className="details-icon">
                        <FileText size={21} />
                    </div>

                    <div>

                        <h2>
                            Reason for Visit
                        </h2>

                        <p>
                            Patient consultation reason
                        </p>

                    </div>

                </div>

                <div className="reason-box">

                    {appointment.reason ||
                        "No reason provided."}

                </div>

            </div>

            {appointment.status ===
                "CANCELLED" &&
                (
                    <div className="details-card cancellation-card">

                        <div className="details-card-header">

                            <div className="details-icon">
                                <XCircle size={21} />
                            </div>

                            <div>

                                <h2>
                                    Cancellation Details
                                </h2>

                                <p>
                                    Information about the cancellation
                                </p>

                            </div>

                        </div>

                        <div className="reason-box">

                            {appointment.cancellationReason ||
                                "No cancellation reason provided."}

                        </div>

                    </div>
                )}

        </div>
    );
};

export default AppointmentDetails;