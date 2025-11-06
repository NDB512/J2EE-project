import React from "react";
import { Route, Routes } from "react-router-dom";
import Random from "../Components/Random";
import AdminDashboard from "../Layout/AdminDashboard";
import LoginPage from "../Pages/LoginPage";
import RegisterPage from "../Pages/RegisterPage";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import UnauthorizedPage from "../Pages/UnauthorizedPage";
import PatientDashboard from "../Layout/PatientDashboard";
import DoctorDashboard from "../Layout/DoctorDashboard";
import PharmacyDashboard from "../Layout/PharmacyDashboard";
import PatientProfilePage from "../Pages/Patient/PatientProfilePage";
import DoctorProfilePage from "../Pages/Doctor/PoctorProfilePage";
import PharmacyProfilePage from "../Pages/Pharmacy/PharmacyProfilePage";
import PatientAppointmentPage from "../Pages/Patient/PatientAppointmentPage";
import DoctorAppointmentPage from "../Pages/Doctor/PatientAppointmentPage";
import DoctorAppointmentDetailPage from "../Pages/Doctor/DoctorAppointmentDetailPage";
import AdminMedicinePage from "../Pages/Admin/AdminMedicinePage";
import AdminInventoryPage from "../Pages/Admin/AdminInventoryPage";
import AdminSalePage from "../Pages/Admin/AdminSalePage";
import AdminPatientPage from "../Pages/Admin/AdminPatientPage";
import AdminDoctorPage from "../Pages/Admin/AdminDoctorPage";
import AdminDashboardPage from "../Pages/Admin/AdminDashboardPage";
import DoctorDashboardPage from "../Pages/Doctor/DoctorDashboardPage";
import PatientDashboardPage from "../Pages/Patient/PatientDashboardPage";
import PatientFamilyProfile from "../Pages/Patient/PatientFamilyProfile";

const AppRouter = () => {
  return (
        <Routes>
            <Route path="/login" element={ <PublicRoute> <LoginPage /> </PublicRoute>} />
            <Route path="/register" element={<PublicRoute> <RegisterPage /> </PublicRoute>} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["Admin"]}> <AdminDashboard /> </ProtectedRoute>}>
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="doctor" element={<AdminDoctorPage />} />
                <Route path="patients" element={<AdminPatientPage />} />
                <Route path="appointments" element={<Random />} />
                <Route path="medicine" element={<AdminMedicinePage />} />
                <Route path="inventory" element={<AdminInventoryPage />} />
                <Route path="sale" element={<AdminSalePage />} />
            </Route>

            <Route path="/patient" element={<ProtectedRoute allowedRoles={["Patient"]}> <PatientDashboard /> </ProtectedRoute>}>
                <Route path="dashboard" element={<PatientDashboardPage />} />
                <Route path="profile" element={<PatientProfilePage />} />
                <Route path="appointments" element={<PatientAppointmentPage />} />
                <Route path="family" element={<PatientFamilyProfile />} />
                <Route path="pharmacy" element={<Random />} />
                <Route path="book" element={<Random />} />
            </Route>

            <Route path="/doctor" element={<ProtectedRoute allowedRoles={["Doctor"]}> <DoctorDashboard /> </ProtectedRoute>}>
                <Route path="dashboard" element={<DoctorDashboardPage />} />
                <Route path="profile" element={<DoctorProfilePage />} />
                <Route path="patients" element={<Random />} />
                <Route path="appointments" element={<DoctorAppointmentPage />} />
                <Route path="appointments/:id" element={<DoctorAppointmentDetailPage />} />
                <Route path="prescriptions" element={<Random />} />
            </Route>

            <Route path="/pharmacy" element={<ProtectedRoute allowedRoles={["Pharmacy"]}> <PharmacyDashboard /> </ProtectedRoute>}>
                <Route path="dashboard" element={<Random />} />
                <Route path="profile" element={<PharmacyProfilePage />} />
                <Route path="medicine" element={<Random />} />
                <Route path="inventory" element={<Random />} />
            </Route>

            <Route path="*" element={<UnauthorizedPage />} ></Route>
        </Routes>    
  );
}

export default AppRouter;
