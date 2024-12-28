"use client";
import React from 'react'
import { getDaySlotsWhatsapp } from '@/lib/actions/whatsapp.action'

function page() {
   async function getSlots(){
    const day = await getDaySlotsWhatsapp({adminId:"user_2q920IGfrn8NcalWA4goAmolFLF",dayName:"Monday"});
    console.log("day",day);
    }
  return (
    <div>
        <button
            onClick={getSlots}
        >get slots</button>
    </div>
  )
}

export default page