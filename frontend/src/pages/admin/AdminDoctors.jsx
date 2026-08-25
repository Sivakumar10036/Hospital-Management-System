import React,
{
    useEffect,
    useState
}
from "react";

import {
    Search,
    Plus,
    Eye,
    Pencil,
    Power,
    Stethoscope,
    RefreshCw
}
from "lucide-react";

import {
    useNavigate
}
from "react-router-dom";

import {
    getDoctors,
    updateDoctorStatus
}
from "../../services/adminService";

const AdminDoctors =
() =>
{
    const navigate =
        useNavigate();

    const [
        doctors,
        setDoctors
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        search,
        setSearch
    ] = useState("");

    const [
        error,
        setError
    ] = useState("");

    const loadDoctors =
    async () =>
    {
        try
        {
            setLoading(true);
            setError("");

            const result =
                await getDoctors();

            const doctorList =
                result?.doctors ||
                result?.data ||
                [];

            setDoctors(
                Array.isArray(
                    doctorList
                )
                    ? doctorList
                    : []
            );
        }
        catch (requestError)
        {
            setError(
                requestError
                    ?.response
                    ?.data
                    ?.message ||
                "Unable to load doctors."
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
            loadDoctors();
        },
        []
    );

    const filteredDoctors =
        doctors.filter(
            (doctor) =>
            {
                const searchText =
                    search.toLowerCase();

                return (
                    (
                        doctor.name ||
                        doctor.fullName ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            searchText
                        ) ||
                    (
                        doctor.specialization ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            searchText
                        ) ||
                    (
                        doctor.department?.name ||
                        doctor.department ||
                        ""
                    )
                        .toString()
                        .toLowerCase()
                        .includes(
                            searchText
                        )
                );
            }
        );

    const getDoctorName =
    (doctor) =>
    {
        return (
            doctor.name ||
            doctor.fullName ||
            "Doctor"
        );
    };

    const getDepartment =
    (doctor) =>
    {
        if (
            doctor.department &&
            typeof doctor.department ===
                "object"
        )
        {
            return (
                doctor.department.name ||
                "Department"
            );
        }

        return (
            doctor.department ||
            "Not assigned"
        );
    };

    const getPhoto =
    (doctor) =>
    {
        if (
            !doctor.profilePhoto
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

    const isDoctorActive =
    (doctor) =>
    {
        return (
            doctor.status === "ACTIVE" ||
            doctor.status === "active" ||
            doctor.isActive === true
        );
    };

    const handleStatus =
    async (
        doctor
    ) =>
    {
        const currentStatus =
            isDoctorActive(
                doctor
            );

        const newStatus =
            currentStatus
                ? "INACTIVE"
                : "ACTIVE";

        try
        {
            await updateDoctorStatus(
                doctor._id,
                newStatus
            );

            await loadDoctors();
        }
        catch (requestError)
        {
            alert(
                requestError
                    ?.response
                    ?.data
                    ?.message ||
                "Unable to update doctor status."
            );
        }
    };

    return (
        <div className="dashboard-page">

            <div className="page-heading">

                <div>

                    <span className="page-eyebrow">
                        ADMINISTRATION
                    </span>

                    <h1>
                        Doctors
                    </h1>

                    <p>
                        Manage doctors,
                        specializations,
                        schedules and
                        availability.
                    </p>

                </div>

                <button
                    className="primary-button"
                    onClick={() =>
                        navigate(
                            "/admin/doctors/add"
                        )
                    }
                >
                    <Plus size={19} />

                    Add Doctor
                </button>

            </div>

            <div className="doctor-toolbar">

                <div className="doctor-search">

                    <Search
                        size={19}
                    />

                    <input
                        type="text"
                        placeholder="Search by name, specialization or department..."
                        value={search}
                        onChange={
                            (event) =>
                                setSearch(
                                    event.target.value
                                )
                        }
                    />

                </div>

                <button
                    className="refresh-button"
                    onClick={
                        loadDoctors
                    }
                    disabled={
                        loading
                    }
                >

                    <RefreshCw
                        size={18}
                        className={
                            loading
                                ? "spin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </div>

            {error && (

                <div className="error-message">
                    {error}
                </div>

            )}

            <div className="doctor-count">

                <strong>
                    {filteredDoctors.length}
                </strong>

                <span>
                    doctors found
                </span>

            </div>

            {loading ? (

                <div className="loading-state">

                    <RefreshCw
                        size={30}
                        className="spin"
                    />

                    <p>
                        Loading doctors...
                    </p>

                </div>

            ) : filteredDoctors.length === 0 ? (

                <div className="empty-state">

                    <Stethoscope
                        size={45}
                    />

                    <h3>
                        No doctors found
                    </h3>

                    <p>
                        Try another search
                        or add a new doctor.
                    </p>

                </div>

            ) : (

                <div className="doctor-grid">

                    {filteredDoctors.map(
                        (doctor) =>
                        {
                            const name =
                                getDoctorName(
                                    doctor
                                );

                            const photo =
                                getPhoto(
                                    doctor
                                );

                            const active =
                                isDoctorActive(
                                    doctor
                                );

                            return (
                                <div
                                    className="doctor-card"
                                    key={
                                        doctor._id
                                    }
                                >

                                    <div className="doctor-card-top">

                                        <div className="doctor-photo">

                                            {photo ? (

                                                <img
                                                    src={
                                                        photo
                                                    }
                                                    alt={
                                                        name
                                                    }
                                                />

                                            ) : (

                                                <div className="doctor-photo-placeholder">

                                                    <Stethoscope
                                                        size={30}
                                                    />

                                                </div>

                                            )}

                                        </div>

                                        <span
                                            className={
                                                `status-badge ${
                                                    active
                                                        ? "active"
                                                        : "inactive"
                                                }`
                                            }
                                        >
                                            {active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>

                                    </div>

                                    <div className="doctor-card-content">

                                        <h3>
                                            {name}
                                        </h3>

                                        <p className="doctor-specialization">
                                            {
                                                doctor.specialization ||
                                                "Specialization not available"
                                            }
                                        </p>

                                        <div className="doctor-details">

                                            <div>

                                                <span>
                                                    Department
                                                </span>

                                                <strong>
                                                    {
                                                        getDepartment(
                                                            doctor
                                                        )
                                                    }
                                                </strong>

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

                                            <div>

                                                <span>
                                                    Consultation
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

                                    <div className="doctor-card-actions">

                                        <button
                                            className="doctor-action view"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/doctors/${doctor._id}`
                                                )
                                            }
                                        >

                                            <Eye
                                                size={17}
                                            />

                                            View

                                        </button>

                                        <button
                                            className="doctor-action edit"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/doctors/${doctor._id}/edit`
                                                )
                                            }
                                        >

                                            <Pencil
                                                size={17}
                                            />

                                            Edit

                                        </button>

                                        <button
                                            className={
                                                `doctor-action ${
                                                    active
                                                        ? "disable"
                                                        : "enable"
                                                }`
                                            }
                                            onClick={() =>
                                                handleStatus(
                                                    doctor
                                                )
                                            }
                                        >

                                            <Power
                                                size={17}
                                            />

                                            {
                                                active
                                                    ? "Disable"
                                                    : "Activate"
                                            }

                                        </button>

                                    </div>

                                </div>
                            );
                        }
                    )}

                </div>

            )}

        </div>
    );
};

export default AdminDoctors;