import React
from "react";

import
{
    BrowserRouter,
    Routes,
    Route,
    Navigate
}
from "react-router-dom";


import
{
    AuthProvider
}
from "./context/AuthContext";


import ProtectedRoute
from "./components/layout/ProtectedRoute";


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


import DoctorDashboard
from "./pages/doctor/DoctorDashboard";

import DoctorAppointments
from "./pages/doctor/DoctorAppointments";

import DoctorSchedule
from "./pages/doctor/DoctorSchedule";


import Login
from "./pages/auth/Login";

import Register
from "./pages/auth/Register";

import ForgotPassword
from "./pages/auth/ForgotPassword";


const App =
() =>
{
    return (
        <BrowserRouter>

            <AuthProvider>

                <Routes>

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

                            <Route
                                path="/admin"
                                element={
                                    <AdminDashboard />
                                }
                            />

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

                            <Route
                                path="/admin/patients"
                                element={
                                    <AdminPatients />
                                }
                            />

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

                            <Route
                                path="/admin/departments"
                                element={
                                    <AdminDepartments />
                                }
                            />

                            <Route
                                path="/admin/reports"
                                element={
                                    <AdminReports />
                                }
                            />

                            <Route
                                path="/admin/settings"
                                element={
                                    <AdminSettings />
                                }
                            />

                            <Route
                                path="/admin/superintendents"
                                element={
                                    <AdminSuperintendents />
                                }
                            />

                        </Route>

                    </Route>


                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "PATIENT"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/patient"
                            element={
                                <PatientDashboard />
                            }
                        />

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

                        <Route
                            path="/patient/doctors/:id/book"
                            element={
                                <BookAppointment />
                            }
                        />

                        <Route
                            path="/patient/appointments"
                            element={
                                <PatientAppointments />
                            }
                        />

                        <Route
                            path="/patient/profile"
                            element={
                                <PatientProfile />
                            }
                        />

                    </Route>


                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "DOCTOR"
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/doctor"
                            element={
                                <DoctorDashboard />
                            }
                        />

                        <Route
                            path="/doctor/appointments"
                            element={
                                <DoctorAppointments />
                            }
                        />

                        <Route
                            path="/doctor/schedule"
                            element={
                                <DoctorSchedule />
                            }
                        />

                    </Route>


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

                            <Route
                                path="/superintendent"
                                element={
                                    <SuperintendentDashboard />
                                }
                            />

                            <Route
                                path="/superintendent/doctors"
                                element={
                                    <SuperintendentDoctors />
                                }
                            />

                            <Route
                                path="/superintendent/patients"
                                element={
                                    <SuperintendentPatients />
                                }
                            />

                            <Route
                                path="/superintendent/appointments"
                                element={
                                    <SuperintendentAppointments />
                                }
                            />

                            <Route
                                path="/superintendent/departments"
                                element={
                                    <SuperintendentDepartments />
                                }
                            />

                            <Route
                                path="/superintendent/reports"
                                element={
                                    <SuperintendentReports />
                                }
                            />

                            <Route
                                path="/superintendent/settings"
                                element={
                                    <SuperintendentSettings />
                                }
                            />

                        </Route>

                    </Route>


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