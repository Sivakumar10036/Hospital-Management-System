import React from "react";

import {
    Menu,
    Bell,
    Search,
    ChevronDown
} from "lucide-react";

const AdminTopbar =
({
    setMobileOpen
}) =>
{
    const storedUser =
        localStorage.getItem("user");

    let user = {};

    try
    {
        user =
            storedUser
                ? JSON.parse(storedUser)
                : {};
    }
    catch
    {
        user = {};
    }

    const userName =
        user.name ||
        user.fullName ||
        "Administrator";

    const userEmail =
        user.email ||
        "admin@hospital.com";

    return (
        <header className="admin-topbar">

            <div className="topbar-left">

                <button
                    className="mobile-menu-button"
                    onClick={() =>
                        setMobileOpen(true)
                    }
                >
                    <Menu size={22} />
                </button>

                <div className="topbar-search">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search..."
                    />

                </div>

            </div>

            <div className="topbar-right">

                <button className="notification-button">

                    <Bell size={20} />

                    <span className="notification-dot" />

                </button>

                <div className="topbar-divider" />

                <div className="admin-profile">

                    <div className="admin-avatar">
                        {
                            userName
                                .charAt(0)
                                .toUpperCase()
                        }
                    </div>

                    <div className="admin-profile-info">

                        <strong>
                            {userName}
                        </strong>

                        <span>
                            Administrator
                        </span>

                    </div>

                    <ChevronDown
                        size={17}
                    />

                </div>

            </div>

        </header>
    );
};

export default AdminTopbar;