    import React,
{
    useEffect,
    useMemo,
    useState
}
from "react";

import
{
    Search,
    RefreshCw,
    CalendarDays,
    Clock3,
    UserRound,
    Stethoscope,
    Building2,
    Eye,
    X,
    Download,
    CheckCircle,
    XCircle,
    AlertCircle
}
from "lucide-react";

import api
    from "../../api/axios";

import
    "../../styles/SuperintendentAppointments.css";


const SuperintendentAppointments =
() =>
{
    const [
        appointments,
        setAppointments
    ] =
        useState([]);


    const [
        loading,
        setLoading
    ] =
        useState(true);


    const [
        refreshing,
        setRefreshing
    ] =
        useState(false);


    const [
        exporting,
        setExporting
    ] =
        useState(false);


    const [
        error,
        setError
    ] =
        useState("");


    const [
        searchTerm,
        setSearchTerm
    ] =
        useState("");


    const [
        statusFilter,
        setStatusFilter
    ] =
        useState("ALL");


    const [
        selectedAppointment,
        setSelectedAppointment
    ] =
        useState(null);


    const fetchAppointments =
    async (
        showRefresh = false
    ) =>
    {
        try
        {
            if (showRefresh)
            {
                setRefreshing(true);
            }
            else
            {
                setLoading(true);
            }

            setError("");


            const response =
                await api.get(
                    "/superintendents/appointments"
                );


            if (
                response.data?.success
            )
            {
                setAppointments(
                    response.data.appointments ||
                    []
                );
            }
            else
            {
                setError(
                    response.data?.message ||
                    "Unable to fetch appointments"
                );
            }
        }
        catch (requestError)
        {
            console.error(
                "Fetch superintendent appointments error:",
                requestError
            );


            setError(
                requestError.response?.data?.message ||
                "Unable to load appointments"
            );
        }
        finally
        {
            setLoading(false);
            setRefreshing(false);
        }
    };


    useEffect(
        () =>
        {
            fetchAppointments();
        },
        []
    );


    const getPatientName =
    appointment =>
    {
        return (
            appointment.patient?.user?.name ||
            appointment.patient?.name ||
            appointment.patientName ||
            "Patient"
        );
    };


    const getDoctorName =
    appointment =>
    {
        let doctorName =
            appointment.doctor?.user?.name ||
            appointment.doctor?.name ||
            appointment.doctorName ||
            "Doctor";

        doctorName =
            String(
                doctorName
            )
                .trim();

        const imageMarker =
            "profilePhoto File Select doctor image:";

        const lowerDoctorName =
            doctorName.toLowerCase();

        const lowerImageMarker =
            imageMarker.toLowerCase();

        const imageMarkerIndex =
            lowerDoctorName.lastIndexOf(
                lowerImageMarker
            );

        if (
            imageMarkerIndex !== -1
        )
        {
            doctorName =
                doctorName
                    .substring(
                        imageMarkerIndex +
                        imageMarker.length
                    )
                    .trim();
        }

        const doctorMatches =
            [
                ...doctorName.matchAll(
                    /\bdr\.\s*/gi
                )
            ];

        if (
            doctorMatches.length > 0
        )
        {
            const lastDoctorMatch =
                doctorMatches[
                    doctorMatches.length - 1
                ];

            doctorName =
                doctorName
                    .substring(
                        lastDoctorMatch.index +
                        lastDoctorMatch[0].length
                    )
                    .trim();
        }

        doctorName =
            doctorName
                .replace(
                    /^[:\-\s]+/,
                    ""
                )
                .replace(
                    /\s+/g,
                    " "
                )
                .trim();

        return doctorName || "Doctor";
    };


    const getDepartmentName =
    appointment =>
    {
        return (
            appointment.department?.name ||
            appointment.departmentName ||
            "General"
        );
    };


    const getPatientId =
    appointment =>
    {
        return (
            appointment.patient?.patientId ||
            appointment.patientId ||
            "N/A"
        );
    };


    const getDoctorId =
    appointment =>
    {
        return (
            appointment.doctor?.doctorId ||
            appointment.doctorId ||
            "N/A"
        );
    };


    const formatDate =
    date =>
    {
        if (!date)
        {
            return "Not provided";
        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        )
        {
            return "Not provided";
        }


        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day:
                    "2-digit",

                month:
                    "short",

                year:
                    "numeric"
            }
        );
    };


    const getStatusClass =
    status =>
    {
        switch (
            status?.toUpperCase()
        )
        {
            case "CONFIRMED":
                return "confirmed";

            case "COMPLETED":
                return "completed";

            case "CANCELLED":
                return "cancelled";

            case "NO_SHOW":
                return "no-show";

            default:
                return "booked";
        }
    };


    const getStatusIcon =
    status =>
    {
        switch (
            status?.toUpperCase()
        )
        {
            case "CONFIRMED":

                return (
                    <CheckCircle
                        size={14}
                    />
                );


            case "COMPLETED":

                return (
                    <CheckCircle
                        size={14}
                    />
                );


            case "CANCELLED":

                return (
                    <XCircle
                        size={14}
                    />
                );


            case "NO_SHOW":

                return (
                    <AlertCircle
                        size={14}
                    />
                );


            default:

                return (
                    <Clock3
                        size={14}
                    />
                );
        }
    };


    const getStatusText =
    status =>
    {
        switch (
            status?.toUpperCase()
        )
        {
            case "NO_SHOW":
                return "No Show";

            case "CANCELLED":
                return "Cancelled";

            case "COMPLETED":
                return "Completed";

            case "CONFIRMED":
                return "Confirmed";

            default:
                return "Booked";
        }
    };


    const filteredAppointments =
        useMemo(
            () =>
            {
                const search =
                    searchTerm
                        .trim()
                        .toLowerCase();


                return appointments.filter(
                    appointment =>
                    {
                        const patientName =
                            getPatientName(
                                appointment
                            )
                                .toLowerCase();


                        const doctorName =
                            getDoctorName(
                                appointment
                            )
                                .toLowerCase();


                        const patientId =
                            getPatientId(
                                appointment
                            )
                                .toLowerCase();


                        const doctorId =
                            getDoctorId(
                                appointment
                            )
                                .toLowerCase();


                        const appointmentId =
                            (
                                appointment.appointmentId ||
                                ""
                            )
                                .toLowerCase();


                        const department =
                            getDepartmentName(
                                appointment
                            )
                                .toLowerCase();


                        const matchesSearch =
                            !search ||
                            patientName.includes(
                                search
                            ) ||
                            doctorName.includes(
                                search
                            ) ||
                            patientId.includes(
                                search
                            ) ||
                            doctorId.includes(
                                search
                            ) ||
                            appointmentId.includes(
                                search
                            ) ||
                            department.includes(
                                search
                            );


                        const matchesStatus =
                            statusFilter ===
                            "ALL"
                            ||
                            appointment.status?.toUpperCase() ===
                            statusFilter;


                        return (
                            matchesSearch &&
                            matchesStatus
                        );
                    }
                );
            },
            [
                appointments,
                searchTerm,
                statusFilter
            ]
        );


    const exportAppointments =
    async () =>
    {
        try
        {
            setExporting(true);


            const response =
                await api.get(
                    "/superintendents/appointments/export",
                    {
                        responseType:
                            "blob"
                    }
                );


            const blob =
                new Blob(
                    [
                        response.data
                    ],
                    {
                        type:
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    }
                );


            const url =
                window.URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                "hospital-appointments.xlsx";


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


            window.URL.revokeObjectURL(
                url
            );
        }
        catch (requestError)
        {
            console.error(
                "Export appointments error:",
                requestError
            );


            setError(
                requestError.response?.data?.message ||
                "Unable to export appointments"
            );
        }
        finally
        {
            setExporting(false);
        }
    };


    return (
        <div
            className=
                "superintendent-appointments-page"
        >

            <div
                className=
                    "superintendent-appointments-container"
            >


                {/* HEADER */}

                <div
                    className=
                        "superintendent-appointments-header"
                >

                    <div>

                        <span
                            className=
                                "superintendent-appointments-eyebrow"
                        >
                            HOSPITAL MANAGEMENT
                        </span>


                        <h1>
                            Appointments
                        </h1>


                        <p>
                            View and monitor all
                            hospital appointments.
                        </p>

                    </div>


                    <div
                        className=
                            "superintendent-appointments-header-actions"
                    >

                        <button
                            className=
                                "superintendent-appointments-export"
                            onClick={
                                exportAppointments
                            }
                            disabled={
                                exporting
                            }
                        >

                            <Download
                                size={16}
                            />

                            {
                                exporting
                                    ?
                                    "Exporting..."
                                    :
                                    "Export"
                            }

                        </button>


                        <button
                            className=
                                "superintendent-appointments-refresh"
                            onClick={
                                () =>
                                    fetchAppointments(
                                        true
                                    )
                            }
                            disabled={
                                refreshing
                            }
                        >

                            <RefreshCw
                                size={16}
                                className={
                                    refreshing
                                        ?
                                        "superintendent-appointments-spin"
                                        :
                                        ""
                                }
                            />

                            Refresh

                        </button>

                    </div>

                </div>


                {/* ERROR */}

                {
                    error &&
                    (
                        <div
                            className=
                                "superintendent-appointments-error"
                        >

                            <span>
                                {error}
                            </span>


                            <button
                                onClick={
                                    () =>
                                        fetchAppointments()
                                }
                            >
                                Try Again
                            </button>

                        </div>
                    )
                }


                {/* TOOLBAR */}

                <div
                    className=
                        "superintendent-appointments-toolbar"
                >

                    <div
                        className=
                            "superintendent-appointments-search"
                    >

                        <Search
                            size={18}
                        />


                        <input
                            type="text"
                            placeholder="Search patient, doctor, appointment ID..."
                            value={
                                searchTerm
                            }
                            onChange={
                                event =>
                                    setSearchTerm(
                                        event.target.value
                                    )
                            }
                        />


                        {
                            searchTerm &&
                            (
                                <button
                                    className=
                                        "superintendent-appointments-clear"
                                    onClick={
                                        () =>
                                            setSearchTerm(
                                                ""
                                            )
                                    }
                                >

                                    <X
                                        size={16}
                                    />

                                </button>
                            )
                        }

                    </div>


                    <select
                        className=
                            "superintendent-appointments-filter"
                        value={
                            statusFilter
                        }
                        onChange={
                            event =>
                                setStatusFilter(
                                    event.target.value
                                )
                        }
                    >

                        <option value="ALL">
                            All Status
                        </option>

                        <option value="BOOKED">
                            Booked
                        </option>

                        <option value="CONFIRMED">
                            Confirmed
                        </option>

                        <option value="COMPLETED">
                            Completed
                        </option>

                        <option value="CANCELLED">
                            Cancelled
                        </option>

                        <option value="NO_SHOW">
                            No Show
                        </option>

                    </select>


                    <div
                        className=
                            "superintendent-appointments-count"
                    >

                        <CalendarDays
                            size={18}
                        />

                        <strong>
                            {
                                filteredAppointments.length
                            }
                        </strong>

                        <span>
                            {
                                filteredAppointments.length === 1
                                    ?
                                    "Appointment"
                                    :
                                    "Appointments"
                            }
                        </span>

                    </div>

                </div>


                {/* TABLE */}

                <div
                    className=
                        "superintendent-appointments-card"
                >

                    {
                        loading &&
                        (
                            <div
                                className=
                                    "superintendent-appointments-loading"
                            >

                                <RefreshCw
                                    size={30}
                                    className=
                                        "superintendent-appointments-spin"
                                />

                                <p>
                                    Loading appointments...
                                </p>

                            </div>
                        )
                    }


                    {
                        !loading &&
                        !error &&
                        filteredAppointments.length === 0 &&
                        (
                            <div
                                className=
                                    "superintendent-appointments-empty"
                            >

                                <div
                                    className=
                                        "superintendent-appointments-empty-icon"
                                >

                                    <CalendarDays
                                        size={35}
                                    />

                                </div>


                                <h3>
                                    No Appointments Found
                                </h3>


                                <p>
                                    {
                                        searchTerm ||
                                        statusFilter !== "ALL"
                                            ?
                                            "No appointments match your current filters."
                                            :
                                            "No hospital appointments are available."
                                    }
                                </p>

                            </div>
                        )
                    }


                    {
                        !loading &&
                        !error &&
                        filteredAppointments.length > 0 &&
                        (
                            <div
                                className=
                                    "superintendent-appointments-table-wrapper"
                            >

                                <table
                                    className=
                                        "superintendent-appointments-table"
                                >

                                    <thead>

                                        <tr>

                                            <th>
                                                APPOINTMENT
                                            </th>

                                            <th>
                                                PATIENT
                                            </th>

                                            <th>
                                                DOCTOR
                                            </th>

                                            <th>
                                                DEPARTMENT
                                            </th>

                                            <th>
                                                DATE
                                            </th>

                                            <th>
                                                TIME
                                            </th>

                                            <th>
                                                STATUS
                                            </th>

                                            <th>
                                                ACTION
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {
                                            filteredAppointments.map(
                                                appointment =>
                                                {
                                                    return (
                                                        <tr
                                                            key={
                                                                appointment._id ||
                                                                appointment.appointmentId
                                                            }
                                                        >

                                                            <td>

                                                                <div
                                                                    className=
                                                                        "superintendent-appointment-id"
                                                                >

                                                                    <CalendarDays
                                                                        size={15}
                                                                    />

                                                                    <span>
                                                                        {
                                                                            appointment.appointmentId ||
                                                                            "N/A"
                                                                        }
                                                                    </span>

                                                                </div>

                                                            </td>


                                                            <td>

                                                                <div
                                                                    className=
                                                                        "superintendent-appointment-person"
                                                                >

                                                                    <div
                                                                        className=
                                                                            "superintendent-appointment-avatar patient"
                                                                    >

                                                                        <UserRound
                                                                            size={17}
                                                                        />

                                                                    </div>


                                                                    <div>

                                                                        <strong>
                                                                            {
                                                                                getPatientName(
                                                                                    appointment
                                                                                )
                                                                            }
                                                                        </strong>

                                                                        <span>
                                                                            {
                                                                                getPatientId(
                                                                                    appointment
                                                                                )
                                                                            }
                                                                        </span>

                                                                    </div>

                                                                </div>

                                                            </td>


                                                            <td>

                                                                <div
                                                                    className=
                                                                        "superintendent-appointment-person"
                                                                >

                                                                    <div
                                                                        className=
                                                                            "superintendent-appointment-avatar doctor"
                                                                    >

                                                                        <Stethoscope
                                                                            size={17}
                                                                        />

                                                                    </div>


                                                                    <div>

                                                                        <strong>
                                                                            Dr.{" "}
                                                                            {
                                                                                getDoctorName(
                                                                                    appointment
                                                                                )
                                                                            }
                                                                        </strong>

                                                                        <span>
                                                                            {
                                                                                getDoctorId(
                                                                                    appointment
                                                                                )
                                                                            }
                                                                        </span>

                                                                    </div>

                                                                </div>

                                                            </td>


                                                            <td>

                                                                <div
                                                                    className=
                                                                        "superintendent-appointment-department"
                                                                >

                                                                    <Building2
                                                                        size={15}
                                                                    />

                                                                    {
                                                                        getDepartmentName(
                                                                            appointment
                                                                        )
                                                                    }

                                                                </div>

                                                            </td>


                                                            <td>

                                                                <div
                                                                    className=
                                                                        "superintendent-appointment-date"
                                                                >

                                                                    <CalendarDays
                                                                        size={15}
                                                                    />

                                                                    {
                                                                        formatDate(
                                                                            appointment.appointmentDate
                                                                        )
                                                                    }

                                                                </div>

                                                            </td>


                                                            <td>

                                                                <div
                                                                    className=
                                                                        "superintendent-appointment-time"
                                                                >

                                                                    <Clock3
                                                                        size={15}
                                                                    />

                                                                    {
                                                                        appointment.appointmentTime ||
                                                                        appointment.startTime ||
                                                                        "—"
                                                                    }

                                                                </div>

                                                            </td>


                                                            <td>

                                                                <span
                                                                    className={
                                                                        `superintendent-appointment-status ${
                                                                            getStatusClass(
                                                                                appointment.status
                                                                            )
                                                                        }`
                                                                    }
                                                                >

                                                                    {
                                                                        getStatusIcon(
                                                                            appointment.status
                                                                        )
                                                                    }

                                                                    {
                                                                        getStatusText(
                                                                            appointment.status
                                                                        )
                                                                    }

                                                                </span>

                                                            </td>


                                                            <td>

                                                                <button
                                                                    className=
                                                                        "superintendent-appointment-view-button"
                                                                    onClick={
                                                                        () =>
                                                                            setSelectedAppointment(
                                                                                appointment
                                                                            )
                                                                    }
                                                                >

                                                                    <Eye
                                                                        size={16}
                                                                    />

                                                                    View

                                                                </button>

                                                            </td>

                                                        </tr>
                                                    );
                                                }
                                            )
                                        }

                                    </tbody>

                                </table>

                            </div>
                        )
                    }

                </div>

            </div>


            {/* DETAILS MODAL */}

            {
                selectedAppointment &&
                (
                    <div
                        className=
                            "superintendent-appointment-modal-overlay"

                        onClick={
                            () =>
                                setSelectedAppointment(
                                    null
                                )
                        }
                    >

                        <div
                            className=
                                "superintendent-appointment-modal"

                            onClick={
                                event =>
                                    event.stopPropagation()
                            }
                        >

                            <div
                                className=
                                    "superintendent-appointment-modal-header"
                            >

                                <div>

                                    <span>
                                        APPOINTMENT DETAILS
                                    </span>

                                    <h2>
                                        {
                                            selectedAppointment.appointmentId ||
                                            "Appointment"
                                        }
                                    </h2>

                                </div>


                                <button
                                    onClick={
                                        () =>
                                            setSelectedAppointment(
                                                null
                                            )
                                    }
                                >

                                    <X
                                        size={20}
                                    />

                                </button>

                            </div>


                            <div
                                className=
                                    "superintendent-appointment-modal-body"
                            >

                                <div
                                    className=
                                        "superintendent-appointment-detail-header"
                                >

                                    <div
                                        className=
                                            "superintendent-appointment-detail-icon"
                                    >

                                        <CalendarDays
                                            size={26}
                                        />

                                    </div>


                                    <div>

                                        <h3>
                                            Appointment
                                        </h3>

                                        <p>
                                            {
                                                formatDate(
                                                    selectedAppointment.appointmentDate
                                                )
                                            }

                                            {" • "}

                                            {
                                                selectedAppointment.appointmentTime ||
                                                selectedAppointment.startTime ||
                                                "Time not available"
                                            }
                                        </p>

                                    </div>

                                </div>


                                <div
                                    className=
                                        "superintendent-appointment-detail-grid"
                                >

                                    <div>

                                        <span>
                                            <UserRound
                                                size={15}
                                            />

                                            Patient
                                        </span>

                                        <strong>
                                            {
                                                getPatientName(
                                                    selectedAppointment
                                                )
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            <Stethoscope
                                                size={15}
                                            />

                                            Doctor
                                        </span>

                                        <strong>
                                            Dr.{" "}
                                            {
                                                getDoctorName(
                                                    selectedAppointment
                                                )
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            <Building2
                                                size={15}
                                            />

                                            Department
                                        </span>

                                        <strong>
                                            {
                                                getDepartmentName(
                                                    selectedAppointment
                                                )
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            <CalendarDays
                                                size={15}
                                            />

                                            Appointment Date
                                        </span>

                                        <strong>
                                            {
                                                formatDate(
                                                    selectedAppointment.appointmentDate
                                                )
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            <Clock3
                                                size={15}
                                            />

                                            Appointment Time
                                        </span>

                                        <strong>
                                            {
                                                selectedAppointment.appointmentTime ||
                                                selectedAppointment.startTime ||
                                                "Not provided"
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Consultation Fee
                                        </span>

                                        <strong>
                                            ₹
                                            {
                                                Number(
                                                    selectedAppointment.consultationFee ||
                                                    0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Patient ID
                                        </span>

                                        <strong>
                                            {
                                                getPatientId(
                                                    selectedAppointment
                                                )
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Doctor ID
                                        </span>

                                        <strong>
                                            {
                                                getDoctorId(
                                                    selectedAppointment
                                                )
                                            }
                                        </strong>

                                    </div>

                                </div>


                                {
                                    selectedAppointment.reason &&
                                    (
                                        <div
                                            className=
                                                "superintendent-appointment-reason"
                                        >

                                            <span>
                                                Reason
                                            </span>

                                            <p>
                                                {
                                                    selectedAppointment.reason
                                                }
                                            </p>

                                        </div>
                                    )
                                }


                                {
                                    selectedAppointment.symptoms &&
                                    (
                                        <div
                                            className=
                                                "superintendent-appointment-reason"
                                        >

                                            <span>
                                                Symptoms
                                            </span>

                                            <p>
                                                {
                                                    selectedAppointment.symptoms
                                                }
                                            </p>

                                        </div>
                                    )
                                }

                            </div>


                            <div
                                className=
                                    "superintendent-appointment-modal-footer"
                            >

                                <span
                                    className={
                                        `superintendent-appointment-status ${
                                            getStatusClass(
                                                selectedAppointment.status
                                            )
                                        }`
                                    }
                                >

                                    {
                                        getStatusIcon(
                                            selectedAppointment.status
                                        )
                                    }

                                    {
                                        getStatusText(
                                            selectedAppointment.status
                                        )
                                    }

                                </span>


                                <button
                                    onClick={
                                        () =>
                                            setSelectedAppointment(
                                                null
                                            )
                                    }
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>
                )
            }

        </div>
    );
};


export default SuperintendentAppointments;