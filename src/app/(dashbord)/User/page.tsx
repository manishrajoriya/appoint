
import Dashboard from '@/components/Dashbord'
import DefineAvailability from '@/components/DefineAvailable'
import AdminAvailability from '@/components/forms/Availability'
import DisplayAllSlots from '@/components/GetAllSlot'

import React from 'react'
import SlotManager from '../../../components/Generate'

function page() {
  return (
    <div>
        <Dashboard/>
        <AdminAvailability/>
        <DefineAvailability/>
        <DisplayAllSlots/>
        <SlotManager/>
    </div>
  )
}

export default page