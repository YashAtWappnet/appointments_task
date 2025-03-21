import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, Shield } from "lucide-react";
import { Link } from "react-router";

export const Homepage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b flex items-center justify-center bg-white">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">MediBook</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              to="#features"
              className="text-sm font-medium hover:text-primary"
            >
              Features
            </Link>
            <Link to="#" className="text-sm font-medium hover:text-primary">
              About
            </Link>
            <Link to="#" className="text-sm font-medium hover:text-primary">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="outline" size="sm" className="hidden md:flex">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full flex items-center justify-center py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-blue-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Your Health, Your Schedule
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Book medical appointments with ease. No more waiting on hold
                  or scheduling conflicts.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/auth">
                  <Button size="lg" className="group">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-[500px] aspect-video overflow-hidden rounded-xl bg-blue-100 shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-primary" />
                    <p className="text-lg font-medium">
                      Schedule your appointments with ease
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="w-full py-12 md:py-24 lg:py-32 flex items-center justify-center"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Features that simplify healthcare
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform is designed to make medical appointments
                hassle-free
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <Calendar className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Easy Scheduling</h3>
              <p className="text-center text-gray-500">
                Book appointments with just a few clicks, anytime and anywhere.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <Clock className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Manage Appointments</h3>
              <p className="text-center text-gray-500">
                View, reschedule, or cancel your appointments with ease.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <Shield className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Secure Authentication</h3>
              <p className="text-center text-gray-500">
                Your personal information is protected with our secure
                authentication system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground flex items-center justify-center">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to simplify your healthcare?
              </h2>
              <p className="max-w-[600px] text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of patients who have made their healthcare
                journey smoother.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="group">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white flex items-center justify-center">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between md:py-12 px-4 md:px-6">
          <div className="flex flex-col gap-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">MediBook</span>
            </Link>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} MediBook. All rights reserved.
            </p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link
              to="#"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            <Link
              to="#"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};
