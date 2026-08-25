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
    Mail,
    Phone,
    Stethoscope,
    UserRound
}
from "lucide-react";

import api from "../../api/axios";

import "./PatientDoctorDetails.css";

const PatientDoctorDetails =
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
        loading,
        setLoading
    ] =
        useState(true);

    const [
        error,
        setError
    ] =
        useState("");

    const fetchDoctor =
    async () =>
    {
        try
        {
            setLoading(true);

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
                    "Unable to load doctor details."
                );
            }
        }
        catch (requestError)
        {
            console.error(
                "Doctor details error:",
                requestError
            );

            setError(
                requestError.response?.data?.message ||
                "Unable to load doctor details."
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
            fetchDoctor();
        },
        [id]
    );

    if (loading)
    {
        return (
            <div className="patient-doctor-details-page">

                <div className="doctor-details-loading">
                    Loading doctor details...
                </div>

            </div>
        );
    }

    if (error || !doctor)
    {
        return (
            <div className="patient-doctor-details-page">

                <button
                    className="doctor-back-button"
                    onClick={() =>
                        navigate(
                            "/patient/doctors"
                        )
                    }
                >
                    <ArrowLeft size={18} />
                    Back to Doctors
                </button>

                <div className="doctor-details-error">

                    <Stethoscope size={40} />

                    <h2>
                        Doctor Not Found
                    </h2>

                    <p>
                        {
                            error ||
                            "The requested doctor could not be found."
                        }
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="patient-doctor-details-page">

            <div className="patient-doctor-details-container">

                <button
                    className="doctor-back-button"
                    onClick={() =>
                        navigate(
                            "/patient/doctors"
                        )
                    }
                >

                    <ArrowLeft size={18} />

                    Back to Doctors

                </button>

                <div className="doctor-details-card">

                    <div className="doctor-details-top">

                        <div className="doctor-details-photo">

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
                                    <div className="doctor-details-placeholder">

                                        <UserRound
                                            size={60}
                                        />

                                    </div>
                                )
                            }

                        </div>

                        <div className="doctor-details-main">

                            <span className="patient-eyebrow">
                                MEDICARE
                            </span>

                            <h1>
                                Dr. {doctor.name}
                            </h1>

                            <span className="doctor-details-specialization">
                                {doctor.specialization}
                            </span>

                            <p className="doctor-details-department">
                                {doctor.department}
                            </p>

                            <div className="doctor-details-contact">

                                {
                                    doctor.email &&
                                    (
                                        <span>
                                            <Mail size={16} />
                                            {doctor.email}
                                        </span>
                                    )
                                }

                                {
                                    doctor.phone &&
                                    (
                                        <span>
                                            <Phone size={16} />
                                            {doctor.phone}
                                        </span>
                                    )
                                }

                            </div>

                        </div>

                    </div>

                    <div className="doctor-details-divider" />

                    <div className="doctor-information-grid">

                        <div className="doctor-information-item">

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

                        <div className="doctor-information-item">

                            <span>
                                Experience
                            </span>

                            <strong>
                                {
                                    doctor.experience || 0
                                }
                                {" "}
                                years
                            </strong>

                        </div>

                        <div className="doctor-information-item">

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

                        <div className="doctor-information-item">

                            <span>
                                Doctor ID
                            </span>

                            <strong>
                                {
                                    doctor.doctorId ||
                                    "—"
                                }
                            </strong>

                        </div>

                    </div>

                    <div className="doctor-details-section">

                        <h2>
                            About Doctor
                        </h2>

                        <p>
                            {
                                doctor.about ||
                                "No information about this doctor is available."
                            }
                        </p>

                    </div>

                    <div className="doctor-details-section">

                        <h2>
                            Availability
                        </h2>

                        <div className="doctor-availability">

                            <div className="availability-icon">

                                <CalendarDays
                                    size={21}
                                />

                            </div>

                            <div>

                                <span>
                                    Available Days
                                </span>

                                <p>

                                    {
                                        doctor.availableDays?.length
                                        ?
                                            doctor.availableDays.join(
                                                ", "
                                            )
                                        :
                                            "Not specified"
                                    }

                                </p>

                            </div>

                        </div>

                        <div className="doctor-availability">

                            <div className="availability-icon">

                                <Clock
                                    size={21}
                                />

                            </div>

                            <div>

                                <span>
                                    Consultation Time
                                </span>

                                <p>

                                    {
                                        doctor.startTime &&
                                        doctor.endTime
                                        ?
                                            `${doctor.startTime} - ${doctor.endTime}`
                                        :
                                            "Contact hospital for timings"
                                    }

                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="doctor-details-footer">

                        <button
                            className="book-appointment-button"
                            onClick={() =>
                                navigate(
                                    `/patient/doctors/${doctor._id}/book`
                                )
                            }
                        >

                            <CalendarDays
                                size={19}
                            />

                            Book Appointment

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default PatientDoctorDetails;