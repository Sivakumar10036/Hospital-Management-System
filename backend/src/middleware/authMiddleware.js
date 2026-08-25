const jwt =
    require("jsonwebtoken");


const User =
    require("../models/User");


const protect =
    async (
        request,
        response,
        next
    ) =>
{
    try
    {
        const authorization =
            request.headers.authorization;


        if (
            !authorization ||
            !authorization.startsWith(
                "Bearer "
            )
        )
        {
            return response.status(401).json(
            {
                success: false,

                message:
                    "Authentication required"
            });
        }


        const token =
            authorization.split(" ")[1];


        const decodedToken =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        const user =
            await User.findById(
                decodedToken.userId
            )
            .select("-password");


        if (!user)
        {
            return response.status(401).json(
            {
                success: false,

                message:
                    "User not found"
            });
        }


        if (
            user.isActive === false
        )
        {
            return response.status(403).json(
            {
                success: false,

                message:
                    "Your account has been deactivated"
            });
        }


        request.user =
            user;


        next();
    }
    catch (error)
    {
        console.error(
            "Authentication error:",
            error.message
        );


        return response.status(401).json(
        {
            success: false,

            message:
                "Invalid or expired token"
        });
    }
};


module.exports =
    protect;