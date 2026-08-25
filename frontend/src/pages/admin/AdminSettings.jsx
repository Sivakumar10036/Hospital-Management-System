import React, {
    useEffect,
    useState
} from "react";

import "./AdminSettings.css";

import {
    Building2,
    UserRound,
    LockKeyhole,
    Bell,
    Save,
    X,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

import api from "../../api/axios";

const AdminSettings =
() =>
{
    const [
        user,
        setUser
    ] =
        useState(null);

    const [
        loading,
        setLoading
    ] =
        useState(true);

    const [
        saving,
        setSaving
    ] =
        useState(false);

    const [
        message,
        setMessage
    ] =
        useState(
        {
            type: "",
            text: ""
        });

    const [
        showPasswordModal,
        setShowPasswordModal
    ] =
        useState(false);

    const [
        showCurrentPassword,
        setShowCurrentPassword
    ] =
        useState(false);

    const [
        showNewPassword,
        setShowNewPassword
    ] =
        useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword
    ] =
        useState(false);

    const [
        hospitalData,
        setHospitalData
    ] =
        useState(
        {
            hospitalName:
                "MediCare Hospital",

            email:
                "admin@medicare.com",

            phone:
                "",

            address:
                ""
        });

    const [
        preferences,
        setPreferences
    ] =
        useState(
        {
            appointmentNotifications:
                true,

            patientNotifications:
                true,

            systemNotifications:
                true
        });

    const [
        passwordData,
        setPasswordData
    ] =
        useState(
        {
            currentPassword:
                "",

            newPassword:
                "",

            confirmPassword:
                ""
        });

    const loadUser =
        async () =>
    {
        try
        {
            setLoading(true);

            const response =
                await api.get(
                    "/auth/me"
                );

            if (
                response.data?.success
            )
            {
                setUser(
                    response.data.user
                );
            }
        }
        catch (error)
        {
            console.error(
                "Settings user error:",
                error
            );

            const storedUser =
                localStorage.getItem(
                    "user"
                );

            if (storedUser)
            {
                try
                {
                    setUser(
                        JSON.parse(
                            storedUser
                        )
                    );
                }
                catch
                {
                    setUser(null);
                }
            }
        }
        finally
        {
            setLoading(false);
        }
    };

    useEffect(
        () =>
        {
            loadUser();
        },
        []
    );

    const handleHospitalChange =
        event =>
    {
        const
        {
            name,
            value
        } =
            event.target;

        setHospitalData(
            previous =>
            ({
                ...previous,

                [name]:
                    value
            })
        );
    };

    const handlePreferenceChange =
        name =>
    {
        setPreferences(
            previous =>
            ({
                ...previous,

                [name]:
                    !previous[name]
            })
        );
    };

    const handleSaveSettings =
        async event =>
    {
        if (event)
        {
            event.preventDefault();
        }

        try
        {
            setSaving(true);

            setMessage(
            {
                type: "",
                text: ""
            });

            localStorage.setItem(
                "hospitalSettings",
                JSON.stringify(
                    hospitalData
                )
            );

            localStorage.setItem(
                "notificationPreferences",
                JSON.stringify(
                    preferences
                )
            );

            setMessage(
            {
                type:
                    "success",

                text:
                    "Settings saved successfully."
            });
        }
        catch (error)
        {
            console.error(
                "Save settings error:",
                error
            );

            setMessage(
            {
                type:
                    "error",

                text:
                    "Unable to save settings."
            });
        }
        finally
        {
            setSaving(false);
        }
    };

    const openPasswordModal =
        () =>
    {
        setPasswordData(
        {
            currentPassword:
                "",

            newPassword:
                "",

            confirmPassword:
                ""
        });

        setShowPasswordModal(
            true
        );

        setMessage(
        {
            type: "",
            text: ""
        });
    };

    const closePasswordModal =
        () =>
    {
        setShowPasswordModal(
            false
        );

        setPasswordData(
        {
            currentPassword:
                "",

            newPassword:
                "",

            confirmPassword:
                ""
        });

        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    };

    const handlePasswordChange =
        event =>
    {
        const
        {
            name,
            value
        } =
            event.target;

        setPasswordData(
            previous =>
            ({
                ...previous,

                [name]:
                    value
            })
        );
    };

    const handleChangePassword =
        async event =>
    {
        event.preventDefault();

        if (
            !passwordData.currentPassword ||
            !passwordData.newPassword ||
            !passwordData.confirmPassword
        )
        {
            alert(
                "Please fill all password fields."
            );

            return;
        }

        if (
            passwordData.newPassword.length < 6
        )
        {
            alert(
                "New password must contain at least 6 characters."
            );

            return;
        }

        if (
            passwordData.newPassword !==
            passwordData.confirmPassword
        )
        {
            alert(
                "New password and confirm password do not match."
            );

            return;
        }

        try
        {
            const response =
                await api.patch(
                    "/auth/change-password",
                    {
                        currentPassword:
                            passwordData.currentPassword,

                        newPassword:
                            passwordData.newPassword
                    }
                );

            if (
                response.data?.success
            )
            {
                closePasswordModal();

                setMessage(
                {
                    type:
                        "success",

                    text:
                        "Password changed successfully."
                });
            }
            else
            {
                alert(
                    response.data?.message ||
                    "Unable to change password."
                );
            }
        }
        catch (error)
        {
            console.error(
                "Change password error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to change password."
            );
        }
    };

    useEffect(
        () =>
        {
            const savedHospitalSettings =
                localStorage.getItem(
                    "hospitalSettings"
                );

            const savedPreferences =
                localStorage.getItem(
                    "notificationPreferences"
                );

            if (
                savedHospitalSettings
            )
            {
                try
                {
                    setHospitalData(
                        JSON.parse(
                            savedHospitalSettings
                        )
                    );
                }
                catch
                {
                }
            }

            if (
                savedPreferences
            )
            {
                try
                {
                    setPreferences(
                        JSON.parse(
                            savedPreferences
                        )
                    );
                }
                catch
                {
                }
            }
        },
        []
    );

    if (loading)
    {
        return (
            <div className="dashboard-page">

                <div className="settings-loading">

                    <UserRound
                        size={28}
                    />

                    <h2>
                        Loading settings...
                    </h2>

                    <p>
                        Please wait.
                    </p>

                </div>

            </div>
        );
    }

    const adminName =
        user?.name ||
        "Hospital Administrator";

    const adminEmail =
        user?.email ||
        "admin@medicare.com";

    const adminPhone =
        user?.phone ||
        "";

    const firstLetter =
        adminName
            .charAt(0)
            .toUpperCase();

    return (
        <div className="dashboard-page">

            <div className="settings-page">

                <div className="settings-page-header">

                    <div>

                        <span className="page-eyebrow">
                            MEDICARE
                        </span>

                        <h1>
                            Settings
                        </h1>

                        <p>
                            Manage your hospital and administrator settings.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="settings-save-button"
                        onClick={
                            handleSaveSettings
                        }
                        disabled={
                            saving
                        }
                    >

                        <Save
                            size={17}
                        />

                        {
                            saving
                            ?
                                "Saving..."
                            :
                                "Save Changes"
                        }

                    </button>

                </div>

                {
                    message.text &&
                    (
                        <div
                            className={
                                `settings-message ${message.type}`
                            }
                        >

                            {
                                message.type ===
                                "success"
                                ?
                                    <CheckCircle2
                                        size={17}
                                    />
                                :
                                    <AlertCircle
                                        size={17}
                                    />
                            }

                            {message.text}

                        </div>
                    )
                }

                <div className="settings-grid">

                    <div>

                        <div className="settings-card">

                            <div className="settings-card-header">

                                <div className="settings-card-icon">

                                    <UserRound
                                        size={20}
                                    />

                                </div>

                                <div>

                                    <h2>
                                        Administrator Profile
                                    </h2>

                                    <p>
                                        Your administrator account information.
                                    </p>

                                </div>

                            </div>

                            <div className="settings-card-body">

                                <div className="settings-profile">

                                    <div className="settings-profile-avatar">

                                        {
                                            user?.profilePhoto
                                            ?
                                            (
                                                <img
                                                    src={
                                                        user.profilePhoto
                                                    }
                                                    alt="Administrator"
                                                />
                                            )
                                            :
                                                firstLetter
                                        }

                                    </div>

                                    <div className="settings-profile-info">

                                        <h3>
                                            {
                                                adminName
                                            }
                                        </h3>

                                        <p>
                                            Hospital Administrator
                                        </p>

                                    </div>

                                </div>

                                <div className="settings-form-grid">

                                    <div className="settings-form-group">

                                        <label>
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                adminName
                                            }
                                            disabled
                                        />

                                    </div>

                                    <div className="settings-form-group">

                                        <label>
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            value={
                                                adminEmail
                                            }
                                            disabled
                                        />

                                    </div>

                                    <div className="settings-form-group">

                                        <label>
                                            Phone Number
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                adminPhone
                                            }
                                            disabled
                                        />

                                    </div>

                                    <div className="settings-form-group">

                                        <label>
                                            Role
                                        </label>

                                        <input
                                            type="text"
                                            value="Hospital Administrator"
                                            disabled
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className="settings-card">

                            <div className="settings-card-header">

                                <div className="settings-card-icon">

                                    <Building2
                                        size={20}
                                    />

                                </div>

                                <div>

                                    <h2>
                                        Hospital Information
                                    </h2>

                                    <p>
                                        Update your hospital's basic information.
                                    </p>

                                </div>

                            </div>

                            <div className="settings-card-body">

                                <form
                                    onSubmit={
                                        handleSaveSettings
                                    }
                                >

                                    <div className="settings-form-grid">

                                        <div className="settings-form-group">

                                            <label>
                                                Hospital Name
                                            </label>

                                            <input
                                                type="text"
                                                name="hospitalName"
                                                value={
                                                    hospitalData.hospitalName
                                                }
                                                onChange={
                                                    handleHospitalChange
                                                }
                                                placeholder="Enter hospital name"
                                            />

                                        </div>

                                        <div className="settings-form-group">

                                            <label>
                                                Hospital Email
                                            </label>

                                            <input
                                                type="email"
                                                name="email"
                                                value={
                                                    hospitalData.email
                                                }
                                                onChange={
                                                    handleHospitalChange
                                                }
                                                placeholder="Enter hospital email"
                                            />

                                        </div>

                                        <div className="settings-form-group">

                                            <label>
                                                Phone Number
                                            </label>

                                            <input
                                                type="text"
                                                name="phone"
                                                value={
                                                    hospitalData.phone
                                                }
                                                onChange={
                                                    handleHospitalChange
                                                }
                                                placeholder="Enter hospital phone"
                                            />

                                        </div>

                                        <div className="settings-form-group full-width">

                                            <label>
                                                Hospital Address
                                            </label>

                                            <textarea
                                                name="address"
                                                value={
                                                    hospitalData.address
                                                }
                                                onChange={
                                                    handleHospitalChange
                                                }
                                                placeholder="Enter complete hospital address"
                                            />

                                        </div>

                                    </div>

                                    <div className="settings-save-area">

                                        <button
                                            type="submit"
                                            className="settings-save-button"
                                            disabled={
                                                saving
                                            }
                                        >

                                            <Save
                                                size={16}
                                            />

                                            {
                                                saving
                                                ?
                                                    "Saving..."
                                                :
                                                    "Save Hospital Information"
                                            }

                                        </button>

                                    </div>

                                </form>

                            </div>

                        </div>

                    </div>

                    <div>

                        <div className="settings-card">

                            <div className="settings-card-header">

                                <div className="settings-card-icon">

                                    <LockKeyhole
                                        size={20}
                                    />

                                </div>

                                <div>

                                    <h2>
                                        Security
                                    </h2>

                                    <p>
                                        Manage your account security.
                                    </p>

                                </div>

                            </div>

                            <div className="settings-card-body">

                                <div className="settings-security-item">

                                    <div className="settings-security-info">

                                        <div className="settings-security-icon">

                                            <LockKeyhole
                                                size={18}
                                            />

                                        </div>

                                        <div>

                                            <h3>
                                                Password
                                            </h3>

                                            <p>
                                                Change your account password.
                                            </p>

                                        </div>

                                    </div>

                                    <button
                                        type="button"
                                        className="settings-secondary-button"
                                        onClick={
                                            openPasswordModal
                                        }
                                    >
                                        Change
                                    </button>

                                </div>

                                <div className="settings-security-item">

                                    <div className="settings-security-info">

                                        <div className="settings-security-icon">

                                            <CheckCircle2
                                                size={18}
                                            />

                                        </div>

                                        <div>

                                            <h3>
                                                Account Status
                                            </h3>

                                            <p>
                                                Your administrator account is active.
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className="settings-card">

                            <div className="settings-card-header">

                                <div className="settings-card-icon">

                                    <Bell
                                        size={20}
                                    />

                                </div>

                                <div>

                                    <h2>
                                        Notifications
                                    </h2>

                                    <p>
                                        Choose which notifications you receive.
                                    </p>

                                </div>

                            </div>

                            <div className="settings-card-body">

                                <div className="settings-preference">

                                    <div className="settings-preference-info">

                                        <h3>
                                            Appointment Notifications
                                        </h3>

                                        <p>
                                            Receive updates about appointments.
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        className={
                                            preferences.appointmentNotifications
                                            ?
                                                "settings-toggle active"
                                            :
                                                "settings-toggle"
                                        }
                                        onClick={() =>
                                            handlePreferenceChange(
                                                "appointmentNotifications"
                                            )
                                        }
                                    >
                                    </button>

                                </div>

                                <div className="settings-preference">

                                    <div className="settings-preference-info">

                                        <h3>
                                            Patient Notifications
                                        </h3>

                                        <p>
                                            Receive updates about patients.
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        className={
                                            preferences.patientNotifications
                                            ?
                                                "settings-toggle active"
                                            :
                                                "settings-toggle"
                                        }
                                        onClick={() =>
                                            handlePreferenceChange(
                                                "patientNotifications"
                                            )
                                        }
                                    >
                                    </button>

                                </div>

                                <div className="settings-preference">

                                    <div className="settings-preference-info">

                                        <h3>
                                            System Notifications
                                        </h3>

                                        <p>
                                            Receive important system updates.
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        className={
                                            preferences.systemNotifications
                                            ?
                                                "settings-toggle active"
                                            :
                                                "settings-toggle"
                                        }
                                        onClick={() =>
                                            handlePreferenceChange(
                                                "systemNotifications"
                                            )
                                        }
                                    >
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {
                    showPasswordModal &&
                    (
                        <div
                            className="settings-modal-overlay"
                            onClick={
                                event =>
                                {
                                    if (
                                        event.target ===
                                        event.currentTarget
                                    )
                                    {
                                        closePasswordModal();
                                    }
                                }
                            }
                        >

                            <div className="settings-modal">

                                <div className="settings-modal-header">

                                    <div>

                                        <span className="page-eyebrow">
                                            MEDICARE
                                        </span>

                                        <h2>
                                            Change Password
                                        </h2>

                                    </div>

                                    <button
                                        type="button"
                                        className="settings-modal-close"
                                        onClick={
                                            closePasswordModal
                                        }
                                    >

                                        <X
                                            size={18}
                                        />

                                    </button>

                                </div>

                                <form
                                    onSubmit={
                                        handleChangePassword
                                    }
                                >

                                    <div className="settings-modal-body">

                                        <div className="settings-form-group">

                                            <label>
                                                Current Password
                                            </label>

                                            <div
                                                style={{
                                                    position:
                                                        "relative"
                                                }}
                                            >

                                                <input
                                                    type={
                                                        showCurrentPassword
                                                        ?
                                                            "text"
                                                        :
                                                            "password"
                                                    }
                                                    name="currentPassword"
                                                    value={
                                                        passwordData.currentPassword
                                                    }
                                                    onChange={
                                                        handlePasswordChange
                                                    }
                                                    placeholder="Enter current password"
                                                    style={{
                                                        paddingRight:
                                                            "42px"
                                                    }}
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowCurrentPassword(
                                                            previous =>
                                                                !previous
                                                        )
                                                    }
                                                    style={{
                                                        position:
                                                            "absolute",

                                                        right:
                                                            "8px",

                                                        top:
                                                            "50%",

                                                        transform:
                                                            "translateY(-50%)",

                                                        border:
                                                            "none",

                                                        background:
                                                            "transparent",

                                                        color:
                                                            "#64748b",

                                                        cursor:
                                                            "pointer"
                                                    }}
                                                >

                                                    {
                                                        showCurrentPassword
                                                        ?
                                                            <EyeOff
                                                                size={17}
                                                            />
                                                        :
                                                            <Eye
                                                                size={17}
                                                            />
                                                    }

                                                </button>

                                            </div>

                                        </div>

                                        <div className="settings-form-group">

                                            <label>
                                                New Password
                                            </label>

                                            <div
                                                style={{
                                                    position:
                                                        "relative"
                                                }}
                                            >

                                                <input
                                                    type={
                                                        showNewPassword
                                                        ?
                                                            "text"
                                                        :
                                                            "password"
                                                    }
                                                    name="newPassword"
                                                    value={
                                                        passwordData.newPassword
                                                    }
                                                    onChange={
                                                        handlePasswordChange
                                                    }
                                                    placeholder="Enter new password"
                                                    style={{
                                                        paddingRight:
                                                            "42px"
                                                    }}
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowNewPassword(
                                                            previous =>
                                                                !previous
                                                        )
                                                    }
                                                    style={{
                                                        position:
                                                            "absolute",

                                                        right:
                                                            "8px",

                                                        top:
                                                            "50%",

                                                        transform:
                                                            "translateY(-50%)",

                                                        border:
                                                            "none",

                                                        background:
                                                            "transparent",

                                                        color:
                                                            "#64748b",

                                                        cursor:
                                                            "pointer"
                                                    }}
                                                >

                                                    {
                                                        showNewPassword
                                                        ?
                                                            <EyeOff
                                                                size={17}
                                                            />
                                                        :
                                                            <Eye
                                                                size={17}
                                                            />
                                                    }

                                                </button>

                                            </div>

                                            <span className="settings-form-help">
                                                Minimum 6 characters.
                                            </span>

                                        </div>

                                        <div className="settings-form-group">

                                            <label>
                                                Confirm New Password
                                            </label>

                                            <div
                                                style={{
                                                    position:
                                                        "relative"
                                                }}
                                            >

                                                <input
                                                    type={
                                                        showConfirmPassword
                                                        ?
                                                            "text"
                                                        :
                                                            "password"
                                                    }
                                                    name="confirmPassword"
                                                    value={
                                                        passwordData.confirmPassword
                                                    }
                                                    onChange={
                                                        handlePasswordChange
                                                    }
                                                    placeholder="Confirm new password"
                                                    style={{
                                                        paddingRight:
                                                            "42px"
                                                    }}
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowConfirmPassword(
                                                            previous =>
                                                                !previous
                                                        )
                                                    }
                                                    style={{
                                                        position:
                                                            "absolute",

                                                        right:
                                                            "8px",

                                                        top:
                                                            "50%",

                                                        transform:
                                                            "translateY(-50%)",

                                                        border:
                                                            "none",

                                                        background:
                                                            "transparent",

                                                        color:
                                                            "#64748b",

                                                        cursor:
                                                            "pointer"
                                                    }}
                                                >

                                                    {
                                                        showConfirmPassword
                                                        ?
                                                            <EyeOff
                                                                size={17}
                                                            />
                                                        :
                                                            <Eye
                                                                size={17}
                                                            />
                                                    }

                                                </button>

                                            </div>

                                        </div>

                                        <div className="settings-modal-actions">

                                            <button
                                                type="button"
                                                className="settings-cancel-button"
                                                onClick={
                                                    closePasswordModal
                                                }
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="submit"
                                                className="settings-save-button"
                                            >

                                                <LockKeyhole
                                                    size={16}
                                                />

                                                Change Password

                                            </button>

                                        </div>

                                    </div>

                                </form>

                            </div>

                        </div>
                    )
                }

            </div>

        </div>
    );
};

export default AdminSettings;