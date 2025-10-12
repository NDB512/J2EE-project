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

const AppRouter = () => {
  return (
        <Routes>
            <Route path="/login" element={ <PublicRoute> <LoginPage /> </PublicRoute>} />
            <Route path="/register" element={<PublicRoute> <RegisterPage /> </PublicRoute>} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["Admin"]}> <AdminDashboard /> </ProtectedRoute>}>
                <Route path="dashboard" element={<Random />} />
                <Route path="doctor" element={<Random />} />
                <Route path="patients" element={<Random />} />
                <Route path="appointments" element={<Random />} />
                <Route path="pharmacy" element={<Random />} />
            </Route>

            <Route path="/patient" element={<ProtectedRoute allowedRoles={["Patient"]}> <PatientDashboard /> </ProtectedRoute>}>
                <Route path="dashboard" element={<Random />} />
                <Route path="profile" element={<PatientProfilePage />} />
                <Route path="appointments" element={<Random />} />
                <Route path="pharmacy" element={<Random />} />
                <Route path="book" element={<Random />} />
            </Route>

            <Route path="/doctor" element={<ProtectedRoute allowedRoles={["Doctor"]}> <DoctorDashboard /> </ProtectedRoute>}>
                <Route path="dashboard" element={<Random />} />
                <Route path="profile" element={<DoctorProfilePage />} />
                <Route path="patients" element={<Random />} />
                <Route path="appointments" element={<Random />} />
                <Route path="prescriptions" element={<Random />} />
            </Route>

            <Route path="/pharmacy" element={<ProtectedRoute allowedRoles={["Pharmacy"]}> <PharmacyDashboard /> </ProtectedRoute>}>
                <Route path="dashboard" element={<Random />} />
                <Route path="profile" element={<PharmacyProfilePage />} />
                <Route path="prescriptions" element={<Random />} />
                <Route path="inventory" element={<Random />} />
            </Route>

            <Route path="*" element={<UnauthorizedPage />} ></Route>
        </Routes>    
  );
}

export default AppRouter;
