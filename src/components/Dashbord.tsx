import Layout from '@/components/DashbordLayout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

export default function Dashboard() {
  const upcomingAppointments = [
    { id: 1, client: 'John Doe', date: 'May 15, 2023', time: '10:00 AM' },
    { id: 2, client: 'Jane Smith', date: 'May 16, 2023', time: '2:00 PM' },
    { id: 3, client: 'Bob Johnson', date: 'May 17, 2023', time: '11:30 AM' },
  ]

  return (
    <Layout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {upcomingAppointments.map((appointment) => (
                <li key={appointment.id} className="flex justify-between items-center">
                  <span>{appointment.client}</span>
                  <span className="text-sm text-gray-500">
                    {appointment.date} at {appointment.time}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Button>New Appointment</Button>
            <Button variant="outline">Manage Clients</Button>
            <Button variant="outline">View Schedule</Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

