import api
    from "../api/axios";


/*
|--------------------------------------------------------------------------
| Doctor Dashboard
|--------------------------------------------------------------------------
*/

export const getDoctorDashboard =
async () =>
{
    const response =
        await api.get(
            "/doctors/dashboard"
        );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Doctor Appointments
|--------------------------------------------------------------------------
*/

export const getDoctorAppointments =
async (
    params = {}
) =>
{
    const response =
        await api.get(
            "/doctors/appointments",
            {
                params
            }
        );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Doctor Appointment By ID
|--------------------------------------------------------------------------
*/

export const getDoctorAppointmentById =
async (
    id
) =>
{
    const response =
        await api.get(
            `/doctors/appointments/${id}`
        );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Update Appointment Status
|--------------------------------------------------------------------------
*/

export const updateAppointmentStatus =
async (
    id,
    data
) =>
{
    const response =
        await api.patch(
            `/doctors/appointments/${id}/status`,
            data
        );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Update Appointment Notes
|--------------------------------------------------------------------------
*/

export const updateAppointmentNotes =
async (
    id,
    notes
) =>
{
    const response =
        await api.patch(
            `/doctors/appointments/${id}/notes`,
            {
                notes
            }
        );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Doctor Schedule
|--------------------------------------------------------------------------
*/

export const getDoctorSchedule =
async () =>
{
    const response =
        await api.get(
            "/doctors/schedule"
        );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Doctor Availability
|--------------------------------------------------------------------------
*/

export const updateDoctorAvailability =
async (
    isAvailable
) =>
{
    const response =
        await api.patch(
            "/doctors/availability",
            {
                isAvailable
            }
        );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Export Doctor Appointments
|--------------------------------------------------------------------------
*/

export const exportDoctorAppointments =
async (
    params = {}
) =>
{
    const response =
        await api.get(
            "/doctors/appointments/export",
            {
                params,

                responseType:
                    "blob"
            }
        );

    return response;
};


/*
|--------------------------------------------------------------------------
| Activate / Deactivate Doctor
|--------------------------------------------------------------------------
|
| ADMIN and SUPERINTENDENT can use this.
|
|--------------------------------------------------------------------------
*/

export const updateDoctorStatus =
async (
    id,
    isActive
) =>
{
    const response =
        await api.patch(
            `/doctors/${id}/status`,
            {
                isActive
            }
        );

    return response.data;
};