"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Users, PlusCircle, CalendarCheck } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const menuItems = [
  { 
    icon: Calendar, 
    label: 'Dashboard', 
    href: '/User',
    description: "View and manage appointments"
  },
  { 
    icon: CalendarCheck, 
    label: 'Slots', 
    href: '/shift',
    description: "Manage your availability slots"
    
  },
  { 
    icon: PlusCircle, 
    label: 'New Appointment', 
    href: '/appointments/new',
    description: "Schedule a new appointment"
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-1">
      {menuItems.map((item, index) => (
        <Button
          key={index}
          variant={pathname === item.href ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start gap-2",
            pathname === item.href && "bg-secondary"
          )}
          asChild
        >
          <Link href={item.href}>
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        </Button>
      ))}
    </nav>
  )
}

