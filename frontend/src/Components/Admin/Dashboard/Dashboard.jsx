import React from 'react'
import TopCards from './TopCards'
import DiseaseChart from './DiseaseChart'
import Appointments from './Appointment'
import Medicines from './Medicines'
import Patients from './Patients'
import Doctors from './Doctors'

const Dashboard = () => {
    return (
        <div className='flex flex-col gap-5'>
            <h1 className='text-2xl font-semibold'>Admin Dashboard</h1>
            <TopCards />
            <div className="grid grid-cols-3 gap-5">
                <DiseaseChart />
                <Appointments />
                <Medicines />
            </div>
            <div className="grid grid-cols-2 gap-5">
                <Patients />
                <Doctors />
            </div>
        </div>
    )
}

export default Dashboard