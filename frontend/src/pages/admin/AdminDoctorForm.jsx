import React,
{
    useEffect,
    useState
}
from "react";

import {
    ArrowLeft,
    Camera,
    UserRound,
    Mail,
    Phone,
    Lock,
    Stethoscope,
    Building2,
    GraduationCap,
    BriefcaseBusiness,
    IndianRupee,
    Clock3,
    Check,
    LoaderCircle
}
from "lucide-react";

import {
    useNavigate
}
from "react-router-dom";

import {
    createDoctor,
    getDepartments
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

const AdminDoctorForm =
() =>
{
    const navigate =
        useNavigate();

    const [
        departments,
        setDepartments
    ] = useState([]);

    const [
        loadingDepartments,
        setLoadingDepartments
    ] = useState(true);

    const [
        submitting,
        setSubmitting
    ] = useState(false);

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
            password: "",
            specialization: "",
            department: "",
            qualification: "",
            experience: "",
            consultationFee: "",
            availableDays: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday"
            ],
            startTime: "09:00",
            endTime: "17:00"
        }
    );

    useEffect(
        () =>
        {
            const loadDepartments =
            async () =>
            {
                try
                {
                    const result =
                        await getDepartments();

                    const departmentList =
                        result?.departments ||
                        result?.data ||
                        [];

                    setDepartments(
                        Array.isArray(
                            departmentList
                        )
                            ? departmentList
                            : []
                    );
                }
                catch
                {
                    setDepartments([]);
                }
                finally
                {
                    setLoadingDepartments(
                        false
                    );
                }
            };

            loadDepartments();
        },
        []
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
                const selectedDays =
                    previous.availableDays;

                const alreadySelected =
                    selectedDays.includes(
                        day
                    );

                if (
                    alreadySelected
                )
                {
                    return {
                        ...previous,
                        availableDays:
                            selectedDays.filter(
                                selectedDay =>
                                    selectedDay !==
                                    day
                            )
                    };
                }

                return {
                    ...previous,
                    availableDays:
                        [
                            ...selectedDays,
                            day
                        ]
                };
            }
        );

        setError("");
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
                "Please select a valid image file."
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

    const validateForm =
    () =>
    {
        if (
            !formData.name.trim()
        )
        {
            return "Doctor name is required.";
        }

        if (
            !formData.email.trim()
        )
        {
            return "Email address is required.";
        }

        if (
            !formData.phone.trim()
        )
        {
            return "Phone number is required.";
        }

        if (
            formData.phone.length <
            10
        )
        {
            return "Please enter a valid phone number.";
        }

        if (
            !formData.password
        )
        {
            return "Password is required.";
        }

        if (
            formData.password.length <
            6
        )
        {
            return "Password must contain at least 6 characters.";
        }

        if (
            !formData.specialization.trim()
        )
        {
            return "Specialization is required.";
        }

        if (
            !formData.department
        )
        {
            return "Please select a department.";
        }

        if (
            !formData.qualification.trim()
        )
        {
            return "Qualification is required.";
        }

        if (
            formData.experience === ""
        )
        {
            return "Experience is required.";
        }

        if (
            Number(formData.experience) <
            0
        )
        {
            return "Experience cannot be negative.";
        }

        if (
            formData.consultationFee === ""
        )
        {
            return "Consultation fee is required.";
        }

        if (
            Number(
                formData.consultationFee
            ) < 0
        )
        {
            return "Consultation fee cannot be negative.";
        }

        if (
            formData.availableDays
                .length === 0
        )
        {
            return "Select at least one available day.";
        }

        if (
            !formData.startTime ||
            !formData.endTime
        )
        {
            return "Start time and end time are required.";
        }

        if (
            formData.startTime >=
            formData.endTime
        )
        {
            return "End time must be later than start time.";
        }

        return "";
    };

    const handleSubmit =
    async (event) =>
    {
        event.preventDefault();

        setError("");
        setSuccess("");

        const validationError =
            validateForm();

        if (validationError)
        {
            setError(
                validationError
            );

            window.scrollTo(
                {
                    top: 0,
                    behavior: "smooth"
                }
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
                "password",
                formData.password
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

            await createDoctor(
                data
            );

            setSuccess(
                "Doctor created successfully."
            );

            setTimeout(
                () =>
                {
                    navigate(
                        "/admin/doctors"
                    );
                },
                1000
            );
        }
        catch (requestError)
        {
            const message =
                requestError
                    ?.response
                    ?.data
                    ?.message ||
                requestError
                    ?.response
                    ?.data
                    ?.error ||
                "Unable to create doctor.";

            setError(message);

            window.scrollTo(
                {
                    top: 0,
                    behavior: "smooth"
                }
            );
        }
        finally
        {
            setSubmitting(false);
        }
    };

    return (
        <div className="dashboard-page">

            <div className="page-heading">

                <div>

                    <span className="page-eyebrow">
                        DOCTOR MANAGEMENT
                    </span>

                    <h1>
                        Add New Doctor
                    </h1>

                    <p>
                        Create a doctor profile
                        and configure their
                        availability.
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

            {error && (

                <div className="form-alert error">
                    {error}
                </div>

            )}

            {success && (

                <div className="form-alert success">
                    <Check size={18} />
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
                            <UserRound
                                size={19}
                            />
                        </div>

                        <div>
                            <h2>
                                Personal Information
                            </h2>

                            <p>
                                Basic information
                                about the doctor.
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
                                    alt="Doctor preview"
                                />

                            ) : (

                                <UserRound
                                    size={40}
                                />

                            )}

                        </div>

                        <div>

                            <label
                                htmlFor="profilePhoto"
                                className="photo-upload-button"
                            >
                                <Camera
                                    size={17}
                                />

                                Upload Photo
                            </label>

                            <input
                                id="profilePhoto"
                                type="file"
                                accept="image/*"
                                onChange={
                                    handlePhotoChange
                                }
                                hidden
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

                                <UserRound
                                    size={17}
                                />

                                <input
                                    name="name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Dr. John Smith"
                                />

                            </div>

                        </div>

                        <div className="form-field">

                            <label>
                                Email Address *
                            </label>

                            <div className="input-with-icon">

                                <Mail
                                    size={17}
                                />

                                <input
                                    type="email"
                                    name="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="doctor@hospital.com"
                                />

                            </div>

                        </div>

                        <div className="form-field">

                            <label>
                                Phone Number *
                            </label>

                            <div className="input-with-icon">

                                <Phone
                                    size={17}
                                />

                                <input
                                    name="phone"
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="9876543210"
                                />

                            </div>

                        </div>

                        <div className="form-field">

                            <label>
                                Login Password *
                            </label>

                            <div className="input-with-icon">

                                <Lock
                                    size={17}
                                />

                                <input
                                    type="password"
                                    name="password"
                                    value={
                                        formData.password
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Minimum 6 characters"
                                />

                            </div>

                        </div>

                    </div>

                </section>

                <section className="form-section">

                    <div className="form-section-heading">

                        <div className="form-section-icon">
                            <Stethoscope
                                size={19}
                            />
                        </div>

                        <div>
                            <h2>
                                Professional Information
                            </h2>

                            <p>
                                Medical qualifications
                                and department details.
                            </p>
                        </div>

                    </div>

                    <div className="form-grid">

                        <div className="form-field">

                            <label>
                                Specialization *
                            </label>

                            <div className="input-with-icon">

                                <Stethoscope
                                    size={17}
                                />

                                <input
                                    name="specialization"
                                    value={
                                        formData.specialization
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Interventional Cardiology"
                                />

                            </div>

                        </div>

                        <div className="form-field">

                            <label>
                                Department *
                            </label>

                            <div className="input-with-icon">

                                <Building2
                                    size={17}
                                />

                                <select
                                    name="department"
                                    value={
                                        formData.department
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        loadingDepartments
                                    }
                                >

                                    <option value="">
                                        {
                                            loadingDepartments
                                                ? "Loading departments..."
                                                : "Select department"
                                        }
                                    </option>

                                    {departments.map(
                                        department =>
                                        {
                                            const id =
                                                department._id ||
                                                department.id;

                                            const name =
                                                department.name ||
                                                department.departmentName ||
                                                department.title ||
                                                "Department";

                                            return (
                                                <option
                                                    key={
                                                        id
                                                    }
                                                    value={
                                                        id
                                                    }
                                                >
                                                    {
                                                        name
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
                                Qualification *
                            </label>

                            <div className="input-with-icon">

                                <GraduationCap
                                    size={17}
                                />

                                <input
                                    name="qualification"
                                    value={
                                        formData.qualification
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="MBBS, MD, DM"
                                />

                            </div>

                        </div>

                        <div className="form-field">

                            <label>
                                Experience *
                            </label>

                            <div className="input-with-icon">

                                <BriefcaseBusiness
                                    size={17}
                                />

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
                                    placeholder="8"
                                />

                                <span className="input-suffix">
                                    years
                                </span>

                            </div>

                        </div>

                        <div className="form-field">

                            <label>
                                Consultation Fee *
                            </label>

                            <div className="input-with-icon">

                                <IndianRupee
                                    size={17}
                                />

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
                                    placeholder="500"
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
                                Set the doctor's
                                consultation schedule.
                            </p>
                        </div>

                    </div>

                    <div className="form-field">

                        <label>
                            Available Days *
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

                                            {selected && (
                                                <Check
                                                    size={15}
                                                />
                                            )}

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
                                Start Time *
                            </label>

                            <div className="input-with-icon">

                                <Clock3
                                    size={17}
                                />

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
                                End Time *
                            </label>

                            <div className="input-with-icon">

                                <Clock3
                                    size={17}
                                />

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
                                "/admin/doctors"
                            )
                        }
                        disabled={
                            submitting
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

                                Creating Doctor...
                            </>

                        ) : (

                            <>
                                <Check
                                    size={18}
                                />

                                Create Doctor
                            </>

                        )}

                    </button>

                </div>

            </form>

        </div>
    );
};

export default AdminDoctorForm;