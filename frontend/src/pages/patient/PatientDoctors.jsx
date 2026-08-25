import React, {
    useEffect,
    useState
}
from "react";

import
{
    Search,
    RefreshCw,
    Stethoscope
}
from "lucide-react";

import
{
    useNavigate
}
from "react-router-dom";

import api
from "../../api/axios";

const PatientDoctors =
() =>
{
    const navigate =
        useNavigate();

    const [doctors, setDoctors] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const fetchDoctors =
    async () =>
    {
        try
        {
            setLoading(true);

            setError("");

            const response =
                await api.get(
                    "/patients/doctors"
                );

            setDoctors(
                response.data.doctors || []
            );
        }
        catch (requestError)
        {
            setError(
                requestError.response?.data?.message ||
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
            fetchDoctors();
        },
        []
    );

    const filteredDoctors =
        doctors.filter(
            doctor =>
            {
                const searchValue =
                    search.toLowerCase();

                return (
                    doctor.name
                        ?.toLowerCase()
                        .includes(searchValue)
                    ||
                    doctor.specialization
                        ?.toLowerCase()
                        .includes(searchValue)
                    ||
                    doctor.department
                        ?.toLowerCase()
                        .includes(searchValue)
                );
            }
        );

    return (
        <div className="patient-page">

            <div className="patient-page-header">

                <div>

                    <span className="patient-eyebrow">
                        MEDICARE
                    </span>

                    <h1>
                        Find a Doctor
                    </h1>

                    <p>
                        Browse our available doctors
                        and book an appointment.
                    </p>

                </div>

            </div>

            <div className="patient-search-box">

                <Search size={20} />

                <input
                    type="text"
                    placeholder="Search by doctor, specialization or department..."
                    value={search}
                    onChange={
                        event =>
                            setSearch(
                                event.target.value
                            )
                    }
                />

                <button
                    onClick={fetchDoctors}
                    disabled={loading}
                >
                    <RefreshCw size={18} />
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
                        Loading doctors...
                    </div>
                )
                :
                (
                    <div className="patient-doctor-grid">

                        {
                            filteredDoctors.map(
                                doctor =>
                                (
                                    <div
                                        className="patient-doctor-card"
                                        key={doctor._id}
                                    >

                                        <div className="patient-doctor-image">

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
                                                    <div className="doctor-placeholder">
                                                        <Stethoscope
                                                            size={42}
                                                        />
                                                    </div>
                                                )
                                            }

                                        </div>

                                        <div className="patient-doctor-content">

                                            <h2>
                                                {doctor.name}
                                            </h2>

                                            <span className="doctor-specialization">
                                                {doctor.specialization}
                                            </span>

                                            <div className="doctor-details">

                                                <p>
                                                    <strong>
                                                        Department:
                                                    </strong>

                                                    {doctor.department}
                                                </p>

                                                <p>
                                                    <strong>
                                                        Qualification:
                                                    </strong>

                                                    {doctor.qualification}
                                                </p>

                                                <p>
                                                    <strong>
                                                        Experience:
                                                    </strong>

                                                    {doctor.experience}
                                                    {" "}
                                                    years
                                                </p>

                                                <p>
                                                    <strong>
                                                        Consultation:
                                                    </strong>

                                                    ₹
                                                    {doctor.consultationFee}
                                                </p>

                                            </div>

                                            <button
                                                className="doctor-view-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/patient/doctors/${doctor._id}`
                                                    )
                                                }
                                            >
                                                View Doctor
                                            </button>

                                        </div>

                                    </div>
                                )
                            )
                        }

                    </div>
                )
            }

            {
                !loading &&
                filteredDoctors.length === 0 &&
                (
                    <div className="patient-empty">

                        <Stethoscope
                            size={45}
                        />

                        <h2>
                            No doctors found
                        </h2>

                        <p>
                            Try another search.
                        </p>

                    </div>
                )
            }

        </div>
    );
};

export default PatientDoctors;