import api from "../api/axios";

export const getAdminAppointments =
    async () =>
{
    const response =
        await api.get(
            "/appointments/admin"
        );

    return response.data;
};


export const getAdminAppointmentById =
    async (
        id
    ) =>
{
    const response =
        await api.get(
            `/appointments/admin/${id}`
        );

    return response.data;
};


export const updateAppointmentStatus =
    async (
        id,
        status
    ) =>
{
    const response =
        await api.patch(
            `/appointments/admin/${id}/status`,
            {
                status
            }
        );

    return response.data;
};