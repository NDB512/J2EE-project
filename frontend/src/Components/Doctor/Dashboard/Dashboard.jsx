import React from 'react'
import Welcome from './Welcome'
import Metrices from './Metrices'
import DiseaseChart from './DiseaseChart'
import PatientMetrices from './PatientMetrices'
import Patients from './Patients'
import Appointments from './Appointment'

const Dashboard = () => {
    return (
        <div className='flex flex-col gap-5'>
            <div className="grid grid-cols-2 gap-5">
                <Welcome />
                <Metrices />
            </div>
            <div className="grid grid-cols-3 gap-5">
                <DiseaseChart />
                <div className="col-span-2">
                    <PatientMetrices />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
                <Patients />
                <Appointments />
            </div>
        </div>
    )
}

export default Dashboard