import React from "react";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";


/* =========================================================
   AUTHENTICATION
========================================================= */

import {
    AuthProvider
} from "./context/AuthContext";

import ProtectedRoute
    from "./components/layout/ProtectedRoute";


/* =========================================================
   ADMIN
========================================================= */

import AdminLayout
    from "./components/admin/AdminLayout";

import AdminDashboard
    from "./pages/admin/AdminDashboard";

import AdminDoctors
    from "./pages/admin/AdminDoctors";

import AdminPatients
    from "./pages/admin/AdminPatients";

import AdminDoctorForm
    from "./pages/admin/AdminDoctorForm";

import AdminDoctorDetails
    from "./pages/admin/AdminDoctorDetails";

import AdminDoctorEdit
    from "./pages/admin/AdminDoctorEdit";

import AdminAppointments
    from "./pages/admin/AdminAppointments";

import AppointmentDetails
    from "./pages/admin/AppointmentDetails";

import AdminDepartments
    from "./pages/admin/AdminDepartments";

import AdminReports
    from "./pages/admin/AdminReports";

import AdminSettings
    from "./pages/admin/AdminSettings";

import AdminSuperintendents
    from "./pages/admin/AdminSuperintendents";


/* =========================================================
   PATIENT
========================================================= */

import PatientDashboard
    from "./pages/patient/PatientDashboard";

import PatientDoctors
    from "./pages/patient/PatientDoctors";

import PatientDoctorDetails
    from "./pages/patient/PatientDoctorDetails";

import BookAppointment
    from "./pages/patient/BookAppointment";

import PatientAppointments
    from "./pages/patient/PatientAppointments";

import PatientProfile
    from "./pages/patient/PatientProfile";


/* =========================================================
   DOCTOR
========================================================= */

import DoctorDashboard
    from "./pages/doctor/DoctorDashboard";

import DoctorAppointments
    from "./pages/doctor/DoctorAppointments";

import DoctorSchedule
    from "./pages/doctor/DoctorSchedule";


/* =========================================================
   SUPERINTENDENT
========================================================= */

import SuperintendentLayout
    from "./components/superintendent/SuperintendentLayout";

import SuperintendentDashboard
    from "./pages/superintendent/SuperintendentDashboard";

import SuperintendentDoctors
    from "./pages/superintendent/SuperintendentDoctors";

import SuperintendentPatients
    from "./pages/superintendent/SuperintendentPatients";

import SuperintendentAppointments
    from "./pages/superintendent/SuperintendentAppointments";

import SuperintendentDepartments
    from "./pages/superintendent/SuperintendentDepartments";

import SuperintendentReports
    from "./pages/superintendent/SuperintendentReports";

import SuperintendentSettings
    from "./pages/superintendent/SuperintendentSettings";


/* =========================================================
   AUTH PAGES
========================================================= */

import Login
    from "./pages/auth/Login";

import Register
    from "./pages/auth/Register";

import ForgotPassword
    from "./pages/auth/ForgotPassword";


/* =========================================================
   APP
========================================================= */

