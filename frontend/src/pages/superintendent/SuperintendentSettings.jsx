import React, { useState } from "react";

import {
    LockKeyhole,
    Eye,
    EyeOff,
    ShieldCheck,
    AlertCircle
} from "lucide-react";

import {
    changeSuperintendentPassword
} from "../../services/superintendentService";

import "../../styles/SuperintendentSettings.css";

const SuperintendentSettings = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChangePassword = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            setError("Please fill in all password fields.");
            return;
        }

        if (newPassword.length < 6) {
            setError(
                "Password must contain at least 6 characters."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const result =
                await changeSuperintendentPassword({
                    currentPassword,
                    newPassword,
                    confirmPassword
                });

            setSuccess(
                result.message ||
                "Password changed successfully."
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
        catch (requestError) {
            setError(
                requestError?.response?.data?.message ||
                "Unable to change password."
            );
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="superintendent-settings">

            <div className="settings-header">
                <div className="settings-icon">
                    <ShieldCheck size={28} />
                </div>

                <div>
                    <h1>Settings</h1>
                    <p>
                        Manage your Superintendent account security.
                    </p>
                </div>
            </div>

            <div className="settings-card">

                <div className="settings-card-header">
                    <div className="settings-section-icon">
                        <ShieldCheck size={24} />
                    </div>

                    <div>
                        <h2>Security</h2>
                        <p>
                            Change your Superintendent account password.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="settings-alert settings-alert-error">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="settings-alert settings-alert-success">
                        <ShieldCheck size={20} />
                        <span>{success}</span>
                    </div>
                )}

                <form onSubmit={handleChangePassword}>

                    <div className="password-field">
                        <label>Current Password</label>

                        <div className="password-input-wrapper">
                            <LockKeyhole size={20} />

                            <input
                                type={
                                    showCurrentPassword
                                        ? "text"
                                        : "password"
                                }
                                value={currentPassword}
                                onChange={(event) =>
                                    setCurrentPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter current password"
                                autoComplete="current-password"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowCurrentPassword(
                                        !showCurrentPassword
                                    )
                                }
                            >
                                {showCurrentPassword
                                    ? <EyeOff size={20} />
                                    : <Eye size={20} />
                                }
                            </button>
                        </div>
                    </div>

                    <div className="password-field">
                        <label>New Password</label>

                        <div className="password-input-wrapper">
                            <LockKeyhole size={20} />

                            <input
                                type={
                                    showNewPassword
                                        ? "text"
                                        : "password"
                                }
                                value={newPassword}
                                onChange={(event) =>
                                    setNewPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter new password"
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowNewPassword(
                                        !showNewPassword
                                    )
                                }
                            >
                                {showNewPassword
                                    ? <EyeOff size={20} />
                                    : <Eye size={20} />
                                }
                            </button>
                        </div>

                        <small>
                            Password must contain at least 6 characters.
                        </small>
                    </div>

                    <div className="password-field">
                        <label>Confirm New Password</label>

                        <div className="password-input-wrapper">
                            <LockKeyhole size={20} />

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Confirm new password"
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                            >
                                {showConfirmPassword
                                    ? <EyeOff size={20} />
                                    : <Eye size={20} />
                                }
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="change-password-button"
                        disabled={loading}
                    >
                        <LockKeyhole size={20} />

                        {loading
                            ? "Changing Password..."
                            : "Change Password"
                        }
                    </button>

                </form>
            </div>

            <div className="security-tip">
                <ShieldCheck size={24} />

                <div>
                    <h3>Keep your account secure</h3>
                    <p>
                        Use a strong password that you do not use
                        on other websites. Never share your password
                        with anyone.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default SuperintendentSettings;
