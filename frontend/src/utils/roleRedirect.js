export const getRoleDashboard =
    (
        role
    ) =>
{
    const normalizedRole =
        role
            ?.toString()
            .trim()
            .toUpperCase();


    switch (
        normalizedRole
    )
    {
        case "ADMIN":

            return "/admin";


        case "SUPERINTENDENT":

            return "/superintendent";


        case "DOCTOR":

            return "/doctor";


        case "PATIENT":

            return "/patient";


        default:

            return "/login";
    }
};