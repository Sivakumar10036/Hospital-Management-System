const authorizeRoles =
    (
        ...allowedRoles
    ) =>
{
    return (
        request,
        response,
        next
    ) =>
    {
        if (!request.user)
        {
            return response.status(401).json(
            {
                success: false,
                message:
                    "Authentication required"
            });
        }


        const currentRole =
            request.user.role
                ?.toString()
                .trim()
                .toUpperCase();


        const normalizedRoles =
            allowedRoles.map(
                (
                    role
                ) =>
                    role
                        ?.toString()
                        .trim()
                        .toUpperCase()
            );


        if (
            !normalizedRoles.includes(
                currentRole
            )
        )
        {
            return response.status(403).json(
            {
                success: false,
                message:
                    "You do not have permission to perform this action"
            });
        }


        next();
    };
};


module.exports =
    authorizeRoles;