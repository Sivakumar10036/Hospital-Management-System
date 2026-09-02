import api from "../api/axios";


export const getDoctors = async () =>
{
    const response =
        await api.get(
            "/admin/doctors"
        );

    return response.data;
};


export const getDepartments = async () =>
{
    const response =
        await api.get(
            "/admin/departments"
        );

    return response.data;
};


export const getDoctorById = async (
    doctorId
) =>
{
    const response =
        await api.get(
            `/admin/doctors/${doctorId}`
        );

    return response.data;
};


export const createDoctor = async (
    doctorData
) =>
{
    const response =
        await api.post(
            "/admin/doctors",
            doctorData,
            {
                headers:
                {
                    "Content-Type":
                        "multipart/form-data"
                }
            }
        );

    return response.data;
};


export const updateDoctor = async (
    doctorId,
    doctorData
) =>
{
    const response =
        await api.put(
            `/admin/doctors/${doctorId}`,
            doctorData,
            {
                headers:
                {
                    "Content-Type":
                        "multipart/form-data"
                }
            }
        );

    return response.data;
};


export const updateDoctorStatus = async (
    doctorId,
    isActive
) =>
{
    const response =
        await api.patch(
            `/admin/doctors/${doctorId}/status`,
            {
                isActive
            }
        );

    return response.data;
};