import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Search,
    RefreshCw,
    Users,
    UserRound,
    Mail,
    Phone,
    CalendarDays,
    Droplets,
    Eye,
    X,
    Activity,
    MapPin
} from "lucide-react";

import api from "../../api/axios";

const AdminPatients =
() =>
{
    const [patients, setPatients] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [searchTerm, setSearchTerm] =
        useState("");

    const [selectedPatient, setSelectedPatient] =
        useState(null);

    const fetchPatients =
    async () =>
    {
        try
        {
            setLoading(true);
            setError("");

            const response =
                await api.get(
                    "/patients/admin"
                );

            if (
                response.data?.success
            )
            {
                setPatients(
                    response.data.patients || []
                );
            }
            else
            {
                setError(
                    response.data?.message ||
                    "Unable to fetch patients"
                );
            }
        }
        catch (requestError)
        {
            console.error(
                "Fetch patients error:",
                requestError
            );

            setError(
                requestError.response?.data?.message ||
                "Unable to load patients"
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
            fetchPatients();
        },
        []
    );


    const filteredPatients =
        useMemo(
            () =>
            {
                const search =
                    searchTerm
                        .trim()
                        .toLowerCase();

                if (!search)
                {
                    return patients;
                }

                return patients.filter(
                    patient =>
                    (
                        patient.name ||
                        ""
                    )
                        .toLowerCase()
                        .includes(search)
                    ||
                    (
                        patient.patientId ||
                        ""
                    )
                        .toLowerCase()
                        .includes(search)
                    ||
                    (
                        patient.email ||
                        ""
                    )
                        .toLowerCase()
                        .includes(search)
                    ||
                    (
                        patient.phone ||
                        ""
                    )
                        .toLowerCase()
                        .includes(search)
                );
            },
            [
                patients,
                searchTerm
            ]
        );


    const formatDate =
    date =>
    {
        if (!date)
        {
            return "Not provided";
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


    const getInitials =
    name =>
    {
        if (!name)
        {
            return "P";
        }

        return name
            .split(" ")
            .map(
                part =>
                    part[0]
            )
            .join("")
            .substring(0, 2)
            .toUpperCase();
    };


    return (
        <div className="dashboard-page">

            <div className="page-heading">

                <div>

                    <span className="page-eyebrow">
                        MEDICARE
                    </span>

                    <h1>
                        Patients
                    </h1>

                    <p>
                        View and manage registered
                        patients in the hospital.
                    </p>

                </div>

            </div>


            <div className="stats-grid">

                <div className="stat-card">

                    <div className="stat-icon">
                        <Users size={22} />
                    </div>

                    <div>
                        <span>
                            Total Patients
                        </span>

                        <strong>
                            {patients.length}
                        </strong>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        <Activity size={22} />
                    </div>

                    <div>
                        <span>
                            Active Patients
                        </span>

                        <strong>
                            {
                                patients.filter(
                                    patient =>
                                        patient.isActive
                                ).length
                            }
                        </strong>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        <UserRound size={22} />
                    </div>

                    <div>
                        <span>
                            Male Patients
                        </span>

                        <strong>
                            {
                                patients.filter(
                                    patient =>
                                        patient.gender ===
                                        "Male"
                                ).length
                            }
                        </strong>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        <UserRound size={22} />
                    </div>

                    <div>
                        <span>
                            Female Patients
                        </span>

                        <strong>
                            {
                                patients.filter(
                                    patient =>
                                        patient.gender ===
                                        "Female"
                                ).length
                            }
                        </strong>
                    </div>

                </div>

            </div>


            <div className="content-card">

                <div className="content-card-header">

                    <div>

                        <h2>
                            Registered Patients
                        </h2>

                        <p>
                            Patient records registered
                            with MediCare.
                        </p>

                    </div>

                    <button
                        className="secondary-button"
                        onClick={fetchPatients}
                        disabled={loading}
                    >
                        <RefreshCw
                            size={17}
                            className={
                                loading
                                    ? "spin"
                                    : ""
                            }
                        />

                        Refresh
                    </button>

                </div>


                <div className="search-container">

                    <Search
                        size={19}
                    />

                    <input
                        type="text"
                        placeholder="Search by name, patient ID, email or phone..."
                        value={searchTerm}
                        onChange={
                            event =>
                                setSearchTerm(
                                    event.target.value
                                )
                        }
                    />

                </div>


                {
                    loading &&
                    (
                        <div className="loading-state">

                            <RefreshCw
                                size={28}
                                className="spin"
                            />

                            <p>
                                Loading patients...
                            </p>

                        </div>
                    )
                }


                {
                    !loading &&
                    error &&
                    (
                        <div className="error-state">

                            <p>
                                {error}
                            </p>

                            <button
                                className="primary-button"
                                onClick={
                                    fetchPatients
                                }
                            >
                                Try Again
                            </button>

                        </div>
                    )
                }


                {
                    !loading &&
                    !error &&
                    filteredPatients.length === 0 &&
                    (
                        <div className="empty-state">

                            <Users
                                size={42}
                            />

                            <h3>
                                No patients found
                            </h3>

                            <p>
                                {
                                    searchTerm
                                        ? "Try a different search term."
                                        : "No patients have registered yet."
                                }
                            </p>

                        </div>
                    )
                }


                {
                    !loading &&
                    !error &&
                    filteredPatients.length > 0 &&
                    (
                        <div className="patients-table-wrapper">

                            <table className="patients-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Patient
                                        </th>

                                        <th>
                                            Patient ID
                                        </th>

                                        <th>
                                            Contact
                                        </th>

                                        <th>
                                            Gender
                                        </th>

                                        <th>
                                            Blood Group
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {
                                        filteredPatients.map(
                                            patient =>
                                            (
                                                <tr
                                                    key={
                                                        patient._id
                                                    }
                                                >

                                                    <td>

                                                        <div className="patient-info">

                                                            {
                                                                patient.profilePhoto
                                                                    ? (
                                                                        <img
                                                                            src={
                                                                                patient.profilePhoto.startsWith(
                                                                                    "http"
                                                                                )
                                                                                    ? patient.profilePhoto
                                                                                    : `http://localhost:5000${patient.profilePhoto}`
                                                                            }
                                                                            alt={
                                                                                patient.name
                                                                            }
                                                                            className="patient-avatar"
                                                                        />
                                                                    )
                                                                    :
                                                                    (
                                                                        <div className="patient-avatar patient-avatar-placeholder">

                                                                            {
                                                                                getInitials(
                                                                                    patient.name
                                                                                )
                                                                            }

                                                                        </div>
                                                                    )
                                                            }


                                                            <div>

                                                                <strong>
                                                                    {
                                                                        patient.name
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    {
                                                                        patient.email
                                                                    }
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <span className="patient-id">

                                                            {
                                                                patient.patientId
                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <div className="contact-info">

                                                            <span>

                                                                <Phone
                                                                    size={14}
                                                                />

                                                                {
                                                                    patient.phone ||
                                                                    "Not provided"
                                                                }

                                                            </span>

                                                            <span>

                                                                <CalendarDays
                                                                    size={14}
                                                                />

                                                                {
                                                                    formatDate(
                                                                        patient.dateOfBirth
                                                                    )
                                                                }

                                                            </span>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        {
                                                            patient.gender ||
                                                            "Other"
                                                        }

                                                    </td>


                                                    <td>

                                                        <span className="blood-group">

                                                            <Droplets
                                                                size={14}
                                                            />

                                                            {
                                                                patient.bloodGroup ||
                                                                "Unknown"
                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={
                                                                patient.isActive
                                                                    ? "status-badge active"
                                                                    : "status-badge inactive"
                                                            }
                                                        >
                                                            {
                                                                patient.isActive
                                                                    ? "Active"
                                                                    : "Inactive"
                                                            }
                                                        </span>

                                                    </td>


                                                    <td>

                                                        <button
                                                            className="view-button"
                                                            onClick={
                                                                () =>
                                                                    setSelectedPatient(
                                                                        patient
                                                                    )
                                                            }
                                                        >

                                                            <Eye
                                                                size={16}
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


            {
                selectedPatient &&
                (
                    <div
                        className="modal-overlay"
                        onClick={
                            () =>
                                setSelectedPatient(
                                    null
                                )
                        }
                    >

                        <div
                            className="patient-modal"
                            onClick={
                                event =>
                                    event.stopPropagation()
                            }
                        >

                            <div className="modal-header">

                                <div>

                                    <span className="page-eyebrow">
                                        PATIENT PROFILE
                                    </span>

                                    <h2>
                                        Patient Details
                                    </h2>

                                </div>

                                <button
                                    className="modal-close"
                                    onClick={
                                        () =>
                                            setSelectedPatient(
                                                null
                                            )
                                    }
                                >
                                    <X
                                        size={20}
                                    />
                                </button>

                            </div>


                            <div className="patient-profile">

                                {
                                    selectedPatient.profilePhoto
                                        ? (
                                            <img
                                                src={
                                                    selectedPatient.profilePhoto.startsWith(
                                                        "http"
                                                    )
                                                        ? selectedPatient.profilePhoto
                                                        : `http://localhost:5000${selectedPatient.profilePhoto}`
                                                }
                                                alt={
                                                    selectedPatient.name
                                                }
                                                className="large-patient-avatar"
                                            />
                                        )
                                        :
                                        (
                                            <div className="large-patient-avatar patient-avatar-placeholder">

                                                {
                                                    getInitials(
                                                        selectedPatient.name
                                                    )
                                                }

                                            </div>
                                        )
                                }


                                <div>

                                    <h3>
                                        {
                                            selectedPatient.name
                                        }
                                    </h3>

                                    <p>
                                        {
                                            selectedPatient.patientId
                                        }
                                    </p>

                                    <span
                                        className={
                                            selectedPatient.isActive
                                                ? "status-badge active"
                                                : "status-badge inactive"
                                        }
                                    >
                                        {
                                            selectedPatient.isActive
                                                ? "Active"
                                                : "Inactive"
                                        }
                                    </span>

                                </div>

                            </div>


                            <div className="patient-details-grid">

                                <div className="detail-item">

                                    <Mail
                                        size={18}
                                    />

                                    <div>

                                        <span>
                                            Email
                                        </span>

                                        <strong>
                                            {
                                                selectedPatient.email ||
                                                "Not provided"
                                            }
                                        </strong>

                                    </div>

                                </div>


                                <div className="detail-item">

                                    <Phone
                                        size={18}
                                    />

                                    <div>

                                        <span>
                                            Phone
                                        </span>

                                        <strong>
                                            {
                                                selectedPatient.phone ||
                                                "Not provided"
                                            }
                                        </strong>

                                    </div>

                                </div>


                                <div className="detail-item">

                                    <CalendarDays
                                        size={18}
                                    />

                                    <div>

                                        <span>
                                            Date of Birth
                                        </span>

                                        <strong>
                                            {
                                                formatDate(
                                                    selectedPatient.dateOfBirth
                                                )
                                            }
                                        </strong>

                                    </div>

                                </div>


                                <div className="detail-item">

                                    <UserRound
                                        size={18}
                                    />

                                    <div>

                                        <span>
                                            Gender
                                        </span>

                                        <strong>
                                            {
                                                selectedPatient.gender ||
                                                "Other"
                                            }
                                        </strong>

                                    </div>

                                </div>


                                <div className="detail-item">

                                    <Droplets
                                        size={18}
                                    />

                                    <div>

                                        <span>
                                            Blood Group
                                        </span>

                                        <strong>
                                            {
                                                selectedPatient.bloodGroup ||
                                                "Unknown"
                                            }
                                        </strong>

                                    </div>

                                </div>


                                <div className="detail-item">

                                    <MapPin
                                        size={18}
                                    />

                                    <div>

                                        <span>
                                            Address
                                        </span>

                                        <strong>
                                            {
                                                selectedPatient.address ||
                                                "Not provided"
                                            }
                                        </strong>

                                    </div>

                                </div>

                            </div>


                            <div className="medical-history">

                                <h3>
                                    Medical History
                                </h3>

                                <p>
                                    {
                                        selectedPatient.medicalHistory ||
                                        "No medical history has been recorded."
                                    }
                                </p>

                            </div>


                            <div className="emergency-section">

                                <h3>
                                    Emergency Contact
                                </h3>

                                <div>

                                    <strong>
                                        {
                                            selectedPatient.emergencyContactName ||
                                            "Not provided"
                                        }
                                    </strong>

                                    <span>
                                        {
                                            selectedPatient.emergencyContactPhone ||
                                            "No phone number"
                                        }
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>
                )
            }

        </div>
    );
};

export default AdminPatients;