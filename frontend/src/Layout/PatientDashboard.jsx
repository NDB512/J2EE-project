import React, { useState } from 'react';
import Sidebar from '../Components/Patient/Sidebar/Sidebar';
import Header from '../Components/Header/Header';
import { Outlet } from 'react-router-dom';

const PatientDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            {isSidebarOpen && (
                <div className="w-64 bg-white border-r overflow-y-auto">
                <Sidebar isOpen={isSidebarOpen} />
                </div>
            )}

            {/* Khu vực chính */}
            <div className="flex flex-col flex-1 overflow-y-auto">
                <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <div className="flex-1 p-4">
                <Outlet />
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;