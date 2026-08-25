    import React, {
    useEffect,
    useState
}
from "react";

import {
    useNavigate,
    useParams
}
from "react-router-dom";

import {
    ArrowLeft,
    CalendarDays,
    Clock,
    Stethoscope,
    CheckCircle2,
    AlertCircle
}
from "lucide-react";

import api
from "../../api/axios";

import "./BookAppointment.css";


const BookAppointment =
() =>
{
    const {
        id
    } =
        useParams();

    const navigate =
        useNavigate();

    const [
        doctor,
        setDoctor
    ] =
        useState(null);

    const [
        selectedDate,
        setSelectedDate
    ] =
        useState("");

    const [
        slots,
        setSlots
    ] =
        useState([]);

    const [
        selectedTime,
        setSelectedTime
    ] =
        useState("");

    const [
        reason,
        setReason
    ] =
        useState("");

    const [
        symptoms,
        setSymptoms
    ] =
        useState("");

    const [
        loadingDoctor,
        setLoadingDoctor
    ] =
        useState(true);

    const [
        loadingSlots,
        setLoadingSlots
    ] =
        useState(false);

    const [
        booking,
        setBooking
    ] =
        useState(false);

    const [
        error,
        setError
    ] =
        useState("");

    const [
        success,
        setSuccess
    ] =
        useState("");

    const [
        dayOfWeek,
        setDayOfWeek
    ] =
        useState("");


    const getToday =
    () =>
    {
        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const day =
            String(
                today.getDate()
            ).padStart(
                2,
                "0"
            );

        return (
            `${year}-${month}-${day}`
        );
    };


    const fetchDoctor =
    async () =>
    {
        try
        {
            setLoadingDoctor(true);

            setError("");

            const response =
                await api.get(
                    `/patients/doctors/${id}`
                );

            if (
                response.data?.success
            )
            {
                setDoctor(
                    response.data.doctor
                );
            }
            else
            {
                setError(
                    "Unable to load doctor."
                );
            }
        }
        catch (requestError)
        {
            console.error(
                "Doctor loading error:",
                requestError
            );

            setError(
                requestError.response?.data?.message ||
                "Unable to load doctor."
            );
        }
        finally
        {
            setLoadingDoctor(false);
        }
    };


    useEffect(
        () =>
        {
            fetchDoctor();
        },
        [id]
    );


    const fetchSlots =
    async (
        date
    ) =>
    {
        if (!date)
        {
            setSlots([]);

            setSelectedTime("");

            return;
        }

        try
        {
            setLoadingSlots(true);

            setError("");

            setSuccess("");

            setSlots([]);

            setSelectedTime("");

            const response =
                await api.get(
                    "/appointments/slots",
                {
                    params:
                    {
                        doctorId: id,
                        date
                    }
                });

            if (
                response.data?.success
            )
            {
                setSlots(
                    response.data.slots ||
                    []
                );

                setDayOfWeek(
                    response.data.dayOfWeek ||
                    ""
                );
            }
            else
            {
                setError(
                    response.data?.message ||
                    "Unable to load available slots."
                );
            }
        }
        catch (requestError)
        {
            console.error(
                "Slot loading error:",
                requestError
            );

            setError(
                requestError.response?.data?.message ||
                "Unable to load available slots."
            );
        }
        finally
        {
            setLoadingSlots(false);
        }
    };


    const handleDateChange =
    event =>
    {
        const date =
            event.target.value;

        setSelectedDate(date);

        fetchSlots(date);
    };


    const handleBooking =
    async event =>
    {
        event.preventDefault();

        setError("");

        setSuccess("");

        if (!selectedDate)
        {
            setError(
                "Please select an appointment date."
            );

            return;
        }

        if (!selectedTime)
        {
            setError(
                "Please select an available time slot."
            );

            return;
        }

        try
        {
            setBooking(true);

            const response =
                await api.post(
                    "/appointments/book",
                {
                    doctorId:
                        id,

                    appointmentDate:
                        selectedDate,

                    appointmentTime:
                        selectedTime,

                    reason:
                        reason.trim(),

                    symptoms:
                        symptoms.trim()
                });

            if (
                response.data?.success
            )
            {
                setSuccess(
                    "Appointment booked successfully."
                );

                setTimeout(
                    () =>
                    {
                        navigate(
                            "/patient/appointments"
                        );
                    },
                    1200
                );
            }
            else
            {
                setError(
                    response.data?.message ||
                    "Unable to book appointment."
                );
            }
        }
        catch (requestError)
        {
            console.error(
                "Booking error:",
                requestError
            );

            setError(
                requestError.response?.data?.message ||
                "Unable to book appointment."
            );
        }
        finally
        {
            setBooking(false);
        }
    };


    if (loadingDoctor)
    {
        return (
            <div className="book-appointment-page">

                <div className="book-loading">
                    Loading doctor details...
                </div>

            </div>
        );
    }


    if (!doctor)
    {
        return (
            <div className="book-appointment-page">

                <button
                    className="book-back-button"
                    onClick={() =>
                        navigate(
                            "/patient/doctors"
                        )
                    }
                >

                    <ArrowLeft size={18} />

                    Back to Doctors

                </button>

                <div className="book-error-state">

                    <AlertCircle size={40} />

                    <h2>
                        Doctor not found
                    </h2>

                    <p>
                        {
                            error ||
                            "Unable to load doctor details."
                        }
                    </p>

                </div>

            </div>
        );
    }


    return (
        <div className="book-appointment-page">

            <div className="book-appointment-container">

                <button
                    className="book-back-button"
                    onClick={() =>
                        navigate(
                            `/patient/doctors/${id}`
                        )
                    }
                >

                    <ArrowLeft size={18} />

                    Back to Doctor

                </button>


                <div className="book-page-header">

                    <span className="patient-eyebrow">
                        MEDICARE
                    </span>

                    <h1>
                        Book Appointment
                    </h1>

                    <p>
                        Select a date and available
                        time slot for your consultation.
                    </p>

                </div>


                {
                    error &&
                    (
                        <div className="book-message error">

                            <AlertCircle
                                size={18}
                            />

                            {error}

                        </div>
                    )
                }


                {
                    success &&
                    (
                        <div className="book-message success">

                            <CheckCircle2
                                size={18}
                            />

                            {success}

                        </div>
                    )
                }


                <div className="book-layout">


                    <div className="book-main-card">

                        <div className="book-card-header">

                            <div className="book-card-icon">

                                <CalendarDays
                                    size={22}
                                />

                            </div>

                            <div>

                                <h2>
                                    Appointment Details
                                </h2>

                                <p>
                                    Choose your preferred date and time.
                                </p>

                            </div>

                        </div>


                        <div className="book-card-body">


                            <div className="book-form-group">

                                <label>
                                    Appointment Date
                                </label>

                                <input
                                    type="date"
                                    min={
                                        getToday()
                                    }
                                    value={
                                        selectedDate
                                    }
                                    onChange={
                                        handleDateChange
                                    }
                                />

                                {
                                    dayOfWeek &&
                                    (
                                        <span className="book-help-text">
                                            {
                                                dayOfWeek
                                            }
                                        </span>
                                    )
                                }

                            </div>


                            <div className="book-slot-section">

                                <div className="book-slot-heading">

                                    <div>

                                        <label>
                                            Available Time Slots
                                        </label>

                                        {
                                            selectedDate &&
                                            (
                                                <span>
                                                    Select one available slot
                                                </span>
                                            )
                                        }

                                    </div>

                                    {
                                        loadingSlots &&
                                        (
                                            <span className="book-slot-loading">
                                                Loading...
                                            </span>
                                        )
                                    }

                                </div>


                                {
                                    !selectedDate
                                    ?
                                    (
                                        <div className="book-slot-empty">

                                            <CalendarDays
                                                size={30}
                                            />

                                            <p>
                                                Select a date to view
                                                available time slots.
                                            </p>

                                        </div>
                                    )
                                    :
                                    loadingSlots
                                    ?
                                    (
                                        <div className="book-slot-empty">

                                            <Clock
                                                size={30}
                                            />

                                            <p>
                                                Loading available slots...
                                            </p>

                                        </div>
                                    )
                                    :
                                    slots.length === 0
                                    ?
                                    (
                                        <div className="book-slot-empty">

                                            <Clock
                                                size={30}
                                            />

                                            <p>
                                                No available slots for this date.
                                            </p>

                                            <span>
                                                Please select another date.
                                            </span>

                                        </div>
                                    )
                                    :
                                    (
                                        <div className="book-slots">

                                            {
                                                slots.map(
                                                    slot =>
                                                    (
                                                        <button
                                                            type="button"
                                                            key={
                                                                slot.time
                                                            }
                                                            className={
                                                                slot.available
                                                                ?
                                                                    (
                                                                        selectedTime ===
                                                                        slot.time
                                                                        ?
                                                                            "book-slot selected"
                                                                        :
                                                                            "book-slot"
                                                                    )
                                                                :
                                                                    "book-slot booked"
                                                            }
                                                            disabled={
                                                                !slot.available
                                                            }
                                                            onClick={() =>
                                                            {
                                                                if (
                                                                    slot.available
                                                                )
                                                                {
                                                                    setSelectedTime(
                                                                        slot.time
                                                                    );
                                                                }
                                                            }}
                                                        >

                                                            <Clock
                                                                size={15}
                                                            />

                                                            {
                                                                slot.time
                                                            }

                                                            {
                                                                !slot.available &&
                                                                (
                                                                    <small>
                                                                        Booked
                                                                    </small>
                                                                )
                                                            }

                                                        </button>
                                                    )
                                                )
                                            }

                                        </div>
                                    )
                                }

                            </div>


                            <div className="book-form-group">

                                <label>
                                    Reason for Visit
                                </label>

                                <textarea
                                    rows="4"
                                    maxLength="500"
                                    placeholder="Briefly describe the reason for your appointment..."
                                    value={
                                        reason
                                    }
                                    onChange={
                                        event =>
                                            setReason(
                                                event.target.value
                                            )
                                    }
                                />

                                <span className="book-help-text">
                                    {
                                        reason.length
                                    }
                                    /500
                                </span>

                            </div>


                            <div className="book-form-group">

                                <label>
                                    Symptoms
                                </label>

                                <textarea
                                    rows="4"
                                    maxLength="500"
                                    placeholder="Describe any symptoms you are experiencing..."
                                    value={
                                        symptoms
                                    }
                                    onChange={
                                        event =>
                                            setSymptoms(
                                                event.target.value
                                            )
                                    }
                                />

                                <span className="book-help-text">
                                    Optional
                                </span>

                            </div>


                            <button
                                type="button"
                                className="book-confirm-button"
                                disabled={
                                    booking ||
                                    !selectedDate ||
                                    !selectedTime
                                }
                                onClick={
                                    handleBooking
                                }
                            >

                                {
                                    booking
                                    ?
                                        "Booking..."
                                    :
                                    (
                                        <>
                                            <CheckCircle2
                                                size={19}
                                            />

                                            Confirm Appointment
                                        </>
                                    )
                                }

                            </button>

                        </div>

                    </div>


                    <div className="book-doctor-card">

                        <div className="book-doctor-photo">

                            {
                                doctor.profilePhoto
                                ?
                                (
                                    <img
                                        src={
                                            doctor.profilePhoto.startsWith(
                                                "http"
                                            )
                                            ?
                                                doctor.profilePhoto
                                            :
                                                `http://localhost:5000${doctor.profilePhoto}`
                                        }
                                        alt={
                                            doctor.name
                                        }
                                    />
                                )
                                :
                                (
                                    <div className="book-doctor-placeholder">

                                        <Stethoscope
                                            size={45}
                                        />

                                    </div>
                                )
                            }

                        </div>


                        <div className="book-doctor-info">

                            <span>
                                DOCTOR
                            </span>

                            <h2>
                                Dr. {doctor.name}
                            </h2>

                            <p className="book-specialization">
                                {
                                    doctor.specialization
                                }
                            </p>

                            <p>
                                {
                                    doctor.department
                                }
                            </p>

                        </div>


                        <div className="book-doctor-details">

                            <div>

                                <span>
                                    Qualification
                                </span>

                                <strong>
                                    {
                                        doctor.qualification ||
                                        "Not specified"
                                    }
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Experience
                                </span>

                                <strong>
                                    {
                                        doctor.experience ||
                                        0
                                    }
                                    {" "}
                                    years
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Consultation Fee
                                </span>

                                <strong>
                                    ₹
                                    {
                                        doctor.consultationFee ||
                                        0
                                    }
                                </strong>

                            </div>

                        </div>


                        {
                            selectedDate &&
                            selectedTime &&
                            (
                                <div className="book-summary">

                                    <h3>
                                        Appointment Summary
                                    </h3>

                                    <div>

                                        <CalendarDays
                                            size={16}
                                        />

                                        <span>
                                            {selectedDate}
                                        </span>

                                    </div>

                                    <div>

                                        <Clock
                                            size={16}
                                        />

                                        <span>
                                            {selectedTime}
                                        </span>

                                    </div>

                                </div>
                            )
                        }

                    </div>

                </div>

            </div>

        </div>
    );
};

export default BookAppointment;