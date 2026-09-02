import api from "../api/axios";

export const getSuperintendentDashboard =
    async () =>
{
    const response =
        await api.get(
            "/superintendents/dashboard"
        );

    return response.data;
};

export const getSuperintendentDoctors =
    async () =>
{
    const response =
        await api.get(
            "/superintendents/doctors"
        );

    return response.data;
};

export const getSuperintendentPatients =
    async () =>
{
    const response =
        await api.get(
            "/superintendents/patients"
        );

    return response.data;
};

export const getSuperintendentAppointments =
    async () =>
{
    const response =
        await api.get(
            "/superintendents/appointments"
        );

    return response.data;
};

export const getDepartmentStatistics =
    async () =>
{
    const response =
        await api.get(
            "/superintendents/departments/statistics"
        );

    return response.data;
};

export const exportHospitalAppointments =
    async () =>
{
    const response =
        await api.get(
            "/superintendents/appointments/export",
            {
                responseType:
                    "blob"
            }
        );

    return response;
};

export const createSuperintendent =
    async (
        superintendentData
    ) =>
{
    const response =
        await api.post(
            "/superintendents",
            superintendentData
        );

    return response.data;
};

export const getAllSuperintendents =
    async () =>
{
    const response =
        await api.get(
            "/superintendents"
        );

    return response.data;
};

export const getSuperintendentById =
    async (
        id
    ) =>
{
    const response =
        await api.get(
            `/superintendents/${id}`
        );

    return response.data;
};

export const updateSuperintendent =
    async (
        id,
        superintendentData
    ) =>
{
    const response =
        await api.put(
            `/superintendents/${id}`,
            superintendentData
        );

    return response.data;
};

export const updateSuperintendentStatus =
    async (
        id,
        statusData
    ) =>
{
    const response =
        await api.patch(
            `/superintendents/${id}/status`,
            statusData
        );

    return response.data;
};

export const changeSuperintendentPassword =
    async (
        passwordData
    ) =>
{
    const response =
        await api.patch(
            "/superintendents/change-password",
            passwordData
        );

    return response.data;
};