const App = () => {

    return (

        <BrowserRouter>

            <AuthProvider>

                <Routes>


                    {/* =================================================
                       PUBLIC ROUTES
                    ================================================= */}

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/login"
                                replace
                            />
                        }
                    />


                    <Route
                        path="/login"
                        element={
                            <Login />
                        }
                    />


                    <Route
                        path="/register"
                        element={
                            <Register />
                        }
                    />


                    <Route
                        path="/forgot-password"
                        element={
                            <ForgotPassword />
                        }
                    />


                    {/* =================================================
                       ADMIN ROUTES
                    ================================================= */}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "ADMIN"
                                ]}
                            />
                        }
                    >

                        <Route
                            element={
                                <AdminLayout />
                            }
                        >


                            {/* ADMIN DASHBOARD */}

                            <Route
                                path="/admin"
                                element={
                                    <AdminDashboard />
                                }
                            />


                            {/* DOCTORS */}

                            <Route
                                path="/admin/doctors"
                                element={
                                    <AdminDoctors />
                                }
                            />


                            <Route
                                path="/admin/doctors/add"
                                element={
                                    <AdminDoctorForm />
                                }
                            />


                            <Route
                                path="/admin/doctors/:id"
                                element={
                                    <AdminDoctorDetails />
                                }
                            />


                            <Route
                                path="/admin/doctors/:id/edit"
                                element={
                                    <AdminDoctorEdit />
                                }
                            />


                            {/* PATIENTS */}

                            <Route
                                path="/admin/patients"
                                element={
                                    <AdminPatients />
                                }
                            />


                            {/* APPOINTMENTS */}

                            <Route
                                path="/admin/appointments"
                                element={
                                    <AdminAppointments />
                                }
                            />


                            <Route
                                path="/admin/appointments/:id"
                                element={
                                    <AppointmentDetails />
                                }
                            />


                            {/* DEPARTMENTS */}

                            <Route
                                path="/admin/departments"
                                element={
                                    <AdminDepartments />
                                }
                            />


                            {/* REPORTS */}

                            <Route
                                path="/admin/reports"
                                element={
                                    <AdminReports />
                                }
                            />


                            {/* SETTINGS */}

                            <Route
                                path="/admin/settings"
                                element={
                                    <AdminSettings />
                                }
                            />


                            {/* SUPERINTENDENTS */}

                            <Route
                                path="/admin/superintendents"
                                element={
                                    <AdminSuperintendents />
                                }
                            />


                        </Route>

                    </Route>


                    {/* =================================================
                       PATIENT ROUTES
                    ================================================= */}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "PATIENT"
                                ]}
                            />
                        }
                    >


                        {/* PATIENT DASHBOARD */}

                        <Route
                            path="/patient"
                            element={
                                <PatientDashboard />
                            }
                        />


                        {/* DOCTORS */}

                        <Route
                            path="/patient/doctors"
                            element={
                                <PatientDoctors />
                            }
                        />


                        <Route
                            path="/patient/doctors/:id"
                            element={
                                <PatientDoctorDetails />
                            }
                        />


                        {/* BOOK APPOINTMENT */}

                        <Route
                            path="/patient/doctors/:id/book"
                            element={
                                <BookAppointment />
                            }
                        />


                        {/* PATIENT APPOINTMENTS */}

                        <Route
                            path="/patient/appointments"
                            element={
                                <PatientAppointments />
                            }
                        />


                        {/* PROFILE */}

                        <Route
                            path="/patient/profile"
                            element={
                                <PatientProfile />
                            }
                        />


                    </Route>


                    {/* =================================================
                       DOCTOR ROUTES
                    ================================================= */}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "DOCTOR"
                                ]}
                            />
                        }
                    >


                        {/* DOCTOR DASHBOARD */}

                        <Route
                            path="/doctor"
                            element={
                                <DoctorDashboard />
                            }
                        />


                        {/* DOCTOR APPOINTMENTS */}

                        <Route
                            path="/doctor/appointments"
                            element={
                                <DoctorAppointments />
                            }
                        />


                        {/* DOCTOR SCHEDULE */}

                        <Route
                            path="/doctor/schedule"
                            element={
                                <DoctorSchedule />
                            }
                        />


                    </Route>


                    {/* =================================================
                       SUPERINTENDENT ROUTES
                    ================================================= */}

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "SUPERINTENDENT"
                                ]}
                            />
                        }
                    >

                        <Route
                            element={
                                <SuperintendentLayout />
                            }
                        >


                            {/* DASHBOARD */}

                            <Route
                                path="/superintendent"
                                element={
                                    <SuperintendentDashboard />
                                }
                            />


                            {/* DOCTORS */}

                            <Route
                                path="/superintendent/doctors"
                                element={
                                    <SuperintendentDoctors />
                                }
                            />


                            {/* PATIENTS */}

                            <Route
                                path="/superintendent/patients"
                                element={
                                    <SuperintendentPatients />
                                }
                            />


                            {/* APPOINTMENTS */}

                            <Route
                                path="/superintendent/appointments"
                                element={
                                    <SuperintendentAppointments />
                                }
                            />


                            {/* DEPARTMENTS */}

                            <Route
                                path="/superintendent/departments"
                                element={
                                    <SuperintendentDepartments />
                                }
                            />


                            {/* REPORTS */}

                            <Route
                                path="/superintendent/reports"
                                element={
                                    <SuperintendentReports />
                                }
                            />


                            {/* SETTINGS */}

                            <Route
                                path="/superintendent/settings"
                                element={
                                    <SuperintendentSettings />
                                }
                            />


                        </Route>

                    </Route>


                    {/* =================================================
                       FALLBACK ROUTE
                    ================================================= */}

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/login"
                                replace
                            />
                        }
                    />


                </Routes>

            </AuthProvider>

        </BrowserRouter>

    );

};


export default App;