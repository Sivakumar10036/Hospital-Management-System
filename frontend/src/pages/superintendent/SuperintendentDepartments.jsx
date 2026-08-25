import React,
{
    useEffect,
    useMemo,
    useState
}
from "react";
import "../../styles/SuperintendentDepartments.css";
import
{
    Building2,
    Users,
    Stethoscope,
    CalendarDays,
    Search,
    RefreshCw,
    AlertCircle
}
from "lucide-react";

import api
    from "../../api/axios";


const SuperintendentDepartments =
() =>
{
    const [
        departments,
        setDepartments
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
        error,
        setError
    ] =
        useState("");

    const [
        search,
        setSearch
    ] =
        useState("");


    const fetchDepartments =
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
                        "/superintendents/departments/statistics"
                    );

                const responseData =
                    response.data;

                const receivedDepartments =
                    responseData?.statistics ||
                    responseData?.departments ||
                    [];

                setDepartments(
                    Array.isArray(
                        receivedDepartments
                    )
                    ?
                    receivedDepartments
                    :
                    []
                );
            }
            catch (error)
            {
                console.error(
                    "Department statistics error:",
                    error
                );

                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to load department statistics"
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
            fetchDepartments();
        },
        []
    );


    const filteredDepartments =
        useMemo(
            () =>
            {
                const searchValue =
                    search
                        .toLowerCase()
                        .trim();

                if (
                    !searchValue
                )
                {
                    return departments;
                }

                return departments.filter(
                    department =>
                    {
                        const name =
                            department
                                .departmentName ||
                            department
                                .name ||
                            "";

                        return String(
                            name
                        )
                        .toLowerCase()
                        .includes(
                            searchValue
                        );
                    }
                );
            },
            [
                departments,
                search
            ]
        );


    const totalDoctors =
        departments.reduce(
            (
                total,
                department
            ) =>
                total +
                Number(
                    department
                        .doctorCount ||
                    0
                ),
            0
        );


    const totalPatients =
        departments.reduce(
            (
                total,
                department
            ) =>
                total +
                Number(
                    department
                        .patientCount ||
                    0
                ),
            0
        );


    const totalAppointments =
        departments.reduce(
            (
                total,
                department
            ) =>
                total +
                Number(
                    department
                        .appointmentCount ||
                    0
                ),
            0
        );


    const getDepartmentName =
        department =>
        {
            return (
                department
                    .departmentName ||
                department
                    .name ||
                "Department"
            );
        };


    const getDoctorCount =
        department =>
        {
            return Number(
                department
                    .doctorCount ||
                0
            );
        };


    const getPatientCount =
        department =>
        {
            return Number(
                department
                    .patientCount ||
                0
            );
        };


    const getAppointmentCount =
        department =>
        {
            return Number(
                department
                    .appointmentCount ||
                0
            );
        };


    if (
        loading
    )
    {
        return (
            <div className="superintendent-page">

                <div className="superintendent-page-header">

                    <div>

                        <h1>
                            Departments
                        </h1>

                        <p>
                            Hospital department statistics
                        </p>

                    </div>

                </div>


                <div className="superintendent-loading">

                    <RefreshCw
                        size={22}
                        className="superintendent-spin"
                    />

                    <span>
                        Loading departments...
                    </span>

                </div>

            </div>
        );
    }


    return (
        <div className="superintendent-page">

            <div className="superintendent-page-header">

                <div>

                    <div className="superintendent-title-row">

                        <div className="superintendent-title-icon">

                            <Building2
                                size={24}
                            />

                        </div>

                        <div>

                            <h1>
                                Departments
                            </h1>

                            <p>
                                Hospital department statistics and overview
                            </p>

                        </div>

                    </div>

                </div>


                <button
                    type="button"
                    className="superintendent-refresh-button"
                    onClick={() =>
                        fetchDepartments(
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
                            "superintendent-spin"
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


            {
                error &&
                (
                    <div className="superintendent-error-box">

                        <AlertCircle
                            size={20}
                        />

                        <span>
                            {error}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                fetchDepartments(
                                    true
                                )
                            }
                        >
                            Try Again
                        </button>

                    </div>
                )
            }


            <div className="superintendent-stat-grid">

                <div className="superintendent-stat-card">

                    <div className="superintendent-stat-icon">

                        <Building2
                            size={22}
                        />

                    </div>

                    <div>

                        <span>
                            Total Departments
                        </span>

                        <strong>
                            {
                                departments.length
                            }
                        </strong>

                    </div>

                </div>


                <div className="superintendent-stat-card">

                    <div className="superintendent-stat-icon">

                        <Stethoscope
                            size={22}
                        />

                    </div>

                    <div>

                        <span>
                            Total Doctors
                        </span>

                        <strong>
                            {
                                totalDoctors
                            }
                        </strong>

                    </div>

                </div>


                <div className="superintendent-stat-card">

                    <div className="superintendent-stat-icon">

                        <Users
                            size={22}
                        />

                    </div>

                    <div>

                        <span>
                            Total Patients
                        </span>

                        <strong>
                            {
                                totalPatients
                            }
                        </strong>

                    </div>

                </div>


                <div className="superintendent-stat-card">

                    <div className="superintendent-stat-icon">

                        <CalendarDays
                            size={22}
                        />

                    </div>

                    <div>

                        <span>
                            Total Appointments
                        </span>

                        <strong>
                            {
                                totalAppointments
                            }
                        </strong>

                    </div>

                </div>

            </div>


            <div className="superintendent-content-card">

                <div className="superintendent-content-card-header">

                    <div>

                        <h2>
                            Department Overview
                        </h2>

                        <p>
                            Doctor and appointment statistics by department
                        </p>

                    </div>


                    <div className="superintendent-search-box">

                        <Search
                            size={18}
                        />

                        <input
                            type="text"
                            placeholder="Search department..."
                            value={
                                search
                            }
                            onChange={
                                event =>
                                    setSearch(
                                        event.target.value
                                    )
                            }
                        />

                    </div>

                </div>


                {
                    filteredDepartments.length === 0
                    ?
                    (
                        <div className="superintendent-empty-state">

                            <Building2
                                size={42}
                            />

                            <h3>
                                No departments found
                            </h3>

                            <p>
                                {
                                    search
                                    ?
                                    "No department matches your search."
                                    :
                                    "There are no department statistics available."
                                }
                            </p>

                        </div>
                    )
                    :
                    (
                        <div className="superintendent-table-wrapper">

                            <table className="superintendent-table">

                                <thead>

                                    <tr>

                                        <th>
                                            #
                                        </th>

                                        <th>
                                            Department
                                        </th>

                                        <th>
                                            Doctors
                                        </th>

                                        <th>
                                            Patients
                                        </th>

                                        <th>
                                            Appointments
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {
                                        filteredDepartments.map(
                                            (
                                                department,
                                                index
                                            ) =>
                                            (
                                                <tr
                                                    key={
                                                        department
                                                            .departmentId ||
                                                        department
                                                            ._id ||
                                                        index
                                                    }
                                                >

                                                    <td>

                                                        <span className="superintendent-row-number">
                                                            {
                                                                index +
                                                                1
                                                            }
                                                        </span>

                                                    </td>


                                                    <td>

                                                        <div className="superintendent-department-name">

                                                            <div className="superintendent-department-icon">

                                                                <Building2
                                                                    size={18}
                                                                />

                                                            </div>

                                                            <strong>
                                                                {
                                                                    getDepartmentName(
                                                                        department
                                                                    )
                                                                }
                                                            </strong>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <div className="superintendent-table-number">

                                                            <Stethoscope
                                                                size={17}
                                                            />

                                                            <span>
                                                                {
                                                                    getDoctorCount(
                                                                        department
                                                                    )
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <div className="superintendent-table-number">

                                                            <Users
                                                                size={17}
                                                            />

                                                            <span>
                                                                {
                                                                    getPatientCount(
                                                                        department
                                                                    )
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <div className="superintendent-table-number">

                                                            <CalendarDays
                                                                size={17}
                                                            />

                                                            <span>
                                                                {
                                                                    getAppointmentCount(
                                                                        department
                                                                    )
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>

                                                </tr>
                                            )
                                        )
                                    }

                                </tbody>

                            </table>

                        </div>
                    )
                }

            </div>

        </div>
    );
};


export default SuperintendentDepartments;