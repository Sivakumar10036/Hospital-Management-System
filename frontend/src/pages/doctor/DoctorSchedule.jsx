import React, {
    useEffect,
    useState
} from "react";

import {
    getDoctorSchedule,
    updateDoctorAvailability
} from "../../services/doctorService";

import "./DoctorPortal.css";


const DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];


const DoctorSchedule = () =>
{
    const [schedules, setSchedules] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [available, setAvailable] =
        useState(true);

    const [updatingAvailability, setUpdatingAvailability] =
        useState(false);


    const loadSchedule =
        async () =>
        {
            try
            {
                setLoading(true);

                setError("");

                const response =
                    await getDoctorSchedule();

                console.log(
                    "Doctor schedule:",
                    response
                );

                const scheduleData =
                    response?.schedules ||
                    response?.data?.schedules ||
                    [];

                setSchedules(
                    Array.isArray(scheduleData)
                        ? scheduleData
                        : []
                );

                if (
                    typeof response?.isAvailable ===
                    "boolean"
                )
                {
                    setAvailable(
                        response.isAvailable
                    );
                }

                if (
                    typeof response?.available ===
                    "boolean"
                )
                {
                    setAvailable(
                        response.available
                    );
                }

                if (
                    typeof response?.doctor?.isAvailable ===
                    "boolean"
                )
                {
                    setAvailable(
                        response.doctor.isAvailable
                    );
                }

                if (
                    typeof response?.data?.isAvailable ===
                    "boolean"
                )
                {
                    setAvailable(
                        response.data.isAvailable
                    );
                }
            }
            catch (error)
            {
                console.error(
                    "Schedule error:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                    "Unable to load doctor schedule."
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
            loadSchedule();
        },
        []
    );


    const handleAvailability =
        async () =>
        {
            try
            {
                setUpdatingAvailability(
                    true
                );

                const newValue =
                    !available;

                await updateDoctorAvailability(
                    newValue
                );

                setAvailable(
                    newValue
                );
            }
            catch (error)
            {
                console.error(
                    "Availability error:",
                    error
                );

                alert(
                    error?.response?.data?.message ||
                    "Unable to update availability."
                );
            }
            finally
            {
                setUpdatingAvailability(
                    false
                );
            }
        };


    const getDayName =
        (schedule) =>
        {
            if (!schedule)
            {
                return "Unknown Day";
            }


            const value =
                schedule.dayOfWeek ??
                schedule.day ??
                schedule.dayName ??
                schedule.weekDay ??
                schedule.weekday;


            if (
                typeof value ===
                "number"
            )
            {
                return (
                    DAYS[value] ||
                    "Unknown Day"
                );
            }


            if (
                typeof value ===
                "string"
            )
            {
                const normalized =
                    value
                        .trim()
                        .toLowerCase();


                const numericValue =
                    Number(normalized);


                if (
                    !Number.isNaN(
                        numericValue
                    ) &&
                    normalized !== ""
                )
                {
                    return (
                        DAYS[numericValue] ||
                        "Unknown Day"
                    );
                }


                const matchedDay =
                    DAYS.find(
                        (day) =>
                            day.toLowerCase() ===
                            normalized
                    );


                if (matchedDay)
                {
                    return matchedDay;
                }


                const shortDayMap =
                {
                    sun: "Sunday",
                    mon: "Monday",
                    tue: "Tuesday",
                    wed: "Wednesday",
                    thu: "Thursday",
                    fri: "Friday",
                    sat: "Saturday"
                };


                if (
                    shortDayMap[normalized]
                )
                {
                    return shortDayMap[
                        normalized
                    ];
                }


                const upperValue =
                    normalized.toUpperCase();


                const enumDayMap =
                {
                    SUNDAY: "Sunday",
                    MONDAY: "Monday",
                    TUESDAY: "Tuesday",
                    WEDNESDAY: "Wednesday",
                    THURSDAY: "Thursday",
                    FRIDAY: "Friday",
                    SATURDAY: "Saturday"
                };


                if (
                    enumDayMap[upperValue]
                )
                {
                    return enumDayMap[
                        upperValue
                    ];
                }


                if (
                    normalized.includes(
                        "sunday"
                    )
                )
                {
                    return "Sunday";
                }

                if (
                    normalized.includes(
                        "monday"
                    )
                )
                {
                    return "Monday";
                }

                if (
                    normalized.includes(
                        "tuesday"
                    )
                )
                {
                    return "Tuesday";
                }

                if (
                    normalized.includes(
                        "wednesday"
                    )
                )
                {
                    return "Wednesday";
                }

                if (
                    normalized.includes(
                        "thursday"
                    )
                )
                {
                    return "Thursday";
                }

                if (
                    normalized.includes(
                        "friday"
                    )
                )
                {
                    return "Friday";
                }

                if (
                    normalized.includes(
                        "saturday"
                    )
                )
                {
                    return "Saturday";
                }
            }


            return "Unknown Day";
        };


    const getDayIndex =
        (schedule) =>
        {
            const dayName =
                getDayName(
                    schedule
                );

            const index =
                DAYS.indexOf(
                    dayName
                );

            return index === -1
                ? 99
                : index;
        };


    const getStartTime =
        (schedule) =>
        {
            return (
                schedule?.startTime ||
                schedule?.start ||
                schedule?.from ||
                schedule?.openingTime ||
                "--"
            );
        };


    const getEndTime =
        (schedule) =>
        {
            return (
                schedule?.endTime ||
                schedule?.end ||
                schedule?.to ||
                schedule?.closingTime ||
                "--"
            );
        };


    const orderedSchedules =
        [...schedules].sort(
            (a, b) =>
            {
                return (
                    getDayIndex(a) -
                    getDayIndex(b)
                );
            }
        );


    return (
        <div className="doctor-page">

            <div className="doctor-page-header">

                <div>

                    <div className="eyebrow">
                        DOCTOR PORTAL
                    </div>

                    <h1>
                        My Schedule
                    </h1>

                    <p>
                        View your working hours
                        and manage your availability.
                    </p>

                </div>


                <button
                    className="refresh-button"
                    onClick={loadSchedule}
                    disabled={loading}
                >
                    ↻ &nbsp;
                    {loading
                        ? "Refreshing..."
                        : "Refresh"}
                </button>

            </div>


            {error && (

                <div className="doctor-error">

                    <span>
                        !
                    </span>

                    {error}

                </div>

            )}


            <div className="availability-card">

                <div className="availability-icon">
                    ◉
                </div>


                <div className="availability-content">

                    <span className="eyebrow">
                        CURRENT STATUS
                    </span>

                    <h2>
                        You are currently{" "}

                        <span
                            className={
                                available
                                    ? "available-text"
                                    : "unavailable-text"
                            }
                        >
                            {available
                                ? "Available"
                                : "Unavailable"}
                        </span>
                    </h2>

                    <p>
                        Patients can be assigned
                        appointments while you are
                        available.
                    </p>

                </div>


                <button
                    className={
                        available
                            ? "availability-off"
                            : "availability-on"
                    }
                    onClick={
                        handleAvailability
                    }
                    disabled={
                        updatingAvailability
                    }
                >
                    {updatingAvailability
                        ? "Updating..."
                        : available
                            ? "Set Unavailable"
                            : "Set Available"}
                </button>

            </div>


            <div className="portal-card">

                <div className="portal-card-header">

                    <div>

                        <h2>
                            Working Schedule
                        </h2>

                        <p>
                            Your regular working
                            hours.
                        </p>

                    </div>

                </div>


                {loading ? (

                    <div className="empty-state">

                        <div className="loading-spinner"></div>

                        <h3>
                            Loading schedule...
                        </h3>

                    </div>

                ) : orderedSchedules.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            ◷
                        </div>

                        <h3>
                            No schedule configured
                        </h3>

                        <p>
                            Your working schedule
                            has not been configured
                            yet.
                        </p>

                    </div>

                ) : (

                    <div className="schedule-grid">

                        {orderedSchedules.map(
                            (
                                schedule,
                                index
                            ) =>
                            {
                                const dayName =
                                    getDayName(
                                        schedule
                                    );

                                return (

                                    <div
                                        className="schedule-day"
                                        key={
                                            schedule?._id ||
                                            `${dayName}-${index}`
                                        }
                                    >

                                        <div className="day-circle">
                                            {dayName.charAt(0)}
                                        </div>


                                        <div className="schedule-day-info">

                                            <h3>
                                                {dayName}
                                            </h3>

                                            <p>
                                                Working hours
                                            </p>

                                        </div>


                                        <div className="schedule-time">

                                            <span>
                                                {getStartTime(
                                                    schedule
                                                )}
                                            </span>

                                            <b>
                                                →
                                            </b>

                                            <span>
                                                {getEndTime(
                                                    schedule
                                                )}
                                            </span>

                                        </div>

                                    </div>

                                );
                            }
                        )}

                    </div>

                )}

            </div>


            <div className="schedule-info-grid">

                <div className="info-box">

                    <div className="info-box-icon">
                        ⏱
                    </div>

                    <div>

                        <h3>
                            Working Hours
                        </h3>

                        <p>
                            Appointments are
                            scheduled according to
                            your configured working
                            hours.
                        </p>

                    </div>

                </div>


                <div className="info-box">

                    <div className="info-box-icon">
                        ✓
                    </div>

                    <div>

                        <h3>
                            Availability
                        </h3>

                        <p>
                            Temporarily disable your
                            availability when you are
                            not accepting appointments.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};


export default DoctorSchedule;