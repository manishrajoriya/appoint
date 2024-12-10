import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MessageCircle, Phone, Send, User } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { Sign } from "crypto"

export default function WhatsAppBookingLanding() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Calendar className="h-6 w-6" />
          <span className="sr-only">Acme Booking Inc</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/User">
            Get Started
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#how-it-works">
            How It Works
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/User">
            <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Book Appointments with Ease
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Schedule your appointments effortlessly through WhatsApp. No apps, no hassle - just simple, convenient booking.
                </p>
              </div>
              <div className="space-x-4">
                <Button>Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">How It Works</h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <MessageCircle className="w-8 h-8 text-green-500" />
                    <h3 className="text-2xl font-bold">1. Send a Message</h3>
                  </div>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Start by sending a WhatsApp message to our booking number.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <Calendar className="w-8 h-8 text-blue-500" />
                    <h3 className="text-2xl font-bold">2. Choose a Time</h3>
                  </div>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Select your preferred date and time from the available slots.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <Send className="w-8 h-8 text-purple-500" />
                    <h3 className="text-2xl font-bold">3. Confirm Booking</h3>
                  </div>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Receive a confirmation message with your appointment details.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">Why Choose Us</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <Clock className="w-12 h-12 mb-4 text-blue-500" />
                <h3 className="text-xl font-bold mb-2">24/7 Booking</h3>
                <p className="text-gray-500 dark:text-gray-400">Book anytime, day or night, at your convenience.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Phone className="w-12 h-12 mb-4 text-green-500" />
                <h3 className="text-xl font-bold mb-2">No App Required</h3>
                <p className="text-gray-500 dark:text-gray-400">Use the WhatsApp app you already have and love.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <User className="w-12 h-12 mb-4 text-purple-500" />
                <h3 className="text-xl font-bold mb-2">Personal Touch</h3>
                <p className="text-gray-500 dark:text-gray-400">Get personalized service through chat.</p>
              </div>
            </div>
          </div>
        </section>
        <section id="cta" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Get Started?</h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Book your first appointment now and experience the convenience of WhatsApp booking.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Button className="w-full" size="lg">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Start Booking via WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Acme Booking Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

