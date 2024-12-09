
import Dashboard from '@/components/Dashbord'
import DefineAvailability from '@/components/DefineAvailable'
import AdminAvailability from '@/components/forms/Availability'

import React from 'react'

function page() {
  return (
    <div>
        <Dashboard/>
        <AdminAvailability/>
        <DefineAvailability/>
    </div>
  )
}

export default page