import {
    Link
}
from "react-router-dom";

import {
    Hospital,
    ArrowLeft,
    Mail
}
from "lucide-react";

const ForgotPassword =
() =>
{
    return (
        <div className="auth-page">

            <div
                className="auth-brand-panel"
            >
                <div
                    className="auth-brand-content"
                >
                    <div
                        className="auth-logo"
                    >
                        <Hospital
                            size={32}
                        />
                    </div>

                    <h1>
                        MediCare
                    </h1>

                    <h2>
                        Secure healthcare
                        management.
                    </h2>

                    <p>
                        Your account security is
                        important to us.
                    </p>
                </div>
            </div>

            <div
                className="auth-form-panel"
            >
                <div
                    className="auth-form-container"
                >
                    <Link
                        to="/login"
                        className="back-link"
                    >
                        <ArrowLeft
                            size={18}
                        />

                        Back to login
                    </Link>

                    <div
                        className="auth-heading"
                    >
                        <span>
                            Account recovery
                        </span>

                        <h1>
                            Forgot your password?
                        </h1>

                        <p>
                            Password recovery will
                            be enabled once the
                            backend recovery service
                            is implemented.
                        </p>
                    </div>

                    <div
                        className="forgot-info"
                    >
                        <Mail
                            size={22}
                        />

                        <div>
                            <strong>
                                Password recovery
                            </strong>

                            <p>
                                This feature will be
                                connected to the
                                hospital email service
                                in the next stage.
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/login"
                        className="auth-submit"
                    >
                        Return to Login

                        <ArrowLeft
                            size={19}
                        />
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default ForgotPassword;