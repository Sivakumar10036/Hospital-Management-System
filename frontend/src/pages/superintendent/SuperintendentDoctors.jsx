import React, {
    useEffect,
    useState
} from "react";

import {
    Search,
    Stethoscope,
    RefreshCw,
    UserRound,
    Phone,
    Mail,
    Power,
    CheckCircle
} from "lucide-react";

import {
    getSuperintendentDoctors
} from "../../services/superintendentService";

import {
    updateDoctorStatus
} from "../../services/adminService";

import "./SuperintendentDoctors.css";


const SuperintendentDoctors =
() =>
{
    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

    const [
        doctors,
        setDoctors
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
        updatingDoctorId,
        setUpdatingDoctorId
    ] =
        useState(null);


    const [
        search,
        setSearch
    ] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Fetch doctors
    |--------------------------------------------------------------------------
    */

    const fetchDoctors =
    async () =>
    {
        try
        {
            setLoading(true);

            const data =
                await getSuperintendentDoctors();


            if (
                data?.success
            )
            {
                setDoctors(
                    Array.isArray(
                        data.doctors
                    )
                        ? data.doctors
                        : []
                );
            }
            else
            {
                setDoctors([]);
            }
        }
        catch (error)
        {
            console.error(
                "Failed to fetch doctors:",
                error
            );


            console.error(
                "Response:",
                error?.response?.data
            );


            alert(
                error
                    ?.response
                    ?.data
                    ?.message ||
                "Unable to fetch doctors"
            );


            setDoctors([]);
        }
        finally
        {
            setLoading(false);

            setRefreshing(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Initial load
    |--------------------------------------------------------------------------
    */

    useEffect(
        () =>
        {
            fetchDoctors();
        },
        []
    );


    /*
    |--------------------------------------------------------------------------
    | Refresh
    |--------------------------------------------------------------------------
    */

    const handleRefresh =
        async () =>
    {
        setRefreshing(true);

        await fetchDoctors();
    };


    /*
    |--------------------------------------------------------------------------
    | Doctor Name
    |--------------------------------------------------------------------------
    */

    const getDoctorName =
        (
            doctor
        ) =>
    {
        return (
            doctor.user?.name ||

            doctor.name ||

            "Unknown Doctor"
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Doctor Email
    |--------------------------------------------------------------------------
    */

    const getDoctorEmail =
        (
            doctor
        ) =>
    {
        return (
            doctor.user?.email ||

            doctor.email ||

            ""
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Doctor Phone
    |--------------------------------------------------------------------------
    */

    const getDoctorPhone =
        (
            doctor
        ) =>
    {
        return (
            doctor.user?.phone ||

            doctor.phone ||

            ""
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Doctor Photo
    |--------------------------------------------------------------------------
    */

    const getDoctorPhoto =
        (
            doctor
        ) =>
    {
        const photo =
            doctor.profilePhoto ||

            doctor.user?.profilePhoto ||

            "";


        if (!photo)
        {
            return "";
        }


        if (
            photo.startsWith(
                "http"
            )
        )
        {
            return photo;
        }


        return (
            `http://localhost:5000${photo}`
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Doctor Department
    |--------------------------------------------------------------------------
    */

    const getDepartment =
        (
            doctor
        ) =>
    {
        if (
            doctor.department &&
            typeof doctor.department ===
                "object"
        )
        {
            return (
                doctor.department.name ||

                "Not assigned"
            );
        }


        if (
            doctor.department
        )
        {
            return doctor.department;
        }


        return "Not assigned";
    };


    /*
    |--------------------------------------------------------------------------
    | Doctor Status
    |--------------------------------------------------------------------------
    */

    const isDoctorActive =
        (
            doctor
        ) =>
    {
        return (
            doctor.isActive === true &&

            doctor.isAvailable !== false
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Activate / Deactivate Doctor
    |--------------------------------------------------------------------------
    */

    const handleStatus =
        async (
            doctor
        ) =>
    {
        const currentStatus =
            isDoctorActive(
                doctor
            );


        const nextStatus =
            !currentStatus;


        try
        {
            /*
            |--------------------------------------------------------------------------
            | Show loading only for clicked doctor
            |--------------------------------------------------------------------------
            */

            setUpdatingDoctorId(
                doctor._id
            );


            /*
            |--------------------------------------------------------------------------
            | IMPORTANT
            |
            | updateDoctorStatus() sends:
            |
            | {
            |     isActive: true
            | }
            |
            | OR
            |
            | {
            |     isActive: false
            | }
            |
            | This matches the backend controller.
            |--------------------------------------------------------------------------
            */

            await updateDoctorStatus(
                doctor._id,
                nextStatus
            );


            /*
            |--------------------------------------------------------------------------
            | Update doctor immediately in UI
            |--------------------------------------------------------------------------
            */

            setDoctors(
                (
                    currentDoctors
                ) =>
                    currentDoctors.map(
                        (
                            currentDoctor
                        ) =>
                        {
                            if (
                                currentDoctor._id !==
                                doctor._id
                            )
                            {
                                return currentDoctor;
                            }


                            return {
                                ...currentDoctor,

                                isActive:
                                    nextStatus,

                                isAvailable:
                                    nextStatus,

                                user:
                                    currentDoctor.user
                                        ? {
                                            ...currentDoctor.user,

                                            isActive:
                                                nextStatus
                                        }
                                        : currentDoctor.user
                            };
                        }
                    )
            );


            /*
            |--------------------------------------------------------------------------
            | Success message
            |--------------------------------------------------------------------------
            */

            alert(
                nextStatus
                    ? "Doctor activated successfully"
                    : "Doctor deactivated successfully"
            );
        }
        catch (error)
        {
            console.error(
                "Doctor status update error:",
                error
            );


            console.error(
                "Response:",
                error?.response?.data
            );


            alert(
                error
                    ?.response
                    ?.data
                    ?.message ||

                error?.message ||

                "Unable to update doctor status"
            );
        }
        finally
        {
            setUpdatingDoctorId(null);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    const filteredDoctors =
        doctors.filter(
            (
                doctor
            ) =>
            {
                const searchValue =
                    search
                        .toLowerCase()
                        .trim();


                if (
                    !searchValue
                )
                {
                    return true;
                }


                const name =
                    getDoctorName(
                        doctor
                    )
                        .toLowerCase();


                const email =
                    getDoctorEmail(
                        doctor
                    )
                        .toLowerCase();


                const phone =
                    getDoctorPhone(
                        doctor
                    )
                        .toLowerCase();


                const specialization =
                    (
                        doctor.specialization ||
                        ""
                    )
                        .toLowerCase();


                const department =
                    String(
                        getDepartment(
                            doctor
                        )
                    )
                        .toLowerCase();


                const doctorId =
                    (
                        doctor.doctorId ||
                        ""
                    )
                        .toLowerCase();


                return (
                    name.includes(
                        searchValue
                    ) ||

                    email.includes(
                        searchValue
                    ) ||

                    phone.includes(
                        searchValue
                    ) ||

                    specialization.includes(
                        searchValue
                    ) ||

                    department.includes(
                        searchValue
                    ) ||

                    doctorId.includes(
                        searchValue
                    )
                );
            }
        );


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div
            className=
                "superintendent-doctors-page"
        >

            <div
                className=
                    "superintendent-doctors-container"
            >

                {/* =========================================================
                    HEADER
                ========================================================= */}

                <div
                    className=
                        "superintendent-doctors-header"
                >

                    <div>

                        <span
                            className=
                                "superintendent-eyebrow"
                        >
                            HOSPITAL MANAGEMENT
                        </span>


                        <h1>
                            Doctors
                        </h1>


                        <p>
                            View and manage all doctors
                            working in the hospital.
                        </p>

                    </div>


                    <button
                        className=
                            "superintendent-refresh-button"

                        onClick={
                            handleRefresh
                        }

                        disabled={
                            refreshing
                        }
                    >

                        <RefreshCw
                            size={17}

                            className={
                                refreshing
                                    ? "superintendent-spin"
                                    : ""
                            }
                        />

                        Refresh

                    </button>

                </div>


                {/* =========================================================
                    TOOLBAR
                ========================================================= */}

                <div
                    className=
                        "superintendent-doctors-toolbar"
                >

                    <div
                        className=
                            "superintendent-search-box"
                    >

                        <Search
                            size={18}
                        />


                        <input
                            type="text"

                            placeholder=
                                "Search doctors..."

                            value={
                                search
                            }

                            onChange={
                                (
                                    event
                                ) =>
                                {
                                    setSearch(
                                        event.target.value
                                    );
                                }
                            }
                        />

                    </div>


                    <div
                        className=
                            "superintendent-doctor-count"
                    >

                        <Stethoscope
                            size={18}
                        />

                        <span>

                            {
                                filteredDoctors.length
                            }

                            {" "}

                            Doctor

                            {
                                filteredDoctors.length !==
                                1
                                    ? "s"
                                    : ""
                            }

                        </span>

                    </div>

                </div>


                {/* =========================================================
                    DOCTOR CARD
                ========================================================= */}

                <div
                    className=
                        "superintendent-doctors-card"
                >

                    {/* =====================================================
                        LOADING
                    ===================================================== */}

                    {
                        loading
                            ? (

                                <div
                                    className=
                                        "superintendent-doctors-loading"
                                >

                                    <RefreshCw
                                        size={28}

                                        className=
                                            "superintendent-spin"
                                    />


                                    <p>
                                        Loading doctors...
                                    </p>

                                </div>

                            )


                            : filteredDoctors.length === 0

                            ? (

                                <div
                                    className=
                                        "superintendent-doctors-empty"
                                >

                                    <div
                                        className=
                                            "superintendent-empty-icon"
                                    >

                                        <Stethoscope
                                            size={30}
                                        />

                                    </div>


                                    <h2>
                                        No Doctors Found
                                    </h2>


                                    <p>
                                        There are no doctors
                                        matching your search.
                                    </p>

                                </div>

                            )


                            : (

                                <div
                                    className=
                                        "superintendent-doctors-table-wrapper"
                                >

                                    <table
                                        className=
                                            "superintendent-doctors-table"
                                    >

                                        <thead>

                                            <tr>

                                                <th>
                                                    Doctor
                                                </th>

                                                <th>
                                                    Specialization
                                                </th>

                                                <th>
                                                    Department
                                                </th>

                                                <th>
                                                    Contact
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                                <th>
                                                    Action
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {
                                                filteredDoctors.map(
                                                    (
                                                        doctor
                                                    ) =>
                                                    {

                                                        const doctorName =
                                                            getDoctorName(
                                                                doctor
                                                            );


                                                        const doctorEmail =
                                                            getDoctorEmail(
                                                                doctor
                                                            );


                                                        const doctorPhone =
                                                            getDoctorPhone(
                                                                doctor
                                                            );


                                                        const doctorPhoto =
                                                            getDoctorPhoto(
                                                                doctor
                                                            );


                                                        const department =
                                                            getDepartment(
                                                                doctor
                                                            );


                                                        const active =
                                                            isDoctorActive(
                                                                doctor
                                                            );


                                                        const updating =
                                                            updatingDoctorId ===
                                                            doctor._id;


                                                        return (

                                                            <tr
                                                                key={
                                                                    doctor._id
                                                                }
                                                            >

                                                                {/* =================================================
                                                                    DOCTOR
                                                                ================================================= */}

                                                                <td>

                                                                    <div
                                                                        className=
                                                                            "superintendent-doctor-name"
                                                                    >

                                                                        <div
                                                                            className=
                                                                                "superintendent-doctor-avatar"
                                                                        >

                                                                            {
                                                                                doctorPhoto

                                                                                    ? (

                                                                                        <img
                                                                                            src={
                                                                                                doctorPhoto
                                                                                            }

                                                                                            alt={
                                                                                                doctorName
                                                                                            }

                                                                                            onError={
                                                                                                (
                                                                                                    event
                                                                                                ) =>
                                                                                                {
                                                                                                    event.currentTarget.style.display =
                                                                                                        "none";
                                                                                                }
                                                                                            }
                                                                                        />

                                                                                    )

                                                                                    : (

                                                                                        <UserRound
                                                                                            size={20}
                                                                                        />

                                                                                    )
                                                                            }

                                                                        </div>


                                                                        <div>

                                                                            <strong>
                                                                                {
                                                                                    doctorName
                                                                                }
                                                                            </strong>


                                                                            <span>
                                                                                {
                                                                                    doctor.doctorId ||
                                                                                    "N/A"
                                                                                }
                                                                            </span>

                                                                        </div>

                                                                    </div>

                                                                </td>


                                                                {/* =================================================
                                                                    SPECIALIZATION
                                                                ================================================= */}

                                                                <td>

                                                                    <span
                                                                        className=
                                                                            "superintendent-specialization"
                                                                    >
                                                                        {
                                                                            doctor.specialization ||
                                                                            "Not specified"
                                                                        }
                                                                    </span>

                                                                </td>


                                                                {/* =================================================
                                                                    DEPARTMENT
                                                                ================================================= */}

                                                                <td>

                                                                    {
                                                                        department
                                                                    }

                                                                </td>


                                                                {/* =================================================
                                                                    CONTACT
                                                                ================================================= */}

                                                                <td>

                                                                    <div
                                                                        className=
                                                                            "superintendent-contact"
                                                                    >

                                                                        {
                                                                            doctorEmail &&

                                                                            (

                                                                                <span>

                                                                                    <Mail
                                                                                        size={14}
                                                                                    />

                                                                                    {
                                                                                        doctorEmail
                                                                                    }

                                                                                </span>

                                                                            )
                                                                        }


                                                                        {
                                                                            doctorPhone &&

                                                                            (

                                                                                <span>

                                                                                    <Phone
                                                                                        size={14}
                                                                                    />

                                                                                    {
                                                                                        doctorPhone
                                                                                    }

                                                                                </span>

                                                                            )
                                                                        }


                                                                        {
                                                                            !doctorEmail &&
                                                                            !doctorPhone &&

                                                                            (

                                                                                <span>
                                                                                    No contact
                                                                                </span>

                                                                            )
                                                                        }

                                                                    </div>

                                                                </td>


                                                                {/* =================================================
                                                                    STATUS
                                                                ================================================= */}

                                                                <td>

                                                                    <span
                                                                        className={
                                                                            `superintendent-doctor-status ${
                                                                                active
                                                                                    ? "active"
                                                                                    : "inactive"
                                                                            }`
                                                                        }
                                                                    >

                                                                        {
                                                                            active
                                                                                ? "Active"
                                                                                : "Inactive"
                                                                        }

                                                                    </span>

                                                                </td>


                                                                {/* =================================================
                                                                    ACTION
                                                                ================================================= */}

                                                                <td>

                                                                    <button
                                                                        type="button"

                                                                        onClick={
                                                                            () =>
                                                                                handleStatus(
                                                                                    doctor
                                                                                )
                                                                        }

                                                                        disabled={
                                                                            updating
                                                                        }

                                                                        className={
                                                                            active
                                                                                ? "superintendent-doctor-action deactivate"
                                                                                : "superintendent-doctor-action activate"
                                                                        }
                                                                    >

                                                                        {
                                                                            updating

                                                                                ? (

                                                                                    <>

                                                                                        <RefreshCw
                                                                                            size={15}

                                                                                            className=
                                                                                                "superintendent-spin"
                                                                                        />

                                                                                        Updating...

                                                                                    </>

                                                                                )

                                                                                : active

                                                                                    ? (

                                                                                        <>

                                                                                            <Power
                                                                                                size={15}
                                                                                            />

                                                                                            Deactivate

                                                                                        </>

                                                                                    )

                                                                                    : (

                                                                                        <>

                                                                                            <CheckCircle
                                                                                                size={15}
                                                                                            />

                                                                                            Activate

                                                                                        </>

                                                                                    )
                                                                        }

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

        </div>
    );
};


export default SuperintendentDoctors;