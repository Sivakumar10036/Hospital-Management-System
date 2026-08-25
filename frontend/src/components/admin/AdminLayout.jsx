import React,
{
    useState
}
from "react";

import {
    Outlet
}
from "react-router-dom";

import AdminSidebar
    from "./AdminSidebar";

import AdminTopbar
    from "./AdminTopbar";

const AdminLayout =
() =>
{
    const [
        mobileOpen,
        setMobileOpen
    ] = useState(false);

    return (
        <div className="admin-app">

            <AdminSidebar
                mobileOpen={
                    mobileOpen
                }
                setMobileOpen={
                    setMobileOpen
                }
            />

            <div className="admin-main">

                <AdminTopbar
                    setMobileOpen={
                        setMobileOpen
                    }
                />

                <main className="admin-content">

                    <Outlet />

                </main>

            </div>

        </div>
    );
};

export default AdminLayout;