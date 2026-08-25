import React
from "react";

import
{
    LayoutDashboard,
    Stethoscope,
    Users,
    CalendarDays,
    Building2,
    FileBarChart,
    ShieldCheck,
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

import
    "../../styles/AdminSidebar.css";
const AdminSidebar =
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
        if (
            setMobileOpen
        )
        {
            setMobileOpen(
                false
            );
        }
    };


    const menuItems =
    [
        {
            name:
                "Dashboard",

            path:
                "/admin",

            icon:
                LayoutDashboard
        },

        {
            name:
                "Doctors",

            path:
                "/admin/doctors",

            icon:
                Stethoscope
        },

        {
            name:
                "Patients",

            path:
                "/admin/patients",

            icon:
                Users
        },

        {
            name:
                "Appointments",

            path:
                "/admin/appointments",

            icon:
                CalendarDays
        },

        {
            name:
                "Departments",

            path:
                "/admin/departments",

            icon:
                Building2
        },

        {
            name:
                "Superintendents",

            path:
                "/admin/superintendents",

            icon:
                ShieldCheck
        },

        {
            name:
                "Reports",

            path:
                "/admin/reports",

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
                        className="admin-sidebar-overlay"
                        onClick={
                            closeMobileMenu
                        }
                    />
                )
            }


            <aside
                className={
                    `admin-sidebar ${
                        mobileOpen
                            ?
                            "mobile-open"
                            :
                            ""
                    }`
                }
            >

                <div
                    className="admin-sidebar-header"
                >

                    <div
                        className="admin-brand"
                    >

                        <div
                            className="admin-brand-icon"
                        >

                            <Stethoscope
                                size={24}
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
                        className="admin-mobile-close"
                        onClick={
                            closeMobileMenu
                        }
                    >

                        <X
                            size={21}
                        />

                    </button>

                </div>


                <div
                    className="admin-navigation"
                >

                    <span
                        className="admin-menu-title"
                    >
                        MAIN MENU
                    </span>


                    {
                        menuItems.map(
                            item =>
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
                                            "/admin"
                                        }

                                        className={
                                            ({
                                                isActive
                                            }) =>
                                                isActive
                                                    ?
                                                    "admin-nav-link active"
                                                    :
                                                    "admin-nav-link"
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

                </div>


                <div
                    className="admin-sidebar-footer"
                >

                    <NavLink
                        to="/admin/settings"
                        className={
                            ({
                                isActive
                            }) =>
                                isActive
                                    ?
                                    "admin-nav-link active"
                                    :
                                    "admin-nav-link"
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


                    <button
                        className="admin-logout-button"
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


export default AdminSidebar;