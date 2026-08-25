import React, {
    useState
}
from "react";

import {
    Link,
    useNavigate
}
from "react-router-dom";

import {
    Hospital,
    UserRound,
    Mail,
    Phone,
    LockKeyhole,
    Eye,
    EyeOff,
    ArrowRight
}
from "lucide-react";

import useAuth
from "../../hooks/useAuth";

import {
    validateEmail,
    validatePassword,
    validatePhone
}
from "../../utils/validators";


const Register =
() =>
{
    const navigate =
        useNavigate();

    const {
        register
    } =
        useAuth();


    const [
        formData,
        setFormData
    ] =
        useState(
        {
            fullName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: ""
        });


    const [
        showPassword,
        setShowPassword
    ] =
        useState(false);


    const [
        showConfirmPassword,
        setShowConfirmPassword
    ] =
        useState(false);


    const [
        error,
        setError
    ] =
        useState("");


    const [
        success,
        setSuccess
    ] =
        useState("");


    const [
        loading,
        setLoading
    ] =
        useState(false);


    const handleChange =
        (event) =>
        {
            const {
                name,
                value
            } =
                event.target;


            setFormData(
            {
                ...formData,

                [name]:
                    value
            });
        };


    const handleSubmit =
        async (
            event
        ) =>
        {
            event.preventDefault();

            setError("");

            setSuccess("");


            if (
                !formData.fullName.trim()
            )
            {
                setError(
                    "Please enter your full name."
                );

                return;
            }


            if (
                !validateEmail(
                    formData.email
                )
            )
            {
                setError(
                    "Please enter a valid email address."
                );

                return;
            }


            if (
                !validatePhone(
                    formData.phone
                )
            )
            {
                setError(
                    "Please enter a valid 10-digit phone number."
                );

                return;
            }


            if (
                !validatePassword(
                    formData.password
                )
            )
            {
                setError(
                    "Password must contain at least 6 characters."
                );

                return;
            }


            if (
                formData.password !==
                formData.confirmPassword
            )
            {
                setError(
                    "Passwords do not match."
                );

                return;
            }


            try
            {
                setLoading(true);


                await register(
                {
                    name:
                        formData.fullName.trim(),

                    email:
                        formData.email.trim(),

                    phone:
                        formData.phone.trim(),

                    password:
                        formData.password,

                    role:
                        "PATIENT"
                });


                setSuccess(
                    "Registration successful. Redirecting to login..."
                );


                setTimeout(
                    () =>
                    {
                        navigate(
                            "/login"
                        );
                    },
                    1200
                );
            }
            catch (error)
            {
                setError(
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Registration failed. Please try again."
                );
            }
            finally
            {
                setLoading(false);
            }
        };


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
                        Your healthcare,
                        simplified.
                    </h2>


                    <p>
                        Create your patient account
                        and manage your appointments
                        easily.
                    </p>

                </div>

            </div>


            <div
                className="auth-form-panel"
            >

                <div
                    className="auth-form-container register-container"
                >

                    <div
                        className="mobile-auth-logo"
                    >

                        <Hospital
                            size={28}
                        />

                        <span>
                            MediCare
                        </span>

                    </div>


                    <div
                        className="auth-heading"
                    >

                        <span>
                            Get started
                        </span>


                        <h1>
                            Create your account
                        </h1>


                        <p>
                            Register as a patient
                            to book appointments.
                        </p>

                    </div>


                    {
                        error &&
                        (
                            <div
                                className="auth-error"
                            >
                                {error}
                            </div>
                        )
                    }


                    {
                        success &&
                        (
                            <div
                                className="auth-success"
                            >
                                {success}
                            </div>
                        )
                    }


                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >

                        <div
                            className="form-group"
                        >

                            <label>
                                Full Name
                            </label>


                            <div
                                className="input-wrapper"
                            >

                                <UserRound
                                    size={19}
                                />


                                <input
                                    type="text"
                                    name="fullName"
                                    value={
                                        formData.fullName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter your full name"
                                />

                            </div>

                        </div>


                        <div
                            className="form-group"
                        >

                            <label>
                                Email Address
                            </label>


                            <div
                                className="input-wrapper"
                            >

                                <Mail
                                    size={19}
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
                                    placeholder="Enter your email"
                                />

                            </div>

                        </div>


                        <div
                            className="form-group"
                        >

                            <label>
                                Phone Number
                            </label>


                            <div
                                className="input-wrapper"
                            >

                                <Phone
                                    size={19}
                                />


                                <input
                                    type="tel"
                                    name="phone"
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="10-digit phone number"
                                    maxLength="10"
                                />

                            </div>

                        </div>


                        <div
                            className="form-group"
                        >

                            <label>
                                Password
                            </label>


                            <div
                                className="input-wrapper"
                            >

                                <LockKeyhole
                                    size={19}
                                />


                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={
                                        formData.password
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Create a password"
                                />


                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={
                                        () =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                    }
                                >

                                    {
                                        showPassword
                                        ?
                                        (
                                            <EyeOff
                                                size={19}
                                            />
                                        )
                                        :
                                        (
                                            <Eye
                                                size={19}
                                            />
                                        )
                                    }

                                </button>

                            </div>

                        </div>


                        <div
                            className="form-group"
                        >

                            <label>
                                Confirm Password
                            </label>


                            <div
                                className="input-wrapper"
                            >

                                <LockKeyhole
                                    size={19}
                                />


                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    value={
                                        formData.confirmPassword
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Confirm your password"
                                />


                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={
                                        () =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                    }
                                >

                                    {
                                        showConfirmPassword
                                        ?
                                        (
                                            <EyeOff
                                                size={19}
                                            />
                                        )
                                        :
                                        (
                                            <Eye
                                                size={19}
                                            />
                                        )
                                    }

                                </button>

                            </div>

                        </div>


                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={
                                loading
                            }
                        >

                            {
                                loading
                                ?
                                "Creating account..."
                                :
                                "Create Patient Account"
                            }


                            {
                                !loading &&
                                (
                                    <ArrowRight
                                        size={19}
                                    />
                                )
                            }

                        </button>

                    </form>


                    <div
                        className="auth-register"
                    >

                        Already have an account?


                        <Link
                            to="/login"
                        >
                            Sign in
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
};


export default Register;