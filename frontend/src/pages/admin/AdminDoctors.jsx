import React, { useEffect, useState } from "react";

import
{
    Search,
    Plus,
    Eye,
    Pencil,
    Power,
    Stethoscope,
    RefreshCw
}
from "lucide-react";

import { useNavigate } from "react-router-dom";

import
{
    getDoctors,
    updateDoctorStatus
}
from "../../services/adminService";


const AdminDoctors = () =>
{
    const navigate =
        useNavigate();

    const [doctors, setDoctors] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [error, setError] =
        useState("");


    const loadDoctors = async () =>
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
                Array.isArray(doctorList)
                    ? doctorList
                    : []
            );
        }
        catch (requestError)
        {
            console.error(
                "Load doctors error:",
                requestError
            );

            setError(
                requestError?.response?.data?.message ||
                "Unable to load doctors."
            );
        }
        finally
        {
            setLoading(false);
        }
    };


    useEffect(() =>
    {
        loadDoctors();
    }, []);


    const getDoctorName = (doctor) =>
    {
        return (
            doctor.name ||
            doctor.fullName ||
            doctor.user?.name ||
            "Doctor"
        );
    };


    const getDepartment = (doctor) =>
    {
        if (
            doctor.department &&
            typeof doctor.department === "object"
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


    const getSpecialization = (doctor) =>
    {
        return (
            doctor.specialization ||
            "General Physician"
        );
    };


    const getDoctorEmail = (doctor) =>
    {
        return (
            doctor.email ||
            doctor.user?.email ||
            "No email"
        );
    };


    const getDoctorPhone = (doctor) =>
    {
        return (
            doctor.phone ||
            doctor.user?.phone ||
            "No phone"
        );
    };


    const getPhoto = (doctor) =>
    {
        const profilePhoto =
            doctor.profilePhoto ||
            doctor.user?.profilePhoto;

        if (!profilePhoto)
        {
            return null;
        }

        if (
            profilePhoto.startsWith("http")
        )
        {
            return profilePhoto;
        }

        return `http://localhost:5000${profilePhoto}`;
    };


    const isDoctorActive = (doctor) =>
    {
        if (
            typeof doctor.isActive === "boolean"
        )
        {
            return doctor.isActive;
        }

        if (
            doctor.status === "ACTIVE" ||
            doctor.status === "active"
        )
        {
            return true;
        }

        if (
            doctor.status === "INACTIVE" ||
            doctor.status === "inactive"
        )
        {
            return false;
        }

        return false;
    };


    const filteredDoctors =
        doctors.filter(
            (doctor) =>
            {
                const searchText =
                    search
                        .toLowerCase()
                        .trim();

                const doctorName =
                    getDoctorName(
                        doctor
                    )
                    .toLowerCase();

                const specialization =
                    getSpecialization(
                        doctor
                    )
                    .toLowerCase();

                const department =
                    getDepartment(
                        doctor
                    )
                    .toString()
                    .toLowerCase();

                const email =
                    getDoctorEmail(
                        doctor
                    )
                    .toLowerCase();

                return (
                    doctorName.includes(
                        searchText
                    ) ||
                    specialization.includes(
                        searchText
                    ) ||
                    department.includes(
                        searchText
                    ) ||
                    email.includes(
                        searchText
                    )
                );
            }
        );


    const handleStatus = async (
        doctor
    ) =>
    {
        const currentStatus =
            isDoctorActive(
                doctor
            );

        const newStatus =
            !currentStatus;

        const doctorName =
            getDoctorName(
                doctor
            );

        const action =
            currentStatus
                ? "disable"
                : "activate";

        const confirmed =
            window.confirm(
                `Are you sure you want to ${action} ${doctorName}?`
            );

        if (!confirmed)
        {
            return;
        }

        try
        {
            setError("");

            await updateDoctorStatus(
                doctor._id,
                newStatus
            );

            await loadDoctors();
        }
        catch (requestError)
        {
            console.error(
                "Doctor status update error:",
                requestError
            );

            const message =
                requestError?.response?.data?.message ||
                "Unable to update doctor status.";

            setError(
                message
            );

            alert(
                message
            );
        }
    };


    const handleRefresh = () =>
    {
        loadDoctors();
    };


    const handleAddDoctor = () =>
    {
        navigate(
            "/admin/doctors/create"
        );
    };


    const handleViewDoctor = (
        doctorId
    ) =>
    {
        navigate(
            `/admin/doctors/${doctorId}`
        );
    };


    const handleEditDoctor = (
        doctorId
    ) =>
    {
        navigate(
            `/admin/doctors/${doctorId}/edit`
        );
    };


    return (
        <div className="admin-doctors-page">

            <div className="admin-doctors-header">

                <div className="admin-doctors-title">

                    <div className="admin-doctors-title-icon">
                        <Stethoscope
                            size={28}
                        />
                    </div>

                    <div>

                        <h1>
                            Doctors
                        </h1>

                        <p>
                            Manage hospital doctors
                        </p>

                    </div>

                </div>


                <div className="admin-doctors-actions">

                    <button
                        type="button"
                        className="admin-refresh-button"
                        onClick={
                            handleRefresh
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


                    <button
                        type="button"
                        className="admin-add-doctor-button"
                        onClick={
                            handleAddDoctor
                        }
                    >

                        <Plus
                            size={18}
                        />

                        Add Doctor

                    </button>

                </div>

            </div>


            {error && (
                <div className="admin-doctors-error">

                    {error}

                </div>
            )}


            <div className="admin-doctors-toolbar">

                <div className="admin-doctors-search">

                    <Search
                        size={20}
                    />

                    <input
                        type="text"
                        placeholder="Search doctors..."
                        value={
                            search
                        }
                        onChange={
                            (event) =>
                            {
                                setSearch(
                                    event.target.value
                                );
                            }
                        }
                    />

                </div>


                <div className="admin-doctors-count">

                    {filteredDoctors.length}

                    {" "}

                    Doctor
                    {filteredDoctors.length !== 1
                        ? "s"
                        : ""}

                </div>

            </div>


            {loading ? (

                <div className="admin-doctors-loading">

                    <RefreshCw
                        size={32}
                        className="spin"
                    />

                    <p>
                        Loading doctors...
                    </p>

                </div>

            ) : filteredDoctors.length === 0 ? (

                <div className="admin-doctors-empty">

                    <Stethoscope
                        size={48}
                    />

                    <h2>
                        No doctors found
                    </h2>

                    <p>

                        {search
                            ? "Try a different search."
                            : "No doctors have been added yet."}

                    </p>


                    {!search && (

                        <button
                            type="button"
                            onClick={
                                handleAddDoctor
                            }
                            className="admin-add-doctor-button"
                        >

                            <Plus
                                size={18}
                            />

                            Add Doctor

                        </button>

                    )}

                </div>

            ) : (

                <div className="admin-doctors-grid">

                    {filteredDoctors.map(
                        (doctor) =>
                        {
                            const active =
                                isDoctorActive(
                                    doctor
                                );

                            const photo =
                                getPhoto(
                                    doctor
                                );

                            return (

                                <div
                                    className={
                                        `admin-doctor-card ${
                                            active
                                                ? ""
                                                : "doctor-inactive"
                                        }`
                                    }
                                    key={
                                        doctor._id
                                    }
                                >

                                    <div className="admin-doctor-card-top">

                                        <div className="admin-doctor-photo-wrapper">

                                            {photo ? (

                                                <img
                                                    src={
                                                        photo
                                                    }
                                                    alt={
                                                        getDoctorName(
                                                            doctor
                                                        )
                                                    }
                                                    className="admin-doctor-photo"
                                                />

                                            ) : (

                                                <div className="admin-doctor-photo-placeholder">

                                                    <Stethoscope
                                                        size={30}
                                                    />

                                                </div>

                                            )}


                                            <span
                                                className={
                                                    `doctor-status-dot ${
                                                        active
                                                            ? "active"
                                                            : "inactive"
                                                    }`
                                                }
                                            />

                                        </div>


                                        <div className="admin-doctor-basic-info">

                                            <h3>

                                                {
                                                    getDoctorName(
                                                        doctor
                                                    )
                                                }

                                            </h3>


                                            <p>

                                                {
                                                    getSpecialization(
                                                        doctor
                                                    )
                                                }

                                            </p>

                                        </div>

                                    </div>


                                    <div className="admin-doctor-details">

                                        <div className="admin-doctor-detail-row">

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


                                        <div className="admin-doctor-detail-row">

                                            <span>
                                                Email
                                            </span>

                                            <strong>

                                                {
                                                    getDoctorEmail(
                                                        doctor
                                                    )
                                                }

                                            </strong>

                                        </div>


                                        <div className="admin-doctor-detail-row">

                                            <span>
                                                Phone
                                            </span>

                                            <strong>

                                                {
                                                    getDoctorPhone(
                                                        doctor
                                                    )
                                                }

                                            </strong>

                                        </div>


                                        <div className="admin-doctor-detail-row">

                                            <span>
                                                Status
                                            </span>


                                            <span
                                                className={
                                                    `admin-doctor-status ${
                                                        active
                                                            ? "active"
                                                            : "inactive"
                                                    }`
                                                }
                                            >

                                                {active
                                                    ? "ACTIVE"
                                                    : "INACTIVE"}

                                            </span>

                                        </div>

                                    </div>


                                    <div className="admin-doctor-card-actions">

                                        <button
                                            type="button"
                                            className="doctor-view-button"
                                            onClick={() =>
                                                handleViewDoctor(
                                                    doctor._id
                                                )
                                            }
                                        >

                                            <Eye
                                                size={17}
                                            />

                                            View

                                        </button>


                                        <button
                                            type="button"
                                            className="doctor-edit-button"
                                            onClick={() =>
                                                handleEditDoctor(
                                                    doctor._id
                                                )
                                            }
                                        >

                                            <Pencil
                                                size={17}
                                            />

                                            Edit

                                        </button>


                                        <button
                                            type="button"
                                            className={
                                                `doctor-status-button ${
                                                    active
                                                        ? "disable"
                                                        : "activate"
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

                                            {active
                                                ? "Disable"
                                                : "Activate"}

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