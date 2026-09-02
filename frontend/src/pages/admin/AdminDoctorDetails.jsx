import React,
{
    useEffect,
    useState
}
from "react";
import "./AdminDoctors.css";
import {
    ArrowLeft,
    Pencil,
    Stethoscope,
    Mail,
    Phone,
    Building2,
    GraduationCap,
    BriefcaseBusiness,
    IndianRupee,
    Clock3,
    CalendarDays,
    UserRound,
    LoaderCircle
}
from "lucide-react";

import {
    useNavigate,
    useParams
}
from "react-router-dom";

import {
    getDoctorById
}
from "../../services/adminService";

const AdminDoctorDetails =
() =>
{
    const navigate =
        useNavigate();

    const {
        id
    } = useParams();

    const [
        doctor,
        setDoctor
    ] = useState(null);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");

    useEffect(
        () =>
        {
            const loadDoctor =
            async () =>
            {
                try
                {
                    setLoading(true);
                    setError("");

                    const result =
                        await getDoctorById(
                            id
                        );

                    const doctorData =
                        result?.doctor ||
                        result?.data ||
                        result;

                    setDoctor(
                        doctorData
                    );
                }
                catch (requestError)
                {
                    setError(
                        requestError
                            ?.response
                            ?.data
                            ?.message ||
                        "Unable to load doctor details."
                    );
                }
                finally
                {
                    setLoading(false);
                }
            };

            loadDoctor();
        },
        [id]
    );

    const getName =
    () =>
    {
        return (
            doctor?.name ||
            doctor?.fullName ||
            "Doctor"
        );
    };

    const getDepartment =
    () =>
    {
        if (
            doctor?.department &&
            typeof doctor.department ===
                "object"
        )
        {
            return (
                doctor.department.name ||
                "Not assigned"
            );
        }

        return (
            doctor?.department ||
            "Not assigned"
        );
    };

    const getPhoto =
    () =>
    {
        if (
            !doctor?.profilePhoto
        )
        {
            return null;
        }

        if (
            doctor.profilePhoto.startsWith(
                "http"
            )
        )
        {
            return doctor.profilePhoto;
        }

        return `http://localhost:5000${doctor.profilePhoto}`;
    };

    const isActive =
        doctor?.status === "ACTIVE" ||
        doctor?.status === "active" ||
        doctor?.isActive === true;

    if (loading)
    {
        return (
            <div className="loading-state">

                <LoaderCircle
                    size={32}
                    className="spin"
                />

                <p>
                    Loading doctor details...
                </p>

            </div>
        );
    }

    if (error)
    {
        return (
            <div className="dashboard-page">

                <button
                    className="back-button"
                    onClick={() =>
                        navigate(
                            "/admin/doctors"
                        )
                    }
                >
                    <ArrowLeft
                        size={18}
                    />

                    Back to Doctors
                </button>

                <div className="form-alert error">
                    {error}
                </div>

            </div>
        );
    }

    if (!doctor)
    {
        return (
            <div className="dashboard-page">

                <div className="empty-state">

                    <Stethoscope
                        size={45}
                    />

                    <h3>
                        Doctor not found
                    </h3>

                    <p>
                        The requested doctor
                        does not exist.
                    </p>

                </div>

            </div>
        );
    }

    const photo =
        getPhoto();

    const name =
        getName();

    return (
        <div className="dashboard-page">

            <div className="page-heading">

                <div>

                    <span className="page-eyebrow">
                        DOCTOR MANAGEMENT
                    </span>

                    <h1>
                        Doctor Profile
                    </h1>

                    <p>
                        Complete professional
                        and availability details.
                    </p>

                </div>

                <button
                    className="back-button"
                    onClick={() =>
                        navigate(
                            "/admin/doctors"
                        )
                    }
                >
                    <ArrowLeft
                        size={18}
                    />

                    Back to Doctors
                </button>

            </div>

            <section className="doctor-profile-hero">

                <div className="doctor-profile-photo">

                    {photo ? (

                        <img
                            src={photo}
                            alt={name}
                        />

                    ) : (

                        <UserRound
                            size={48}
                        />

                    )}

                </div>

                <div className="doctor-profile-main">

                    <div className="doctor-profile-name-row">

                        <div>

                            <h2>
                                {name}
                            </h2>

                            <p>
                                {
                                    doctor.specialization ||
                                    "Specialization not available"
                                }
                            </p>

                        </div>

                        <span
                            className={
                                `status-badge ${
                                    isActive
                                        ? "active"
                                        : "inactive"
                                }`
                            }
                        >
                            {isActive
                                ? "Active"
                                : "Inactive"}
                        </span>

                    </div>

                    <div className="doctor-profile-meta">

                        <span>
                            <Building2
                                size={15}
                            />

                            {
                                getDepartment()
                            }
                        </span>

                        <span>
                            <BriefcaseBusiness
                                size={15}
                            />

                            {
                                doctor.experience ??
                                "—"
                            }

                            {
                                doctor.experience !==
                                undefined
                                    ? " years experience"
                                    : ""
                            }
                        </span>

                    </div>

                </div>

                <button
                    className="primary-button"
                    onClick={() =>
                        navigate(
                            `/admin/doctors/${id}/edit`
                        )
                    }
                >
                    <Pencil
                        size={18}
                    />

                    Edit Doctor
                </button>

            </section>

            <div className="profile-sections">

                <section className="dashboard-panel">

                    <div className="panel-header">

                        <div>

                            <h2>
                                Professional Information
                            </h2>

                            <p>
                                Medical qualifications
                                and consultation details.
                            </p>

                        </div>

                    </div>

                    <div className="profile-info-grid">

                        <div className="profile-info-item">

                            <div className="profile-info-icon">
                                <Stethoscope
                                    size={18}
                                />
                            </div>

                            <div>

                                <span>
                                    Specialization
                                </span>

                                <strong>
                                    {
                                        doctor.specialization ||
                                        "—"
                                    }
                                </strong>

                            </div>

                        </div>

                        <div className="profile-info-item">

                            <div className="profile-info-icon">
                                <Building2
                                    size={18}
                                />
                            </div>

                            <div>

                                <span>
                                    Department
                                </span>

                                <strong>
                                    {
                                        getDepartment()
                                    }
                                </strong>

                            </div>

                        </div>

                        <div className="profile-info-item">

                            <div className="profile-info-icon">
                                <GraduationCap
                                    size={18}
                                />
                            </div>

                            <div>

                                <span>
                                    Qualification
                                </span>

                                <strong>
                                    {
                                        doctor.qualification ||
                                        "—"
                                    }
                                </strong>

                            </div>

                        </div>

                        <div className="profile-info-item">

                            <div className="profile-info-icon">
                                <BriefcaseBusiness
                                    size={18}
                                />
                            </div>

                            <div>

                                <span>
                                    Experience
                                </span>

                                <strong>
                                    {
                                        doctor.experience ??
                                        "—"
                                    }

                                    {
                                        doctor.experience !==
                                        undefined
                                            ? " years"
                                            : ""
                                    }
                                </strong>

                            </div>

                        </div>

                        <div className="profile-info-item">

                            <div className="profile-info-icon">
                                <IndianRupee
                                    size={18}
                                />
                            </div>

                            <div>

                                <span>
                                    Consultation Fee
                                </span>

                                <strong>
                                    ₹
                                    {
                                        doctor.consultationFee ??
                                        "—"
                                    }
                                </strong>

                            </div>

                        </div>

                    </div>

                </section>

                <section className="dashboard-panel">

                    <div className="panel-header">

                        <div>

                            <h2>
                                Contact Information
                            </h2>

                            <p>
                                Doctor's registered
                                contact details.
                            </p>

                        </div>

                    </div>

                    <div className="profile-contact-list">

                        <div className="profile-contact-item">

                            <Mail
                                size={19}
                            />

                            <div>

                                <span>
                                    Email Address
                                </span>

                                <strong>
                                    {
                                        doctor.email ||
                                        "—"
                                    }
                                </strong>

                            </div>

                        </div>

                        <div className="profile-contact-item">

                            <Phone
                                size={19}
                            />

                            <div>

                                <span>
                                    Phone Number
                                </span>

                                <strong>
                                    {
                                        doctor.phone ||
                                        "—"
                                    }
                                </strong>

                            </div>

                        </div>

                    </div>

                </section>

                <section className="dashboard-panel">

                    <div className="panel-header">

                        <div>

                            <h2>
                                Availability
                            </h2>

                            <p>
                                Regular consultation
                                schedule.
                            </p>

                        </div>

                    </div>

                    <div className="availability-days">

                        {[
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday"
                        ].map(
                            day =>
                            {
                                const available =
                                    Array.isArray(
                                        doctor.availableDays
                                    ) &&
                                    doctor.availableDays.includes(
                                        day
                                    );

                                return (
                                    <div
                                        key={day}
                                        className={
                                            `availability-day ${
                                                available
                                                    ? "available"
                                                    : ""
                                            }`
                                        }
                                    >

                                        <CalendarDays
                                            size={17}
                                        />

                                        <span>
                                            {day}
                                        </span>

                                        <strong>
                                            {available
                                                ? "Available"
                                                : "Off"}
                                        </strong>

                                    </div>
                                );
                            }
                        )}

                    </div>

                    <div className="working-hours">

                        <Clock3
                            size={19}
                        />

                        <div>

                            <span>
                                Working Hours
                            </span>

                            <strong>
                                {
                                    doctor.startTime ||
                                    "—"
                                }

                                {" - "}

                                {
                                    doctor.endTime ||
                                    "—"
                                }
                            </strong>

                        </div>

                    </div>

                </section>

            </div>

        </div>
    );
};

export default AdminDoctorDetails;