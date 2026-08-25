import
{
    Navigate,
    Outlet
}
from "react-router-dom";


import useAuth
from "../../hooks/useAuth";


import
{
    getRoleDashboard
}
from "../../utils/roleRedirect";


const ProtectedRoute =
({
    allowedRoles
}) =>
{
    const
    {
        user,
        loading,
        isAuthenticated
    } =
        useAuth();


    if (
        loading
    )
    {
        return (
            <div
                className="auth-loading"
            >
                Loading...
            </div>
        );
    }


    if (
        !isAuthenticated
    )
    {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    const currentRole =
        user?.role
            ?.toString()
            .trim()
            .toUpperCase();


    const normalizedAllowedRoles =
        allowedRoles?.map(
            role =>
                role
                    ?.toString()
                    .trim()
                    .toUpperCase()
        );


    if (
        normalizedAllowedRoles &&
        !normalizedAllowedRoles.includes(
            currentRole
        )
    )
    {
        return (
            <Navigate
                to={
                    getRoleDashboard(
                        currentRole
                    )
                }
                replace
            />
        );
    }


    return (
        <Outlet />
    );
};


export default ProtectedRoute;