import React,
{
    useEffect,
    useState
}
from "react";

import {
    ArrowLeft,
    Save,
    Camera,
    LoaderCircle,
    Clock3
}
from "lucide-react";

import {
    useNavigate,
    useParams
}
from "react-router-dom";

import {
    getDoctorById,
    getDepartments,
    updateDoctor
}
from "../../services/adminService";

const daysOfWeek =
[
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

const AdminDoctorEdit =
() =>
{
    const navigate =
        useNavigate();

    const {
        id
    } = useParams();

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        submitting,
        setSubmitting
    ] = useState(false);

    const [
        departments,
        setDepartments
    ] = useState([]);

    const [
        error,
        setError
    ] = useState("");

    const [
        success,
        setSuccess
    ] = useState("");

    const [
        profilePhoto,
        setProfilePhoto
    ] = useState(null);

    const [
        photoPreview,
        setPhotoPreview
    ] = useState("");

    const [
        formData,
        setFormData
    ] = useState(
        {
            name: "",
            email: "",
            phone: "",
            specialization: "",
            department: "",
            qualification: "",
            experience: "",
            consultationFee: "",
            availableDays: [],
            startTime: "",
            endTime: ""
        }
    );

    useEffect(
        () =>
        {
            const loadData =
            async () =>
            {
                try
                {
                    setLoading(true);

                    const [
                        doctorResult,
                        departmentResult
                    ] = await Promise.all(
                        [
                            getDoctorById(id),
                            getDepartments()
                        ]
                    );

                    const doctor =
                        doctorResult?.doctor ||
                        doctorResult?.data ||
                        doctorResult;

                    const departmentList =
                        departmentResult?.departments ||
                        departmentResult?.data ||
                        [];

                    setDepartments(
                        Array.isArray(
                            departmentList
                        )
                            ? departmentList
                            : []
                    );

                    setFormData(
                        {
                            name:
                                doctor.name ||
                                doctor.fullName ||
                                "",
                            email:
                                doctor.email ||
                                "",
                            phone:
                                doctor.phone ||
                                "",
                            specialization:
                                doctor.specialization ||
                                "",
                            department:
                                typeof doctor.department ===
                                "object"
                                    ? doctor.department?._id ||
                                      ""
                                    : doctor.department ||
                                      "",
                            qualification:
                                doctor.qualification ||
                                "",
                            experience:
                                doctor.experience ??
                                "",
                            consultationFee:
                                doctor.consultationFee ??
                                "",
                            availableDays:
                                Array.isArray(
                                    doctor.availableDays
                                )
                                    ? doctor.availableDays
                                    : [],
                            startTime:
                                doctor.startTime ||
                                "",
                            endTime:
                                doctor.endTime ||
                                ""
                        }
                    );

                    if (
                        doctor.profilePhoto
                    )
                    {
                        setPhotoPreview(
                            doctor.profilePhoto.startsWith(
                                "http"
                            )
                                ? doctor.profilePhoto
                                : `http://localhost:5000${doctor.profilePhoto}`
                        );
                    }
                }
                catch (requestError)
                {
                    setError(
                        requestError
                            ?.response
                            ?.data
                            ?.message ||
                        "Unable to load doctor."
                    );
                }
                finally
                {
                    setLoading(false);
                }
            };

            loadData();
        },
        [id]
    );

    const handleChange =
    (event) =>
    {
        const {
            name,
            value
        } = event.target;

        setFormData(
            previous =>
            ({
                ...previous,
                [name]: value
            })
        );

        setError("");
        setSuccess("");
    };

    const handleDayChange =
    (day) =>
    {
        setFormData(
            previous =>
            {
                const selected =
                    previous.availableDays;

                if (
                    selected.includes(
                        day
                    )
                )
                {
                    return {
                        ...previous,
                        availableDays:
                            selected.filter(
                                item =>
                                    item !== day
                            )
                    };
                }

                return {
                    ...previous,
                    availableDays:
                        [
                            ...selected,
                            day
                        ]
                };
            }
        );
    };

    const handlePhotoChange =
    (event) =>
    {
        const file =
            event.target.files?.[0];

        if (!file)
        {
            return;
        }

        if (
            !file.type.startsWith(
                "image/"
            )
        )
        {
            setError(
                "Please select a valid image."
            );

            return;
        }

        if (
            file.size >
            5 * 1024 * 1024
        )
        {
            setError(
                "Profile photo must be less than 5 MB."
            );

            return;
        }

        setProfilePhoto(file);

        setPhotoPreview(
            URL.createObjectURL(
                file
            )
        );

        setError("");
    };

    const handleSubmit =
    async (event) =>
    {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.name.trim()
        )
        {
            setError(
                "Doctor name is required."
            );

            return;
        }

        if (
            !formData.email.trim()
        )
        {
            setError(
                "Email is required."
            );

            return;
        }

        if (
            !formData.specialization.trim()
        )
        {
            setError(
                "Specialization is required."
            );

            return;
        }

        if (
            !formData.department
        )
        {
            setError(
                "Department is required."
            );

            return;
        }

        if (
            formData.availableDays.length ===
            0
        )
        {
            setError(
                "Select at least one available day."
            );

            return;
        }

        if (
            formData.startTime >=
            formData.endTime
        )
        {
            setError(
                "End time must be later than start time."
            );

            return;
        }

        try
        {
            setSubmitting(true);

            const data =
                new FormData();

            data.append(
                "name",
                formData.name.trim()
            );

            data.append(
                "email",
                formData.email.trim()
            );

            data.append(
                "phone",
                formData.phone.trim()
            );

            data.append(
                "specialization",
                formData.specialization.trim()
            );

            data.append(
                "department",
                formData.department
            );

            data.append(
                "qualification",
                formData.qualification.trim()
            );

            data.append(
                "experience",
                formData.experience
            );

            data.append(
                "consultationFee",
                formData.consultationFee
            );

            data.append(
                "availableDays",
                JSON.stringify(
                    formData.availableDays
                )
            );

            data.append(
                "startTime",
                formData.startTime
            );

            data.append(
                "endTime",
                formData.endTime
            );

            if (profilePhoto)
            {
                data.append(
                    "profilePhoto",
                    profilePhoto
                );
            }

            await updateDoctor(
                id,
                data
            );

            setSuccess(
                "Doctor updated successfully."
            );

            setTimeout(
                () =>
                {
                    navigate(
                        `/admin/doctors/${id}`
                    );
                },
                1000
            );
        }
        catch (requestError)
        {
            setError(
                requestError
                    ?.response
                    ?.data
                    ?.message ||
                "Unable to update doctor."
            );
        }
        finally
        {
            setSubmitting(false);
        }
    };

    if (loading)
    {
        return (
            <div className="loading-state">

                <LoaderCircle
                    size={32}
                    className="spin"
                />

                <p>
                    Loading doctor...
                </p>

            </div>
        );
    }

    return (
        <div className="dashboard-page">

            <div className="page-heading">

                <div>

                    <span className="page-eyebrow">
                        DOCTOR MANAGEMENT
                    </span>

                    <h1>
                        Edit Doctor
                    </h1>

                    <p>
                        Update the doctor's
                        professional information
                        and availability.
                    </p>

                </div>

                <button
                    className="back-button"
                    onClick={() =>
                        navigate(
                            `/admin/doctors/${id}`
                        )
                    }
                >
                    <ArrowLeft
                        size={18}
                    />

                    Back to Profile
                </button>

            </div>

            {error && (
                <div className="form-alert error">
                    {error}
                </div>
            )}

            {success && (
                <div className="form-alert success">
                    {success}
                </div>
            )}

            <form
                className="doctor-form"
                onSubmit={
                    handleSubmit
                }
            >

                <section className="form-section">

                    <div className="form-section-heading">

                        <div className="form-section-icon">
                            <Camera
                                size={19}
                            />
                        </div>

                        <div>

                            <h2>
                                Doctor Information
                            </h2>

                            <p>
                                Update profile and
                                contact information.
                            </p>

                        </div>

                    </div>

                    <div className="photo-upload-area">

                        <div className="large-profile-photo">

                            {photoPreview ? (

                                <img
                                    src={
                                        photoPreview
                                    }
                                    alt="Doctor"
                                />

                            ) : null}

                        </div>

                        <div>

                            <label
                                htmlFor="doctorPhoto"
                                className="photo-upload-button"
                            >
                                <Camera
                                    size={17}
                                />

                                Change Photo
                            </label>

                            <input
                                id="doctorPhoto"
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={
                                    handlePhotoChange
                                }
                            />

                            <p className="photo-help">
                                JPG, PNG or WEBP.
                                Maximum 5 MB.
                            </p>

                        </div>

                    </div>

                    <div className="form-grid">

                        <div className="form-field">

                            <label>
                                Full Name *
                            </label>

                            <div className="input-with-icon">

                                <input
                                    name="name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                        </div>

                        <div className="form-field">

                            <label>
                                Email *
                            </label>

                            <div className="input-with-icon">

                                <input
                                    type="email"
                                    name="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                        </div>

                        <div className="form-field">

                            <label>
                                Phone
                            </label>

                            <div className="input-with-icon">

                                <input
                                    name="phone"
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                        </div>

                        <div className="form-field">

                            <label>
                                Specialization *
                            </label>

                            <div className="input-with-icon">

                                <input
                                    name="specialization"
                                    value={
                                        formData.specialization
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                        </div>

                        <div className="form-field">

                            <label>
                                Department *
                            </label>

                            <div className="input-with-icon">

                                <select
                                    name="department"
                                    value={
                                        formData.department
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="">
                                        Select department
                                    </option>

                                    {departments.map(
                                        department =>
                                        {
                                            const departmentId =
                                                department._id ||
                                                department.id;

                                            return (
                                                <option
                                                    key={
                                                        departmentId
                                                    }
                                                    value={
                                                        departmentId
                                                    }
                                                >
                                                    {
                                                        department.name ||
                                                        department.departmentName
                                                    }
                                                </option>
                                            );
                                        }
                                    )}

                                </select>

                            </div>

                        </div>

                        <div className="form-field">

                            <label>
                                Qualification
                            </label>

                            <div className="input-with-icon">

                                <input
                                    name="qualification"
                                    value={
                                        formData.qualification
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                        </div>

                        <div className="form-field">

                            <label>
                                Experience
                            </label>

                            <div className="input-with-icon">

                                <input
                                    type="number"
                                    min="0"
                                    name="experience"
                                    value={
                                        formData.experience
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                                <span className="input-suffix">
                                    years
                                </span>

                            </div>

                        </div>

                        <div className="form-field">

                            <label>
                                Consultation Fee
                            </label>

                            <div className="input-with-icon">

                                <input
                                    type="number"
                                    min="0"
                                    name="consultationFee"
                                    value={
                                        formData.consultationFee
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                        </div>

                    </div>

                </section>

                <section className="form-section">

                    <div className="form-section-heading">

                        <div className="form-section-icon">
                            <Clock3
                                size={19}
                            />
                        </div>

                        <div>

                            <h2>
                                Availability
                            </h2>

                            <p>
                                Update consultation
                                days and hours.
                            </p>

                        </div>

                    </div>

                    <div className="form-field">

                        <label>
                            Available Days
                        </label>

                        <div className="days-grid">

                            {daysOfWeek.map(
                                day =>
                                {
                                    const selected =
                                        formData.availableDays.includes(
                                            day
                                        );

                                    return (
                                        <button
                                            type="button"
                                            key={day}
                                            className={
                                                `day-button ${
                                                    selected
                                                        ? "selected"
                                                        : ""
                                                }`
                                            }
                                            onClick={() =>
                                                handleDayChange(
                                                    day
                                                )
                                            }
                                        >

                                            {day}

                                        </button>
                                    );
                                }
                            )}

                        </div>

                    </div>

                    <div className="form-grid time-grid">

                        <div className="form-field">

                            <label>
                                Start Time
                            </label>

                            <div className="input-with-icon">

                                <input
                                    type="time"
                                    name="startTime"
                                    value={
                                        formData.startTime
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                        </div>

                        <div className="form-field">

                            <label>
                                End Time
                            </label>

                            <div className="input-with-icon">

                                <input
                                    type="time"
                                    name="endTime"
                                    value={
                                        formData.endTime
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                        </div>

                    </div>

                </section>

                <div className="form-actions">

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() =>
                            navigate(
                                `/admin/doctors/${id}`
                            )
                        }
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={
                            submitting
                        }
                    >

                        {submitting ? (

                            <>
                                <LoaderCircle
                                    size={18}
                                    className="spin"
                                />

                                Saving...
                            </>

                        ) : (

                            <>
                                <Save
                                    size={18}
                                />

                                Save Changes
                            </>

                        )}

                    </button>

                </div>

            </form>

        </div>
    );
};

export default AdminDoctorEdit;