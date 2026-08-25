import React from "react";

import
{
    Menu,
    Bell,
    Building2
}
from "lucide-react";

import
{
    useAuth
}
from "../../context/AuthContext";


const SuperintendentTopbar =
({
    setMobileOpen
}) =>
{
    const {
        user
    } =
        useAuth();


    return (
        <header className="superintendent-topbar">


            <div className="superintendent-topbar-left">

                <button
                    className="superintendent-menu-button"
                    onClick={() =>
                        setMobileOpen(true)
                    }
                >

                    <Menu
                        size={22}
                    />

                </button>


                <div>

                    <span>
                        Hospital Operations
                    </span>

                    <h1>
                        Superintendent Portal
                    </h1>

                </div>

            </div>


            <div className="superintendent-topbar-right">


                <button
                    className="superintendent-notification-button"
                >

                    <Bell
                        size={19}
                    />

                    <span className="superintendent-notification-dot">
                    </span>

                </button>


                <div className="superintendent-user">

                    <div className="superintendent-user-avatar">

                        <Building2
                            size={18}
                        />

                    </div>


                    <div className="superintendent-user-info">

                        <strong>
                            {
                                user?.name ||
                                "Superintendent"
                            }
                        </strong>

                        <span>
                            Superintendent
                        </span>

                    </div>

                </div>

            </div>

        </header>
    );
};


export default SuperintendentTopbar;