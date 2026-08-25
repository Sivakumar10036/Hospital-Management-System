import api
    from "../api/axios";


export const loginUser =
    async (
        email,
        password
    ) =>
{
    const response =
        await api.post(
            "/auth/login",
            {
                email:
                    email.trim().toLowerCase(),

                password
            }
        );

    return response.data;
};


export const registerUser =
    async (
        userData
    ) =>
{
    const response =
        await api.post(
            "/auth/register",
            userData
        );

    return response.data;
};


export const getCurrentUser =
    async () =>
{
    const response =
        await api.get(
            "/auth/me"
        );

    return response.data;
};