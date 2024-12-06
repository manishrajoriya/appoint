"use client"
import { useState } from 'react'
import { Menu, X, Calendar, Users, PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { icon: Calendar, label: 'Dashboard', href: '#' },
    { icon: Users, label: 'Clients', href: '#' },
    { icon: PlusCircle, label: 'New Appointment', href: '#' },
  ]

  const Sidebar = () => (
    <div className="flex flex-col h-full p-4 bg-gray-100">
      <div className="space-y-4">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between px-4 py-4 bg-white border-b md:py-6">
          <h1 className="text-2xl font-semibold">Appointment Dashboard</h1>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <Sidebar />
              </SheetContent>
            </Sheet>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  )
}

