import React, {
    useEffect,
    useMemo,
    useState
}
from "react";
import
    "../../styles/SuperintendentPatients.css";
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
    MapPin
}
from "lucide-react";

import api
    from "../../api/axios";


const SuperintendentPatients =
() =>
{
    const [
        patients,
        setPatients
    ] =
        useState([]);

    const [
        loading,
        setLoading
    ] =
        useState(true);

    const [
        refreshing,
        setRefreshing
    ] =
        useState(false);

    const [
        error,
        setError
    ] =
        useState("");

    const [
        searchTerm,
        setSearchTerm
    ] =
        useState("");

    const [
        selectedPatient,
        setSelectedPatient
    ] =
        useState(null);


    const fetchPatients =
    async (
        showRefresh =
            false
    ) =>
    {
        try
        {
            if (showRefresh)
            {
                setRefreshing(true);
            }
            else
            {
                setLoading(true);
            }

            setError("");

            const response =
                await api.get(
                    "/superintendents/patients"
                );

            if (
                response.data?.success
            )
            {
                setPatients(
                    response.data.patients ||
                    []
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
                "Fetch superintendent patients error:",
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
            setRefreshing(false);
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
                    {
                        const name =
                            patient.user?.name ||
                            patient.name ||
                            "";

                        const email =
                            patient.user?.email ||
                            patient.email ||
                            "";

                        const phone =
                            patient.user?.phone ||
                            patient.phone ||
                            "";

                        const patientId =
                            patient.patientId ||
                            "";

                        return (
                            name
                                .toLowerCase()
                                .includes(search)
                            ||
                            email
                                .toLowerCase()
                                .includes(search)
                            ||
                            phone
                                .toLowerCase()
                                .includes(search)
                            ||
                            patientId
                                .toLowerCase()
                                .includes(search)
                        );
                    }
                );
            },
            [
                patients,
                searchTerm
            ]
        );


    const getPatientName =
        patient =>
        {
            return (
                patient.user?.name ||
                patient.name ||
                "Patient"
            );
        };


    const getPatientEmail =
        patient =>
        {
            return (
                patient.user?.email ||
                patient.email ||
                "Not provided"
            );
        };


    const getPatientPhone =
        patient =>
        {
            return (
                patient.user?.phone ||
                patient.phone ||
                "Not provided"
            );
        };


    const getPatientPhoto =
        patient =>
        {
            return (
                patient.profilePhoto ||
                patient.user?.profilePhoto ||
                ""
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
                .trim()
                .split(/\s+/)
                .map(
                    part =>
                        part[0]
                )
                .join("")
                .substring(
                    0,
                    2
                )
                .toUpperCase();
        };


    const formatDate =
        date =>
        {
            if (!date)
            {
                return "Not provided";
            }

            const parsedDate =
                new Date(date);

            if (
                Number.isNaN(
                    parsedDate.getTime()
                )
            )
            {
                return "Not provided";
            }

            return parsedDate.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );
        };


    return (
        <div className="superintendent-patients-page">

            <div className="superintendent-patients-container">

                <div className="superintendent-patients-header">

                    <div>

                        <span className="superintendent-patients-eyebrow">
                            HOSPITAL MANAGEMENT
                        </span>

                        <h1>
                            Patients
                        </h1>

                        <p>
                            View and monitor all registered patients in the hospital.
                        </p>

                    </div>


                    <button
                        className="superintendent-patients-refresh"
                        onClick={
                            () =>
                                fetchPatients(true)
                        }
                        disabled={
                            refreshing
                        }
                    >

                        <RefreshCw
                            size={16}
                            className={
                                refreshing
                                    ? "superintendent-patients-spin"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"
                        }

                    </button>

                </div>


                {
                    error &&
                    (
                        <div className="superintendent-patients-error">

                            <span>
                                {error}
                            </span>

                            <button
                                onClick={
                                    () =>
                                        fetchPatients()
                                }
                            >
                                Try Again
                            </button>

                        </div>
                    )
                }


                <div className="superintendent-patients-toolbar">

                    <div className="superintendent-patients-search">

                        <Search
                            size={18}
                        />

                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={
                                searchTerm
                            }
                            onChange={
                                event =>
                                    setSearchTerm(
                                        event.target.value
                                    )
                            }
                        />

                        {
                            searchTerm &&
                            (
                                <button
                                    className="superintendent-patients-clear-search"
                                    onClick={
                                        () =>
                                            setSearchTerm("")
                                    }
                                >
                                    <X
                                        size={16}
                                    />
                                </button>
                            )
                        }

                    </div>


                    <div className="superintendent-patients-count">

                        <Users
                            size={18}
                        />

                        <span>
                            {filteredPatients.length}
                        </span>

                        <span>
                            {filteredPatients.length === 1
                                ? "Patient"
                                : "Patients"
                            }
                        </span>

                    </div>

                </div>


                <div className="superintendent-patients-card">

                    {
                        loading &&
                        (
                            <div className="superintendent-patients-loading">

                                <RefreshCw
                                    size={30}
                                    className="superintendent-patients-spin"
                                />

                                <p>
                                    Loading patients...
                                </p>

                            </div>
                        )
                    }


                    {
                        !loading &&
                        !error &&
                        filteredPatients.length === 0 &&
                        (
                            <div className="superintendent-patients-empty">

                                <div className="superintendent-patients-empty-icon">

                                    <Users
                                        size={34}
                                    />

                                </div>

                                <h3>
                                    No Patients Found
                                </h3>

                                <p>
                                    {
                                        searchTerm
                                            ? "No patients match your search."
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
                            <div className="superintendent-patients-table-wrapper">

                                <table className="superintendent-patients-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                PATIENT
                                            </th>

                                            <th>
                                                PATIENT ID
                                            </th>

                                            <th>
                                                CONTACT
                                            </th>

                                            <th>
                                                GENDER
                                            </th>

                                            <th>
                                                DATE OF BIRTH
                                            </th>

                                            <th>
                                                BLOOD GROUP
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
                                            filteredPatients.map(
                                                patient =>
                                                {
                                                    const name =
                                                        getPatientName(
                                                            patient
                                                        );

                                                    const email =
                                                        getPatientEmail(
                                                            patient
                                                        );

                                                    const phone =
                                                        getPatientPhone(
                                                            patient
                                                        );

                                                    const photo =
                                                        getPatientPhoto(
                                                            patient
                                                        );

                                                    const isActive =
                                                        patient.user?.isActive ??
                                                        patient.isActive ??
                                                        true;

                                                    return (
                                                        <tr
                                                            key={
                                                                patient._id ||
                                                                patient.patientId
                                                            }
                                                        >

                                                            <td>

                                                                <div className="superintendent-patient-main">

                                                                    {
                                                                        photo
                                                                            ?
                                                                            (
                                                                                <img
                                                                                    src={
                                                                                        photo
                                                                                    }
                                                                                    alt={
                                                                                        name
                                                                                    }
                                                                                    className="superintendent-patient-avatar"
                                                                                />
                                                                            )
                                                                            :
                                                                            (
                                                                                <div className="superintendent-patient-avatar superintendent-patient-avatar-fallback">

                                                                                    {
                                                                                        getInitials(
                                                                                            name
                                                                                        )
                                                                                    }

                                                                                </div>
                                                                            )
                                                                    }


                                                                    <div className="superintendent-patient-name">

                                                                        <strong>
                                                                            {name}
                                                                        </strong>

                                                                        <span>
                                                                            {email}
                                                                        </span>

                                                                    </div>

                                                                </div>

                                                            </td>


                                                            <td>

                                                                <span className="superintendent-patient-id">
                                                                    {
                                                                        patient.patientId ||
                                                                        "N/A"
                                                                    }
                                                                </span>

                                                            </td>


                                                            <td>

                                                                <div className="superintendent-patient-contact">

                                                                    <span>

                                                                        <Mail
                                                                            size={14}
                                                                        />

                                                                        {
                                                                            email
                                                                        }

                                                                    </span>


                                                                    <span>

                                                                        <Phone
                                                                            size={14}
                                                                        />

                                                                        {
                                                                            phone
                                                                        }

                                                                    </span>

                                                                </div>

                                                            </td>


                                                            <td>

                                                                <span className="superintendent-patient-normal-text">

                                                                    {
                                                                        patient.gender ||
                                                                        "Not provided"
                                                                    }

                                                                </span>

                                                            </td>


                                                            <td>

                                                                <div className="superintendent-patient-date">

                                                                    <CalendarDays
                                                                        size={15}
                                                                    />

                                                                    {
                                                                        formatDate(
                                                                            patient.dateOfBirth
                                                                        )
                                                                    }

                                                                </div>

                                                            </td>


                                                            <td>

                                                                <div className="superintendent-patient-blood">

                                                                    <Droplets
                                                                        size={15}
                                                                    />

                                                                    {
                                                                        patient.bloodGroup ||
                                                                        "N/A"
                                                                    }

                                                                </div>

                                                            </td>


                                                            <td>

                                                                <span
                                                                    className={
                                                                        isActive
                                                                            ? "superintendent-patient-status active"
                                                                            : "superintendent-patient-status inactive"
                                                                    }
                                                                >

                                                                    {
                                                                        isActive
                                                                            ? "Active"
                                                                            : "Inactive"
                                                                    }

                                                                </span>

                                                            </td>


                                                            <td>

                                                                <button
                                                                    className="superintendent-patient-view-button"
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
                                                    );
                                                }
                                            )
                                        }

                                    </tbody>

                                </table>

                            </div>
                        )
                    }

                </div>

            </div>


            {
                selectedPatient &&
                (
                    <div
                        className="superintendent-patient-modal-overlay"
                        onClick={
                            () =>
                                setSelectedPatient(
                                    null
                                )
                        }
                    >

                        <div
                            className="superintendent-patient-modal"
                            onClick={
                                event =>
                                    event.stopPropagation()
                            }
                        >

                            <div className="superintendent-patient-modal-header">

                                <div>

                                    <span>
                                        PATIENT DETAILS
                                    </span>

                                    <h2>
                                        {
                                            getPatientName(
                                                selectedPatient
                                            )
                                        }
                                    </h2>

                                </div>


                                <button
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


                            <div className="superintendent-patient-modal-profile">

                                {
                                    getPatientPhoto(
                                        selectedPatient
                                    )
                                        ?
                                        (
                                            <img
                                                src={
                                                    getPatientPhoto(
                                                        selectedPatient
                                                    )
                                                }
                                                alt={
                                                    getPatientName(
                                                        selectedPatient
                                                    )
                                                }
                                                className="superintendent-patient-modal-avatar"
                                            />
                                        )
                                        :
                                        (
                                            <div className="superintendent-patient-modal-avatar superintendent-patient-avatar-fallback">

                                                {
                                                    getInitials(
                                                        getPatientName(
                                                            selectedPatient
                                                        )
                                                    )
                                                }

                                            </div>
                                        )
                                }


                                <div>

                                    <h3>
                                        {
                                            getPatientName(
                                                selectedPatient
                                            )
                                        }
                                    </h3>

                                    <p>
                                        {
                                            selectedPatient.patientId ||
                                            "Patient ID not available"
                                        }
                                    </p>

                                </div>

                            </div>


                            <div className="superintendent-patient-details-grid">

                                <div className="superintendent-patient-detail-item">

                                    <Mail
                                        size={17}
                                    />

                                    <div>

                                        <span>
                                            Email
                                        </span>

                                        <strong>
                                            {
                                                getPatientEmail(
                                                    selectedPatient
                                                )
                                            }
                                        </strong>

                                    </div>

                                </div>


                                <div className="superintendent-patient-detail-item">

                                    <Phone
                                        size={17}
                                    />

                                    <div>

                                        <span>
                                            Phone
                                        </span>

                                        <strong>
                                            {
                                                getPatientPhone(
                                                    selectedPatient
                                                )
                                            }
                                        </strong>

                                    </div>

                                </div>


                                <div className="superintendent-patient-detail-item">

                                    <CalendarDays
                                        size={17}
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


                                <div className="superintendent-patient-detail-item">

                                    <UserRound
                                        size={17}
                                    />

                                    <div>

                                        <span>
                                            Gender
                                        </span>

                                        <strong>
                                            {
                                                selectedPatient.gender ||
                                                "Not provided"
                                            }
                                        </strong>

                                    </div>

                                </div>


                                <div className="superintendent-patient-detail-item">

                                    <Droplets
                                        size={17}
                                    />

                                    <div>

                                        <span>
                                            Blood Group
                                        </span>

                                        <strong>
                                            {
                                                selectedPatient.bloodGroup ||
                                                "Not provided"
                                            }
                                        </strong>

                                    </div>

                                </div>


                                <div className="superintendent-patient-detail-item">

                                    <MapPin
                                        size={17}
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


                            <div className="superintendent-patient-modal-footer">

                                <button
                                    onClick={
                                        () =>
                                            setSelectedPatient(
                                                null
                                            )
                                    }
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>
                )
            }

        </div>
    );
};


export default SuperintendentPatients;