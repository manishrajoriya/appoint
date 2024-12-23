"use client"

import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { UserNav } from "@/components/user-nav"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */} 
      <div className="hidden border-r bg-card md:flex md:w-64 md:flex-col">
        <div className="flex flex-col space-y-4 p-4">
          <div className="flex h-14 items-center px-4 font-semibold tracking-tight">
            <h1 className="text-lg font-semibold">Appointment System</h1>
          </div>
          <Separator />
          <MainNav />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-6">
          <MobileNav />
          
          <div className="flex flex-1 items-center justify-between">
            <h1 className={cn(
              "text-lg font-semibold md:text-xl",
              "line-clamp-1"
            )}>
              Appointment Dashboard
            </h1>
            
            <div className="flex items-center gap-4">
              <UserNav />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>

        <footer className="border-t py-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Appointment System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}

