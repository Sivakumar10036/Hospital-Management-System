import React,
{
    useState
}
from "react";

import
{
    Outlet
}
from "react-router-dom";

import SuperintendentSidebar
    from "./SuperintendentSidebar";
import
    "../../styles/SuperintendentLayout.css";
import SuperintendentTopbar
    from "./SuperintendentTopbar";


const SuperintendentLayout =
() =>
{
    const [
        mobileOpen,
        setMobileOpen
    ] =
        useState(false);


    return (
        <div className="superintendent-app">

            <SuperintendentSidebar
                mobileOpen={
                    mobileOpen
                }
                setMobileOpen={
                    setMobileOpen
                }
            />


            <div className="superintendent-main">

                <SuperintendentTopbar
                    setMobileOpen={
                        setMobileOpen
                    }
                />


                <main className="superintendent-content">

                    <Outlet />

                </main>

            </div>

        </div>
    );
};


export default SuperintendentLayout;