import React, {
    useEffect,
    useState
}
from "react";

import
{
    User,
    Mail,
    Phone,
    CalendarDays,
    Droplets,
    MapPin,
    Pencil,
    Save,
    X,
    RefreshCw
}
from "lucide-react";

import api
from "../../api/axios";

import "../../styles/PatientProfile.css";


const PatientProfile =
() =>
{
    const [profile, setProfile] =
        useState(
            {
                name: "",
                email: "",
                phone: "",
                dateOfBirth: "",
                bloodGroup: "",
                address: ""
            }
        );

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [editing, setEditing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    const fetchProfile =
    async () =>
    {
        try
        {
            setLoading(true);

            setError("");

            const response =
                await api.get(
                    "/patients/profile"
                );

            const patient =
                response.data.patient ||
                response.data;

            setProfile(
                {
                    name:
                        patient.name || "",

                    email:
                        patient.email || "",

                    phone:
                        patient.phone || "",

                    dateOfBirth:
                        patient.dateOfBirth
                        ? patient.dateOfBirth.substring(0, 10)
                        : "",

                    bloodGroup:
                        patient.bloodGroup || "",

                    address:
                        patient.address || ""
                }
            );
        }
        catch (requestError)
        {
            setError(
                requestError.response?.data?.message ||
                "Unable to load your profile."
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
            fetchProfile();
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

        setProfile(
            previousProfile =>
            ({
                ...previousProfile,
                [name]: value
            })
        );
    };


    const handleSave =
    async (event) =>
    {
        event.preventDefault();

        try
        {
            setSaving(true);

            setError("");

            setSuccess("");

            await api.put(
                "/patients/profile",
                profile
            );

            setSuccess(
                "Profile updated successfully."
            );

            setEditing(false);

            await fetchProfile();
        }
        catch (requestError)
        {
            setError(
                requestError.response?.data?.message ||
                "Unable to update your profile."
            );
        }
        finally
        {
            setSaving(false);
        }
    };


    const handleCancel =
    () =>
    {
        setEditing(false);

        setError("");

        setSuccess("");

        fetchProfile();
    };


    if (loading)
    {
        return (
            <div className="patient-profile-page">

                <div className="patient-profile-loading">

                    <RefreshCw
                        size={28}
                        className="patient-profile-spin"
                    />

                    <p>
                        Loading profile...
                    </p>

                </div>

            </div>
        );
    }


    return (
        <div className="patient-profile-page">

            <div className="patient-profile-container">

                <div className="patient-profile-header">

                    <div>

                        <span className="patient-profile-eyebrow">
                            MEDICARE
                        </span>

                        <h1>
                            My Profile
                        </h1>

                        <p>
                            View and manage your personal
                            information.
                        </p>

                    </div>

                    {
                        !editing
                        ?
                        (
                            <button
                                className="patient-profile-edit-button"
                                onClick={() =>
                                    setEditing(true)
                                }
                            >
                                <Pencil size={17} />

                                Edit Profile
                            </button>
                        )
                        :
                        (
                            <div className="patient-profile-header-actions">

                                <button
                                    className="patient-profile-cancel-button"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    <X size={17} />

                                    Cancel
                                </button>

                                <button
                                    className="patient-profile-save-button"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {
                                        saving
                                        ?
                                        (
                                            <>
                                                <RefreshCw
                                                    size={17}
                                                    className="patient-profile-spin"
                                                />

                                                Saving...
                                            </>
                                        )
                                        :
                                        (
                                            <>
                                                <Save size={17} />

                                                Save Changes
                                            </>
                                        )
                                    }
                                </button>

                            </div>
                        )
                    }

                </div>


                {
                    error &&
                    (
                        <div className="patient-profile-error">
                            {error}
                        </div>
                    )
                }


                {
                    success &&
                    (
                        <div className="patient-profile-success">
                            {success}
                        </div>
                    )
                }


                <div className="patient-profile-card">

                    <div className="patient-profile-card-header">

                        <div className="patient-profile-avatar">
                            <User size={38} />
                        </div>

                        <div>

                            <h2>
                                {profile.name || "Patient"}
                            </h2>

                            <p>
                                Patient Account
                            </p>

                        </div>

                    </div>


                    <form
                        className="patient-profile-form"
                        onSubmit={handleSave}
                    >

                        <div className="patient-profile-form-grid">


                            <div className="patient-profile-field">

                                <label>
                                    Full Name
                                </label>

                                <div className="patient-profile-input-wrapper">

                                    <User size={18} />

                                    <input
                                        type="text"
                                        name="name"
                                        value={profile.name}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        placeholder="Enter your full name"
                                    />

                                </div>

                            </div>


                            <div className="patient-profile-field">

                                <label>
                                    Email Address
                                </label>

                                <div className="patient-profile-input-wrapper">

                                    <Mail size={18} />

                                    <input
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        placeholder="Enter your email"
                                    />

                                </div>

                            </div>


                            <div className="patient-profile-field">

                                <label>
                                    Phone Number
                                </label>

                                <div className="patient-profile-input-wrapper">

                                    <Phone size={18} />

                                    <input
                                        type="text"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        placeholder="Enter your phone number"
                                    />

                                </div>

                            </div>


                            <div className="patient-profile-field">

                                <label>
                                    Date of Birth
                                </label>

                                <div className="patient-profile-input-wrapper">

                                    <CalendarDays size={18} />

                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={profile.dateOfBirth}
                                        onChange={handleChange}
                                        disabled={!editing}
                                    />

                                </div>

                            </div>


                            <div className="patient-profile-field">

                                <label>
                                    Blood Group
                                </label>

                                <div className="patient-profile-input-wrapper">

                                    <Droplets size={18} />

                                    <select
                                        name="bloodGroup"
                                        value={profile.bloodGroup}
                                        onChange={handleChange}
                                        disabled={!editing}
                                    >

                                        <option value="">
                                            Select Blood Group
                                        </option>

                                        <option value="A+">
                                            A+
                                        </option>

                                        <option value="A-">
                                            A-
                                        </option>

                                        <option value="B+">
                                            B+
                                        </option>

                                        <option value="B-">
                                            B-
                                        </option>

                                        <option value="AB+">
                                            AB+
                                        </option>

                                        <option value="AB-">
                                            AB-
                                        </option>

                                        <option value="O+">
                                            O+
                                        </option>

                                        <option value="O-">
                                            O-
                                        </option>

                                    </select>

                                </div>

                            </div>


                            <div className="patient-profile-field patient-profile-address-field">

                                <label>
                                    Address
                                </label>

                                <div className="patient-profile-input-wrapper">

                                    <MapPin size={18} />

                                    <textarea
                                        name="address"
                                        value={profile.address}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        placeholder="Enter your address"
                                        rows="4"
                                    />

                                </div>

                            </div>

                        </div>


                        {
                            editing &&
                            (
                                <div className="patient-profile-mobile-actions">

                                    <button
                                        type="button"
                                        className="patient-profile-cancel-button"
                                        onClick={handleCancel}
                                        disabled={saving}
                                    >
                                        <X size={17} />

                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="patient-profile-save-button"
                                        disabled={saving}
                                    >
                                        <Save size={17} />

                                        {
                                            saving
                                            ?
                                            "Saving..."
                                            :
                                            "Save Changes"
                                        }

                                    </button>

                                </div>
                            )
                        }

                    </form>

                </div>

            </div>

        </div>
    );
};


export default PatientProfile;