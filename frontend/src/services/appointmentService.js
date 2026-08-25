import api from "../api/axios";

const getAdminAppointments =
    async () =>
{
    const response =
        await api.get(
            "/appointments/admin"
        );

    return response.data;
};

const getAppointmentById =
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

const updateAppointmentStatus =
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

export {
    getAdminAppointments,
    getAppointmentById,
    updateAppointmentStatus
};