import React,
{
    useEffect,
    useState
}
from "react";

import
{
    BarChart3,
    Users,
    Stethoscope,
    CalendarDays,
    CheckCircle2,
    XCircle,
    Clock3,
    UserX,
    RefreshCw,
    Download,
    AlertCircle
}
from "lucide-react";

import api
from "../../api/axios";

import "../../styles/SuperintendentReports.css";


const SuperintendentReports =
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
            totalSuperintendents: 0,
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


    const fetchReports =
        async (
            showRefresh =
                false
        ) =>
        {
            try
            {
                if (
                    showRefresh
                )
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
                        "/superintendents/dashboard"
                    );


                const dashboard =
                    response.data
                        ?.dashboard;


                const receivedStatistics =
                    dashboard
                        ?.statistics ||
                    {};


                setStatistics(
                {
                    totalDoctors:
                        Number(
                            receivedStatistics
                                .totalDoctors ||
                            0
                        ),

                    activeDoctors:
                        Number(
                            receivedStatistics
                                .activeDoctors ||
                            0
                        ),

                    inactiveDoctors:
                        Number(
                            receivedStatistics
                                .inactiveDoctors ||
                            0
                        ),

                    totalPatients:
                        Number(
                            receivedStatistics
                                .totalPatients ||
                            0
                        ),

                    totalSuperintendents:
                        Number(
                            receivedStatistics
                                .totalSuperintendents ||
                            0
                        ),

                    todayAppointments:
                        Number(
                            receivedStatistics
                                .todayAppointments ||
                            0
                        ),

                    upcomingAppointments:
                        Number(
                            receivedStatistics
                                .upcomingAppointments ||
                            0
                        ),

                    completedAppointments:
                        Number(
                            receivedStatistics
                                .completedAppointments ||
                            0
                        ),

                    cancelledAppointments:
                        Number(
                            receivedStatistics
                                .cancelledAppointments ||
                            0
                        ),

                    noShowAppointments:
                        Number(
                            receivedStatistics
                                .noShowAppointments ||
                            0
                        ),

                    totalAppointments:
                        Number(
                            receivedStatistics
                                .totalAppointments ||
                            0
                        )
                });
            }
            catch (
                requestError
            )
            {
                console.error(
                    "Superintendent reports error:",
                    requestError
                );

                setError(
                    requestError
                        .response
                        ?.data
                        ?.message ||
                    "Unable to load hospital reports"
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
            fetchReports();
        },
        []
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


                const downloadUrl =
                    window.URL.createObjectURL(
                        blob
                    );


                const link =
                    document.createElement(
                        "a"
                    );


                link.href =
                    downloadUrl;


                link.download =
                    "hospital-appointments.xlsx";


                document.body.appendChild(
                    link
                );


                link.click();


                link.remove();


                window.URL.revokeObjectURL(
                    downloadUrl
                );
            }
            catch (
                exportError
            )
            {
                console.error(
                    "Report export error:",
                    exportError
                );

                setError(
                    "Unable to export hospital appointments"
                );
            }
            finally
            {
                setExporting(false);
            }
        };


    const completionRate =
        statistics.totalAppointments > 0
        ?
        Math.round(
            (
                statistics.completedAppointments /
                statistics.totalAppointments
            ) *
            100
        )
        :
        0;


    const cancellationRate =
        statistics.totalAppointments > 0
        ?
        Math.round(
            (
                statistics.cancelledAppointments /
                statistics.totalAppointments
            ) *
            100
        )
        :
        0;


    const doctorActivityRate =
        statistics.totalDoctors > 0
        ?
        Math.round(
            (
                statistics.activeDoctors /
                statistics.totalDoctors
            ) *
            100
        )
        :
        0;


    if (
        loading
    )
    {
        return (
            <div className="superintendent-reports-page">

                <div className="superintendent-reports-loading">

                    <RefreshCw
                        size={30}
                        className="superintendent-reports-spin"
                    />

                    <span>
                        Loading reports...
                    </span>

                </div>

            </div>
        );
    }


    return (
        <div className="superintendent-reports-page">

            <div className="superintendent-reports-header">

                <div>

                    <div className="superintendent-reports-title-row">

                        <div className="superintendent-reports-title-icon">

                            <BarChart3
                                size={24}
                            />

                        </div>

                        <div>

                            <h1>
                                Hospital Reports
                            </h1>

                            <p>
                                Hospital performance and operational statistics
                            </p>

                        </div>

                    </div>

                </div>


                <div className="superintendent-reports-actions">

                    <button
                        type="button"
                        className="superintendent-reports-export-button"
                        onClick={
                            exportAppointments
                        }
                        disabled={
                            exporting
                        }
                    >

                        <Download
                            size={17}
                        />

                        <span>
                            {
                                exporting
                                ?
                                "Exporting..."
                                :
                                "Export Appointments"
                            }
                        </span>

                    </button>


                    <button
                        type="button"
                        className="superintendent-reports-refresh-button"
                        onClick={() =>
                            fetchReports(
                                true
                            )
                        }
                        disabled={
                            refreshing
                        }
                    >

                        <RefreshCw
                            size={17}
                            className={
                                refreshing
                                ?
                                "superintendent-reports-spin"
                                :
                                ""
                            }
                        />

                        <span>
                            {
                                refreshing
                                ?
                                "Refreshing..."
                                :
                                "Refresh"
                            }
                        </span>

                    </button>

                </div>

            </div>


            {
                error &&
                (
                    <div className="superintendent-reports-error">

                        <AlertCircle
                            size={20}
                        />

                        <span>
                            {error}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                fetchReports(
                                    true
                                )
                            }
                        >
                            Try Again
                        </button>

                    </div>
                )
            }


            <div className="superintendent-reports-summary-grid">

                <div className="superintendent-report-card">

                    <div className="superintendent-report-card-icon doctors">

                        <Stethoscope
                            size={23}
                        />

                    </div>

                    <div>

                        <span>
                            Total Doctors
                        </span>

                        <strong>
                            {
                                statistics.totalDoctors
                            }
                        </strong>

                    </div>

                </div>


                <div className="superintendent-report-card">

                    <div className="superintendent-report-card-icon patients">

                        <Users
                            size={23}
                        />

                    </div>

                    <div>

                        <span>
                            Total Patients
                        </span>

                        <strong>
                            {
                                statistics.totalPatients
                            }
                        </strong>

                    </div>

                </div>


                <div className="superintendent-report-card">

                    <div className="superintendent-report-card-icon appointments">

                        <CalendarDays
                            size={23}
                        />

                    </div>

                    <div>

                        <span>
                            Total Appointments
                        </span>

                        <strong>
                            {
                                statistics.totalAppointments
                            }
                        </strong>

                    </div>

                </div>


                <div className="superintendent-report-card">

                    <div className="superintendent-report-card-icon today">

                        <Clock3
                            size={23}
                        />

                    </div>

                    <div>

                        <span>
                            Today's Appointments
                        </span>

                        <strong>
                            {
                                statistics.todayAppointments
                            }
                        </strong>

                    </div>

                </div>

            </div>


            <div className="superintendent-reports-grid">

                <div className="superintendent-report-panel">

                    <div className="superintendent-report-panel-header">

                        <div>

                            <h2>
                                Doctor Overview
                            </h2>

                            <p>
                                Current hospital doctor activity
                            </p>

                        </div>

                        <Stethoscope
                            size={21}
                        />

                    </div>


                    <div className="superintendent-report-progress-section">

                        <div className="superintendent-report-progress-label">

                            <span>
                                Active Doctors
                            </span>

                            <strong>
                                {
                                    statistics.activeDoctors
                                }
                            </strong>

                        </div>

                        <div className="superintendent-report-progress">

                            <div
                                className="superintendent-report-progress-fill doctors"
                                style={{
                                    width:
                                        `${doctorActivityRate}%`
                                }}
                            />

                        </div>

                        <small>
                            {
                                doctorActivityRate
                            }% of doctors are active
                        </small>

                    </div>


                    <div className="superintendent-report-mini-grid">

                        <div>

                            <span>
                                Active
                            </span>

                            <strong className="green">
                                {
                                    statistics.activeDoctors
                                }
                            </strong>

                        </div>

                        <div>

                            <span>
                                Inactive
                            </span>

                            <strong className="red">
                                {
                                    statistics.inactiveDoctors
                                }
                            </strong>

                        </div>

                    </div>

                </div>


                <div className="superintendent-report-panel">

                    <div className="superintendent-report-panel-header">

                        <div>

                            <h2>
                                Appointment Overview
                            </h2>

                            <p>
                                Hospital appointment performance
                            </p>

                        </div>

                        <CalendarDays
                            size={21}
                        />

                    </div>


                    <div className="superintendent-report-mini-grid three">

                        <div>

                            <CheckCircle2
                                size={19}
                            />

                            <span>
                                Completed
                            </span>

                            <strong className="green">
                                {
                                    statistics.completedAppointments
                                }
                            </strong>

                        </div>

                        <div>

                            <XCircle
                                size={19}
                            />

                            <span>
                                Cancelled
                            </span>

                            <strong className="red">
                                {
                                    statistics.cancelledAppointments
                                }
                            </strong>

                        </div>

                        <div>

                            <UserX
                                size={19}
                            />

                            <span>
                                No Show
                            </span>

                            <strong className="orange">
                                {
                                    statistics.noShowAppointments
                                }
                            </strong>

                        </div>

                    </div>


                    <div className="superintendent-report-progress-section">

                        <div className="superintendent-report-progress-label">

                            <span>
                                Completion Rate
                            </span>

                            <strong>
                                {
                                    completionRate
                                }%
                            </strong>

                        </div>

                        <div className="superintendent-report-progress">

                            <div
                                className="superintendent-report-progress-fill completed"
                                style={{
                                    width:
                                        `${completionRate}%`
                                }}
                            />

                        </div>

                    </div>

                </div>

            </div>


            <div className="superintendent-reports-bottom-grid">

                <div className="superintendent-reports-status-card">

                    <div className="superintendent-reports-status-header">

                        <div>

                            <h2>
                                Appointment Status
                            </h2>

                            <p>
                                Current appointment distribution
                            </p>

                        </div>

                    </div>


                    <div className="superintendent-status-row">

                        <div className="superintendent-status-label">

                            <span className="status-dot completed" />

                            <span>
                                Completed
                            </span>

                        </div>

                        <strong>
                            {
                                statistics.completedAppointments
                            }
                        </strong>

                    </div>


                    <div className="superintendent-status-row">

                        <div className="superintendent-status-label">

                            <span className="status-dot upcoming" />

                            <span>
                                Upcoming
                            </span>

                        </div>

                        <strong>
                            {
                                statistics.upcomingAppointments
                            }
                        </strong>

                    </div>


                    <div className="superintendent-status-row">

                        <div className="superintendent-status-label">

                            <span className="status-dot cancelled" />

                            <span>
                                Cancelled
                            </span>

                        </div>

                        <strong>
                            {
                                statistics.cancelledAppointments
                            }
                        </strong>

                    </div>


                    <div className="superintendent-status-row">

                        <div className="superintendent-status-label">

                            <span className="status-dot noshow" />

                            <span>
                                No Show
                            </span>

                        </div>

                        <strong>
                            {
                                statistics.noShowAppointments
                            }
                        </strong>

                    </div>

                </div>


                <div className="superintendent-reports-status-card">

                    <div className="superintendent-reports-status-header">

                        <div>

                            <h2>
                                Performance Summary
                            </h2>

                            <p>
                                Key hospital performance indicators
                            </p>

                        </div>

                        <BarChart3
                            size={21}
                        />

                    </div>


                    <div className="superintendent-performance-item">

                        <div>

                            <span>
                                Appointment Completion
                            </span>

                            <strong>
                                {
                                    completionRate
                                }%
                            </strong>

                        </div>

                        <div className="superintendent-performance-bar">

                            <div
                                style={{
                                    width:
                                        `${completionRate}%`
                                }}
                            />

                        </div>

                    </div>


                    <div className="superintendent-performance-item">

                        <div>

                            <span>
                                Appointment Cancellation
                            </span>

                            <strong>
                                {
                                    cancellationRate
                                }%
                            </strong>

                        </div>

                        <div className="superintendent-performance-bar">

                            <div
                                style={{
                                    width:
                                        `${cancellationRate}%`
                                }}
                            />

                        </div>

                    </div>


                    <div className="superintendent-performance-item">

                        <div>

                            <span>
                                Doctor Activity
                            </span>

                            <strong>
                                {
                                    doctorActivityRate
                                }%
                            </strong>

                        </div>

                        <div className="superintendent-performance-bar">

                            <div
                                style={{
                                    width:
                                        `${doctorActivityRate}%`
                                }}
                            />

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};


export default SuperintendentReports;