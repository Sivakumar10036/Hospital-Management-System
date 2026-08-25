import React, {
    useEffect,
    useState
} from "react";

import {
    Users,
    UserRound,
    Building2,
    CalendarDays,
    CheckCircle2,
    XCircle,
    Clock3,
    UserX,
    Download,
    RefreshCw,
    FileBarChart
} from "lucide-react";

import api from "../../api/axios";


const AdminReports =
() =>
{
    const [
        statistics,
        setStatistics
    ] =
        useState(
        {
            totalDoctors: 0,
            activeDoctors: 0,
            inactiveDoctors: 0,
            totalPatients: 0,
            totalDepartments: 0,
            todayAppointments: 0,
            upcomingAppointments: 0,
            completedAppointments: 0,
            cancelledAppointments: 0,
            noShowAppointments: 0,
            totalAppointments: 0
        });


    const [
        loading,
        setLoading
    ] =
        useState(true);


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


    const loadReports =
        async () =>
    {
        try
        {
            setLoading(true);

            setError("");

            const response =
                await api.get(
                    "/admin/dashboard"
                );

            if (
                response.data?.success
            )
            {
                setStatistics(
                    response.data.dashboard?.statistics ||
                    {}
                );
            }
            else
            {
                setError(
                    "Unable to load report data"
                );
            }
        }
        catch (requestError)
        {
            console.error(
                "Reports error:",
                requestError
            );

            setError(
                requestError.response?.data?.message ||
                "Unable to load report data"
            );
        }
        finally
        {
            setLoading(false);
        }
    };


    useEffect(
        () =>
        {
            loadReports();
        },
        []
    );


    const downloadReport =
        async () =>
    {
        try
        {
            setExporting(true);

            const response =
                await api.get(
                    "/admin/appointments/export",
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
                `medicare-hospital-report-${new Date()
                    .toISOString()
                    .split("T")[0]}.xlsx`;


            document.body.appendChild(
                link
            );

            link.click();

            document.body.removeChild(
                link
            );

            window.URL.revokeObjectURL(
                url
            );
        }
        catch (requestError)
        {
            console.error(
                "Export report error:",
                requestError
            );

            alert(
                "Unable to download hospital report"
            );
        }
        finally
        {
            setExporting(false);
        }
    };


    const overviewCards =
    [
        {
            title:
                "Total Doctors",

            value:
                statistics.totalDoctors,

            icon:
                UserRound,

            className:
                "report-blue"
        },

        {
            title:
                "Total Patients",

            value:
                statistics.totalPatients,

            icon:
                Users,

            className:
                "report-green"
        },

        {
            title:
                "Departments",

            value:
                statistics.totalDepartments,

            icon:
                Building2,

            className:
                "report-purple"
        },

        {
            title:
                "Total Appointments",

            value:
                statistics.totalAppointments,

            icon:
                CalendarDays,

            className:
                "report-orange"
        }
    ];


    const appointmentCards =
    [
        {
            title:
                "Today's Appointments",

            value:
                statistics.todayAppointments,

            icon:
                CalendarDays,

            className:
                "report-blue"
        },

        {
            title:
                "Upcoming",

            value:
                statistics.upcomingAppointments,

            icon:
                Clock3,

            className:
                "report-orange"
        },

        {
            title:
                "Completed",

            value:
                statistics.completedAppointments,

            icon:
                CheckCircle2,

            className:
                "report-green"
        },

        {
            title:
                "Cancelled",

            value:
                statistics.cancelledAppointments,

            icon:
                XCircle,

            className:
                "report-red"
        },

        {
            title:
                "No Show",

            value:
                statistics.noShowAppointments,

            icon:
                UserX,

            className:
                "report-gray"
        }
    ];


    if (loading)
    {
        return (
            <div className="dashboard-page">

                <div className="reports-loading">

                    <RefreshCw
                        size={28}
                        className="reports-spinner"
                    />

                    <h2>
                        Loading reports...
                    </h2>

                    <p>
                        Preparing hospital statistics.
                    </p>

                </div>

            </div>
        );
    }


    return (
        <div className="dashboard-page">

            <div className="page-heading">

                <div>

                    <span className="page-eyebrow">
                        MEDICARE
                    </span>

                    <h1>
                        Hospital Reports
                    </h1>

                    <p>
                        Overview of hospital activity and performance.
                    </p>

                </div>


                <div className="reports-heading-actions">

                    <button
                        className="reports-refresh-button"
                        onClick={
                            loadReports
                        }
                    >

                        <RefreshCw
                            size={17}
                        />

                        Refresh

                    </button>


                    <button
                        className="reports-export-button"
                        onClick={
                            downloadReport
                        }
                        disabled={
                            exporting
                        }
                    >

                        <Download
                            size={17}
                        />

                        {
                            exporting
                                ?
                                "Preparing..."
                                :
                                "Export Report"
                        }

                    </button>

                </div>

            </div>


            {
                error &&
                (
                    <div className="reports-error">

                        {error}

                    </div>
                )
            }


            <div className="reports-section">

                <div className="reports-section-heading">

                    <div className="reports-section-icon">

                        <FileBarChart
                            size={20}
                        />

                    </div>

                    <div>

                        <h2>
                            Hospital Overview
                        </h2>

                        <p>
                            Current hospital resources and activity.
                        </p>

                    </div>

                </div>


                <div className="reports-overview-grid">

                    {
                        overviewCards.map(
                            card =>
                            {
                                const Icon =
                                    card.icon;

                                return (
                                    <div
                                        className="report-stat-card"
                                        key={
                                            card.title
                                        }
                                    >

                                        <div
                                            className={
                                                `report-stat-icon ${card.className}`
                                            }
                                        >

                                            <Icon
                                                size={22}
                                            />

                                        </div>


                                        <div className="report-stat-content">

                                            <span>
                                                {
                                                    card.title
                                                }
                                            </span>

                                            <strong>
                                                {
                                                    card.value || 0
                                                }
                                            </strong>

                                        </div>

                                    </div>
                                );
                            }
                        )
                    }

                </div>

            </div>


            <div className="reports-section">

                <div className="reports-section-heading">

                    <div className="reports-section-icon">

                        <CalendarDays
                            size={20}
                        />

                    </div>

                    <div>

                        <h2>
                            Appointment Statistics
                        </h2>

                        <p>
                            Breakdown of appointment activity.
                        </p>

                    </div>

                </div>


                <div className="reports-appointment-grid">

                    {
                        appointmentCards.map(
                            card =>
                            {
                                const Icon =
                                    card.icon;

                                return (
                                    <div
                                        className="report-appointment-card"
                                        key={
                                            card.title
                                        }
                                    >

                                        <div
                                            className={
                                                `report-appointment-icon ${card.className}`
                                            }
                                        >

                                            <Icon
                                                size={20}
                                            />

                                        </div>


                                        <div>

                                            <span>
                                                {
                                                    card.title
                                                }
                                            </span>

                                            <strong>
                                                {
                                                    card.value || 0
                                                }
                                            </strong>

                                        </div>

                                    </div>
                                );
                            }
                        )
                    }

                </div>

            </div>


            <div className="reports-bottom-grid">

                <div className="reports-panel">

                    <div className="reports-panel-header">

                        <div>

                            <h2>
                                Doctor Statistics
                            </h2>

                            <p>
                                Current medical staff status.
                            </p>

                        </div>

                        <UserRound
                            size={22}
                        />

                    </div>


                    <div className="doctor-report-row">

                        <div className="doctor-report-label">

                            <span className="report-dot active-dot">
                            </span>

                            Active Doctors

                        </div>

                        <strong>
                            {
                                statistics.activeDoctors ||
                                0
                            }
                        </strong>

                    </div>


                    <div className="doctor-report-row">

                        <div className="doctor-report-label">

                            <span className="report-dot inactive-dot">
                            </span>

                            Inactive Doctors

                        </div>

                        <strong>
                            {
                                statistics.inactiveDoctors ||
                                0
                            }
                        </strong>

                    </div>


                    <div className="doctor-report-total">

                        <span>
                            Total Doctors
                        </span>

                        <strong>
                            {
                                statistics.totalDoctors ||
                                0
                            }
                        </strong>

                    </div>

                </div>


                <div className="reports-panel">

                    <div className="reports-panel-header">

                        <div>

                            <h2>
                                Appointment Summary
                            </h2>

                            <p>
                                Overall appointment completion.
                            </p>

                        </div>

                        <CheckCircle2
                            size={22}
                        />

                    </div>


                    <div className="summary-number">

                        {
                            statistics.totalAppointments ||
                            0
                        }

                    </div>

                    <span className="summary-label">
                        Total Appointments
                    </span>


                    <div className="summary-progress">

                        <div
                            className="summary-progress-bar"
                            style={
                            {
                                width:
                                    statistics.totalAppointments
                                        ?
                                        `${Math.min(
                                            (
                                                statistics.completedAppointments /
                                                statistics.totalAppointments
                                            ) * 100,
                                            100
                                        )}%`
                                        :
                                        "0%"
                            }}
                        >
                        </div>

                    </div>


                    <div className="summary-footer">

                        <span>
                            Completed
                        </span>

                        <strong>
                            {
                                statistics.completedAppointments ||
                                0
                            }
                        </strong>

                    </div>

                </div>

            </div>


            <div className="reports-export-panel">

                <div className="reports-export-icon">

                    <Download
                        size={25}
                    />

                </div>


                <div className="reports-export-content">

                    <h2>
                        Download Hospital Report
                    </h2>

                    <p>
                        Export all hospital appointments into an Excel spreadsheet for analysis and record keeping.
                    </p>

                </div>


                <button
                    className="reports-export-large-button"
                    onClick={
                        downloadReport
                    }
                    disabled={
                        exporting
                    }
                >

                    <Download
                        size={17}
                    />

                    {
                        exporting
                            ?
                            "Generating..."
                            :
                            "Download Excel"
                    }

                </button>

            </div>

        </div>
    );
};


export default AdminReports;