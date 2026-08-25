import React, {
    useEffect,
    useState
}
from "react";
import "../../styles/PatientAppointments.css";
import
{
    CalendarDays,
    Clock,
    Stethoscope,
    XCircle,
    RefreshCw
}
from "lucide-react";

import api
from "../../api/axios";

const PatientAppointments =
() =>
{
    const [appointments, setAppointments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [cancellingId, setCancellingId] =
        useState("");

    const fetchAppointments =
    async () =>
    {
        try
        {
            setLoading(true);
            setError("");

            const response =
                await api.get(
                    "/appointments/my"
                );

            setAppointments(
                response.data.appointments || []
            );
        }
        catch (requestError)
        {
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
            fetchAppointments();
        },
        []
    );

    const cancelAppointment =
    async (appointmentId) =>
    {
        const confirmed =
            window.confirm(
                "Are you sure you want to cancel this appointment?"
            );

        if (!confirmed)
        {
            return;
        }

        try
        {
            setCancellingId(
                appointmentId
            );

            await api.patch(
                `/appointments/${appointmentId}/cancel`,
                {
                    cancellationReason:
                        "Cancelled by patient"
                }
            );

            await fetchAppointments();
        }
        catch (requestError)
        {
            alert(
                requestError.response?.data?.message ||
                "Unable to cancel appointment."
            );
        }
        finally
        {
            setCancellingId("");
        }
    };

    const formatDate =
    (date) =>
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
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    const getStatusClass =
    (status) =>
    {
        switch (status)
        {
            case "CONFIRMED":
                return "confirmed";

            case "BOOKED":
                return "booked";

            case "COMPLETED":
                return "completed";

            case "CANCELLED":
                return "cancelled";

            case "NO_SHOW":
                return "no-show";

            default:
                return "";
        }
    };

    return (
        <div className="patient-page">

            <div className="patient-page-header">

                <div>

                    <span className="patient-eyebrow">
                        MEDICARE
                    </span>

                    <h1>
                        My Appointments
                    </h1>

                    <p>
                        View and manage your
                        hospital appointments.
                    </p>

                </div>

                <button
                    className="patient-refresh-button"
                    onClick={fetchAppointments}
                    disabled={loading}
                >
                    <RefreshCw
                        size={18}
                    />

                    Refresh
                </button>

            </div>


            {
                error &&
                (
                    <div className="patient-error">
                        {error}
                    </div>
                )
            }


            {
                loading
                ?
                (
                    <div className="patient-loading">
                        <RefreshCw
                            size={24}
                            className="loading-icon"
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
                    <div className="patient-empty">

                        <CalendarDays
                            size={50}
                        />

                        <h2>
                            No appointments found
                        </h2>

                        <p>
                            You have not booked any
                            appointments yet.
                        </p>

                    </div>
                )
                :
                (
                    <div className="patient-appointments-list">

                        {
                            appointments.map(
                                appointment =>
                                (
                                    <div
                                        className="patient-appointment-card"
                                        key={
                                            appointment._id
                                        }
                                    >

                                        <div className="appointment-card-top">

                                            <div className="appointment-doctor">

                                                <div className="appointment-doctor-icon">
                                                    <Stethoscope
                                                        size={25}
                                                    />
                                                </div>

                                                <div>

                                                    <h2>
                                                        {
                                                            appointment.doctor?.name ||
                                                            "Doctor"
                                                        }
                                                    </h2>

                                                    <p>
                                                        {
                                                            appointment.doctor?.specialization ||
                                                            "Medical Specialist"
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                            <span
                                                className={
                                                    `appointment-status ${getStatusClass(
                                                        appointment.status
                                                    )}`
                                                }
                                            >
                                                {
                                                    appointment.status
                                                }
                                            </span>

                                        </div>


                                        <div className="appointment-card-details">

                                            <div className="appointment-detail">

                                                <CalendarDays
                                                    size={19}
                                                />

                                                <div>

                                                    <span>
                                                        Date
                                                    </span>

                                                    <strong>
                                                        {
                                                            formatDate(
                                                                appointment.appointmentDate
                                                            )
                                                        }
                                                    </strong>

                                                </div>

                                            </div>


                                            <div className="appointment-detail">

                                                <Clock
                                                    size={19}
                                                />

                                                <div>

                                                    <span>
                                                        Time
                                                    </span>

                                                    <strong>
                                                        {
                                                            appointment.startTime
                                                        }
                                                        {" - "}
                                                        {
                                                            appointment.endTime
                                                        }
                                                    </strong>

                                                </div>

                                            </div>


                                            <div className="appointment-detail">

                                                <span>
                                                    ₹
                                                </span>

                                                <div>

                                                    <span>
                                                        Consultation Fee
                                                    </span>

                                                    <strong>
                                                        ₹
                                                        {
                                                            appointment.consultationFee ||
                                                            0
                                                        }
                                                    </strong>

                                                </div>

                                            </div>

                                        </div>


                                        {
                                            appointment.reason &&
                                            (
                                                <div className="appointment-reason">

                                                    <strong>
                                                        Reason:
                                                    </strong>

                                                    {" "}

                                                    {
                                                        appointment.reason
                                                    }

                                                </div>
                                            )
                                        }


                                        {
                                            appointment.status !==
                                                "CANCELLED" &&
                                            appointment.status !==
                                                "COMPLETED" &&
                                            (
                                                <div className="appointment-card-actions">

                                                    <button
                                                        className="appointment-cancel-button"
                                                        onClick={() =>
                                                            cancelAppointment(
                                                                appointment._id
                                                            )
                                                        }
                                                        disabled={
                                                            cancellingId ===
                                                            appointment._id
                                                        }
                                                    >

                                                        <XCircle
                                                            size={18}
                                                        />

                                                        {
                                                            cancellingId ===
                                                            appointment._id
                                                            ?
                                                            "Cancelling..."
                                                            :
                                                            "Cancel Appointment"
                                                        }

                                                    </button>

                                                </div>
                                            )
                                        }

                                    </div>
                                )
                            )
                        }

                    </div>
                )
            }

        </div>
    );
};

export default PatientAppointments;