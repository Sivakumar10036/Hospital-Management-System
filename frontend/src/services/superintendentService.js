import api from "../api/axios";


// ============================================================
// SUPERINTENDENT DASHBOARD
// ============================================================

export const getSuperintendentDashboard =
async () =>
{
    const response =
        await api.get(
            "/superintendents/dashboard"
        );

    return response.data;
};


// ============================================================
// SUPERINTENDENT DOCTORS
// ============================================================

export const getSuperintendentDoctors =
async () =>
{
    const response =
        await api.get(
            "/superintendents/doctors"
        );

    return response.data;
};


// ============================================================
// SUPERINTENDENT PATIENTS
// ============================================================

export const getSuperintendentPatients =
async () =>
{
    const response =
        await api.get(
            "/superintendents/patients"
        );

    return response.data;
};


// ============================================================
// SUPERINTENDENT APPOINTMENTS
// ============================================================

export const getSuperintendentAppointments =
async () =>
{
    const response =
        await api.get(
            "/superintendents/appointments"
        );

    return response.data;
};


// ============================================================
// DEPARTMENT STATISTICS
// ============================================================

export const getDepartmentStatistics =
async () =>
{
    const response =
        await api.get(
            "/superintendents/departments/statistics"
        );

    return response.data;
};


// ============================================================
// EXPORT HOSPITAL APPOINTMENTS
// ============================================================

export const exportHospitalAppointments =
async () =>
{
    const response =
        await api.get(
            "/superintendents/appointments/export",
            {
                responseType: "blob"
            }
        );

    return response;
};


// ============================================================
// ADMIN - CREATE SUPERINTENDENT
// ============================================================

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


// ============================================================
// ADMIN - GET ALL SUPERINTENDENTS
// ============================================================

export const getAllSuperintendents =
async () =>
{
    const response =
        await api.get(
            "/superintendents"
        );

    return response.data;
};


// ============================================================
// ADMIN - GET SUPERINTENDENT BY ID
// ============================================================

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


// ============================================================
// ADMIN - UPDATE SUPERINTENDENT
// ============================================================

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


// ============================================================
// ADMIN - UPDATE SUPERINTENDENT STATUS
// ============================================================

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


// ============================================================
// SUPERINTENDENT - CHANGE OWN PASSWORD
// ============================================================

export const changeSuperintendentPassword =
async (
    passwordData
) =>
{
    const response =
        await api.put(
            "/superintendents/change-password",
            passwordData
        );

    return response.data;
};