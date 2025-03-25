<template>
  <div class="flex flex-col min-h-screen">
    <!-- Hero Section -->
    <section
      class="w-full flex items-center justify-center py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-blue-50"
    >
      <div class="container px-4 md:px-6">
        <div class="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div class="flex flex-col justify-center space-y-4">
            <div class="space-y-2">
              <h1
                class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
              >
                Your Health, Your Schedule
              </h1>
              <p
                class="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
              >
                Book medical appointments with ease. No more waiting on hold or
                scheduling conflicts.
              </p>
            </div>
            <div class="flex flex-col gap-2 min-[400px]:flex-row">
              <router-link to="/auth">
                <Button size="lg" class="group">
                  Get Started
                  <ArrowRight
                    class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                  />
                </Button>
              </router-link>
            </div>
          </div>
          <div class="flex justify-center">
            <div
              class="relative w-full max-w-[500px] aspect-video overflow-hidden rounded-xl bg-blue-100 shadow-lg"
            >
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center p-6">
                  <Calendar class="h-16 w-16 mx-auto mb-4 text-primary" />
                  <p class="text-lg font-medium">
                    Schedule your appointments with ease
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section
      id="features"
      class="w-full py-12 md:py-24 lg:py-32 flex items-center justify-center"
    >
      <div class="container px-4 md:px-6">
        <div
          class="flex flex-col items-center justify-center space-y-4 text-center"
        >
          <div class="space-y-2">
            <h2
              class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            >
              Features that simplify healthcare
            </h2>
            <p
              class="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
            >
              Our platform is designed to make medical appointments hassle-free
            </p>
          </div>
        </div>
        <div
          class="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3"
        >
          <div
            class="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm"
          >
            <Calendar class="h-12 w-12 text-primary" />
            <h3 class="text-xl font-bold">Easy Scheduling</h3>
            <p class="text-center text-gray-500">
              Book appointments with just a few clicks, anytime and anywhere.
            </p>
          </div>
          <div
            class="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm"
          >
            <Clock class="h-12 w-12 text-primary" />
            <h3 class="text-xl font-bold">Manage Appointments</h3>
            <p class="text-center text-gray-500">
              View, reschedule, or cancel your appointments with ease.
            </p>
          </div>
          <div
            class="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm"
          >
            <Shield class="h-12 w-12 text-primary" />
            <h3 class="text-xl font-bold">Secure Authentication</h3>
            <p class="text-center text-gray-500">
              Your personal information is protected with our secure
              authentication system.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section
      class="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground flex items-center justify-center"
    >
      <div class="container px-4 md:px-6">
        <div
          class="flex flex-col items-center justify-center space-y-4 text-center"
        >
          <div class="space-y-2">
            <h2
              class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            >
              Ready to simplify your healthcare?
            </h2>
            <p
              class="max-w-[600px] text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
            >
              Join thousands of patients who have made their healthcare journey
              smoother.
            </p>
          </div>
          <div class="flex flex-col gap-2 min-[400px]:flex-row">
            <router-link to="/auth">
              <Button size="lg" variant="secondary" class="group">
                Sign Up Now
                <ArrowRight
                  class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                />
              </Button>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t bg-white flex items-center justify-center">
      <div
        class="container flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between md:py-12 px-4 md:px-6"
      >
        <div class="flex flex-col gap-2">
          <router-link to="/" class="flex items-center gap-2">
            <span class="text-lg font-bold text-primary">MediBook</span>
          </router-link>
          <p class="text-sm text-gray-500">
            © {{ new Date().getFullYear() }} MediBook. All rights reserved.
          </p>
        </div>
        <nav class="flex gap-4 sm:gap-6">
          <router-link
            to="#"
            class="text-sm font-medium hover:underline underline-offset-4"
          >
            Privacy Policy
          </router-link>
          <router-link
            to="#"
            class="text-sm font-medium hover:underline underline-offset-4"
          >
            Contact Us
          </router-link>
        </nav>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Button } from "@/components/ui/button"; // Shadcn Button import as specified
import { ArrowRight, Calendar, Clock, Shield } from "lucide-vue-next"; // Lucide icons for Vue

export default defineComponent({
  name: "HomePage",
  components: {
    Button,
    ArrowRight,
    Calendar,
    Clock,
    Shield,
  },
});
</script>

<style scoped>
/* TailwindCSS handles most styling, but you can add custom styles here if needed */
</style>
