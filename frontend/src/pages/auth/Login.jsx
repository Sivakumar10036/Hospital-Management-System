import
{
    useState
}
from "react";


import
{
    Link,
    useNavigate
}
from "react-router-dom";


import
{
    Eye,
    EyeOff,
    Hospital,
    LockKeyhole,
    Mail,
    ArrowRight
}
from "lucide-react";


import useAuth
from "../../hooks/useAuth";


import
{
    getRoleDashboard
}
from "../../utils/roleRedirect";


const Login =
() =>
{
    const navigate =
        useNavigate();


    const {
        login
    } =
        useAuth();


    const [
        email,
        setEmail
    ] =
        useState("");


    const [
        password,
        setPassword
    ] =
        useState("");


    const [
        showPassword,
        setShowPassword
    ] =
        useState(false);


    const [
        error,
        setError
    ] =
        useState("");


    const [
        loading,
        setLoading
    ] =
        useState(false);


    const handleSubmit =
        async (
            event
        ) =>
        {
            event.preventDefault();


            setError("");


            if (
                !email.trim() ||
                !password
            )
            {
                setError(
                    "Please enter email and password."
                );

                return;
            }


            try
            {
                setLoading(true);


                const result =
                    await login(
                        email.trim(),
                        password
                    );


                console.log(
                    "LOGIN RESULT:",
                    result
                );


                if (
                    !result ||
                    !result.user
                )
                {
                    throw new Error(
                        "Invalid login response from server."
                    );
                }


                const userRole =
                    result.user.role
                        ?.toString()
                        .trim()
                        .toUpperCase();


                console.log(
                    "LOGGED IN USER:",
                    result.user
                );


                console.log(
                    "USER ROLE:",
                    userRole
                );


                const dashboard =
                    getRoleDashboard(
                        userRole
                    );


                console.log(
                    "REDIRECTING TO:",
                    dashboard
                );


                navigate(
                    dashboard,
                    {
                        replace: true
                    }
                );
            }
            catch (
                error
            )
            {
                console.error(
                    "LOGIN ERROR:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    error.message ||
                    "Login failed. Please check your credentials."
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
                        Hospital Management System
                    </h2>


                    <p>
                        A smarter and more connected
                        way to manage healthcare.
                    </p>


                    <div
                        className="auth-feature-list"
                    >

                        <div>
                            <span>
                                ✓
                            </span>

                            Secure patient management
                        </div>


                        <div>
                            <span>
                                ✓
                            </span>

                            Easy appointment booking
                        </div>


                        <div>
                            <span>
                                ✓
                            </span>

                            Professional doctor management
                        </div>

                    </div>

                </div>

            </div>


            <div
                className="auth-form-panel"
            >

                <div
                    className="auth-form-container"
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
                            Welcome back
                        </span>


                        <h1>
                            Sign in to your account
                        </h1>


                        <p>
                            Enter your credentials
                            to continue.
                        </p>

                    </div>


                    {error && (
                        <div
                            className="auth-error"
                        >
                            {error}
                        </div>
                    )}


                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >

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
                                    value={email}
                                    onChange={
                                        (event) =>
                                        {
                                            setEmail(
                                                event.target.value
                                            );
                                        }
                                    }
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                />

                            </div>

                        </div>


                        <div
                            className="form-group"
                        >

                            <div
                                className="password-label"
                            >

                                <label>
                                    Password
                                </label>


                                <Link
                                    to="/forgot-password"
                                >
                                    Forgot password?
                                </Link>

                            </div>


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
                                    value={password}
                                    onChange={
                                        (event) =>
                                        {
                                            setPassword(
                                                event.target.value
                                            );
                                        }
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                />


                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={
                                        () =>
                                        {
                                            setShowPassword(
                                                !showPassword
                                            );
                                        }
                                    }
                                >

                                    {showPassword ? (
                                        <EyeOff
                                            size={19}
                                        />
                                    ) : (
                                        <Eye
                                            size={19}
                                        />
                                    )}

                                </button>

                            </div>

                        </div>


                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Signing in..."
                                : "Sign In"
                            }


                            {!loading && (
                                <ArrowRight
                                    size={19}
                                />
                            )}

                        </button>

                    </form>


                    <div
                        className="auth-register"
                    >

                        Don't have an account?


                        <Link
                            to="/register"
                        >
                            Create account
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
};


export default Login;