"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { upcomingAppointments } from '@/lib/action'
import { useEffect, useState } from 'react'
import { Phone } from 'lucide-react'
import { Badge } from './ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

export default function Dashboard() {
  // const upcomingAppointments = [
  //   { id: 1, client: 'John Doe', date: 'May 15, 2023', time: '10:00 AM' },
  //   { id: 2, client: 'Jane Smith', date: 'May 16, 2023', time: '2:00 PM' },
  //   { id: 3, client: 'Bob Johnson', date: 'May 17, 2023', time: '11:30 AM' },
  // ]
  interface Appointment {
  id: string;
  name: string;
  date: Date;
  time: string;
  phone: string;
  status: string;
}
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const Appointments = async () => {
    const response = await upcomingAppointments()
    console.log(response)
    if (response.success && response.data) {
      const appointments = response.data.map((appointment: any) => ({
        id: appointment.id,
        name: appointment.user.name,
        date: new Date(appointment.date),
        time: appointment.time,
        phone: appointment.user.phone,
        status: appointment.status
      }))
      setAllAppointments(appointments)
    }else{
      setAllAppointments([])
    }
    
  }
  useEffect(() => {
    Appointments()
  }, [])

  return (
    
  <div className="grid grid-cols-1  gap-4 ">
    <div className='lg:col-span-2'>
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mobile view */}
        <div className="grid gap-4 md:hidden">
          {allAppointments.map((appointment, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="font-semibold">{appointment.name}</div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    {appointment.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    
                    {/* {new Date(appointment.date).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })} */}
                    { appointment.date.toLocaleDateString() } at {
                      appointment.time 
                    }
                    
                  </div>
                  <Badge 
                    variant={
                      appointment.status === "CONFIRMED" 
                        ? "success" 
                        : appointment.status === "CANCELLED" 
                        ? "destructive" 
                        : "secondary"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop view */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allAppointments.map((appointment, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{appointment.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${appointment.phone}`} className="hover:underline" target="_blank" rel="noopener noreferrer">
                      {appointment.phone}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      
                       { appointment.date.toLocaleDateString() } at {
                      appointment.time 
                    }
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        appointment.status === "CONFIRMED" 
                          ? "success" 
                          : appointment.status === "CANCELLED" 
                          ? "destructive" 
                          : "secondary"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>

</div>
    
  )
}

