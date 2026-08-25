import React from "react";

import
{
    LayoutDashboard,
    Stethoscope,
    Users,
    CalendarDays,
    Building2,
    FileBarChart,
    Settings,
    LogOut,
    X
}
from "lucide-react";

import
{
    NavLink,
    useNavigate
}
from "react-router-dom";

import
{
    useAuth
}
from "../../context/AuthContext";


const SuperintendentSidebar =
({
    mobileOpen,
    setMobileOpen
}) =>
{
    const navigate =
        useNavigate();


    const {
        logout
    } =
        useAuth();


    const handleLogout =
    () =>
    {
        logout();

        navigate(
            "/login"
        );
    };


    const closeMobileMenu =
    () =>
    {
        if (setMobileOpen)
        {
            setMobileOpen(false);
        }
    };


    const menuItems =
    [
        {
            name:
                "Dashboard",

            path:
                "/superintendent",

            icon:
                LayoutDashboard
        },

        {
            name:
                "Doctors",

            path:
                "/superintendent/doctors",

            icon:
                Stethoscope
        },

        {
            name:
                "Patients",

            path:
                "/superintendent/patients",

            icon:
                Users
        },

        {
            name:
                "Appointments",

            path:
                "/superintendent/appointments",

            icon:
                CalendarDays
        },

        {
            name:
                "Departments",

            path:
                "/superintendent/departments",

            icon:
                Building2
        },

        {
            name:
                "Reports",

            path:
                "/superintendent/reports",

            icon:
                FileBarChart
        }
    ];


    return (
        <>

            {
                mobileOpen &&
                (
                    <div
                        className="superintendent-sidebar-overlay"

                        onClick={
                            closeMobileMenu
                        }
                    />
                )
            }


            <aside
                className={
                    `superintendent-sidebar ${
                        mobileOpen
                            ?
                            "mobile-open"
                            :
                            ""
                    }`
                }
            >

                {/* HEADER */}

                <div
                    className="superintendent-sidebar-header"
                >

                    <div
                        className="superintendent-brand"
                    >

                        <div
                            className="superintendent-brand-icon"
                        >

                            <Building2
                                size={23}
                            />

                        </div>


                        <div>

                            <h2>
                                MediCare
                            </h2>

                            <span>
                                Hospital Management
                            </span>

                        </div>

                    </div>


                    <button
                        type="button"

                        className="superintendent-mobile-close"

                        onClick={
                            closeMobileMenu
                        }
                    >

                        <X
                            size={21}
                        />

                    </button>

                </div>


                {/* ROLE */}

                <div
                    className="superintendent-role-box"
                >

                    <div
                        className="superintendent-role-icon"
                    >

                        <Building2
                            size={18}
                        />

                    </div>


                    <div>

                        <span>
                            ROLE
                        </span>

                        <strong>
                            Superintendent
                        </strong>

                    </div>

                </div>


                {/* MAIN NAVIGATION */}

                <nav
                    className="superintendent-navigation"
                >

                    <span
                        className="superintendent-menu-title"
                    >
                        HOSPITAL MANAGEMENT
                    </span>


                    {
                        menuItems.map(
                            (
                                item
                            ) =>
                            {

                                const Icon =
                                    item.icon;


                                return (
                                    <NavLink

                                        key={
                                            item.path
                                        }

                                        to={
                                            item.path
                                        }

                                        end={
                                            item.path ===
                                            "/superintendent"
                                        }

                                        className={
                                            ({
                                                isActive
                                            }) =>
                                                isActive
                                                    ?
                                                    "superintendent-nav-link active"
                                                    :
                                                    "superintendent-nav-link"
                                        }

                                        onClick={
                                            closeMobileMenu
                                        }
                                    >

                                        <Icon
                                            size={19}
                                        />

                                        <span>
                                            {
                                                item.name
                                            }
                                        </span>

                                    </NavLink>
                                );
                            }
                        )
                    }

                </nav>


                {/* FOOTER */}

                <div
                    className="superintendent-sidebar-footer"
                >

                    {/* SETTINGS */}

                    <NavLink
                        to="/superintendent/settings"

                        className={
                            ({
                                isActive
                            }) =>
                                isActive
                                    ?
                                    "superintendent-nav-link active"
                                    :
                                    "superintendent-nav-link"
                        }

                        onClick={
                            closeMobileMenu
                        }
                    >

                        <Settings
                            size={19}
                        />

                        <span>
                            Settings
                        </span>

                    </NavLink>


                    {/* LOGOUT */}

                    <button
                        type="button"

                        className="superintendent-logout-button"

                        onClick={
                            handleLogout
                        }
                    >

                        <LogOut
                            size={19}
                        />

                        <span>
                            Logout
                        </span>

                    </button>

                </div>

            </aside>

        </>
    );
};


export default SuperintendentSidebar;