import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Random from "../Components/Random";
import AdminDashboard from "../Layout/AdminDashboard";
import LoginPage from "../Pages/LoginPage";
import RegisterPage from "../Pages/RegisterPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<AdminDashboard />}>
                <Route path="/dashboard" element={<Random />} />
                <Route path="/doctor" element={<Random />} />
                <Route path="/patients" element={<Random />} />
                <Route path="/appointments" element={<Random />} />
                <Route path="/pharmacy" element={<Random />} />
            </Route>
            <Route path="*" element={<div>404 Not Found</div>}>
            </Route>
        </Routes>    
    </BrowserRouter>
  );
}

export default AppRouter;
