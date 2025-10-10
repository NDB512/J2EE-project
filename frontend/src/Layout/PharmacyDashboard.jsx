import React from 'react'
import Sidebar from '../Components/Pharmacy/Sidebar/Sidebar'
import Header from '../Components/Header/Header'
import { Outlet } from 'react-router-dom'

const PharmacyDashboard = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="w-full flex flex-col">
                <Header />
                <Outlet />
            </div>
        </div>
    )
}

export default PharmacyDashboard