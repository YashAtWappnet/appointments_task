<template>
  <div
    class="min-h-screen bg-gradient-to-b from-white to-blue-50 flex justify-center"
  >
    <main class="container px-4 py-6 md:py-10">
      <!-- Unauthorized state -->
      <template v-if="!store.user">
        <h1 class="text-3xl font-bold tracking-tight text-center">
          You need to be logged in to access this page.
        </h1>
      </template>

      <!-- Authorized state -->
      <template v-else>
        <!-- Top section -->
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 class="text-3xl font-bold tracking-tight">
              {{
                store.user.role === "patient"
                  ? "My Appointments"
                  : "Patient Appointments"
              }}
            </h1>
            <p class="text-muted-foreground">
              {{
                store.user.role === "patient"
                  ? "Manage your upcoming medical appointments"
                  : "View and manage your scheduled patient appointments"
              }}
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <Popover>
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  class="w-full sm:w-auto justify-start text-left font-normal"
                >
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  {{ date ? format(date, "PPP") : "Pick a date" }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <Calendar v-model="date" mode="single" :initial-focus="true" />
              </PopoverContent>
            </Popover>

            <Button
              v-if="store.user.role === 'patient'"
              @click="isNewAppointmentOpen = true"
            >
              <Plus class="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </div>
        </div>

        <!-- Appointments list -->
        <div
          v-if="appointments.length === 0"
          class="flex flex-col items-center justify-center py-12 text-center"
        >
          <CalendarIcon2 class="h-12 w-12 text-muted-foreground mb-4" />
          <h3 class="text-lg font-medium">No appointments found</h3>
          <p class="text-muted-foreground mt-1">
            {{
              store.user.role === "patient"
                ? "You don’t have any appointments scheduled for this date."
                : "You don’t have any patient appointments scheduled for this date."
            }}
          </p>
          <Button
            v-if="store.user.role === 'patient'"
            variant="outline"
            class="mt-4"
            @click="isNewAppointmentOpen = true"
          >
            Schedule an appointment
          </Button>
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <Card
            v-for="appointment in appointments"
            :key="appointment.id"
            :class="[
              'cursor-pointer transition-all hover:shadow-md',
              appointment.status === 'Completed'
                ? 'border-l-4 border-l-green-500'
                : 'border-l-4 border-l-primary',
            ]"
            @click="handleAppointmentClick(appointment)"
          >
            <CardHeader class="pb-2">
              <div class="flex justify-between items-start">
                <CardTitle>
                  {{
                    store.user.role === "patient"
                      ? appointment.doctor.name
                      : appointment.patient.name
                  }}
                </CardTitle>
                <div
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    appointment.status === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800',
                  ]"
                >
                  {{ appointment.status }}
                </div>
              </div>
              <CardDescription>{{ appointment.reason }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="flex items-center text-sm mb-1">
                <CalendarIcon2 class="mr-2 h-4 w-4 text-muted-foreground" />
                {{ format(new Date(appointment.date), "EEEE, MMMM d, yyyy") }}
              </div>
              <div class="flex items-center text-sm">
                <Clock class="mr-2 h-4 w-4 text-muted-foreground" />
                {{ formatTime(appointment.time) }}
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Appointment Details Modal -->
        <Dialog :open="isDetailsOpen" @update:open="isDetailsOpen = $event">
          <DialogContent class="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>
                {{
                  store.user.role === "patient"
                    ? "View or modify your appointment details"
                    : "View your patient’s appointment details"
                }}
              </DialogDescription>
            </DialogHeader>

            <div v-if="selectedAppointment" class="space-y-4 py-2">
              <div class="flex items-start gap-4">
                <div
                  class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <User class="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 class="font-medium">
                    {{
                      store.user.role === "patient"
                        ? selectedAppointment.doctor.name
                        : selectedAppointment.patient.name
                    }}
                  </h3>
                </div>
              </div>

              <div class="grid gap-2">
                <div class="flex items-center">
                  <CalendarIcon2 class="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{{
                    format(
                      new Date(selectedAppointment.date),
                      "EEEE, MMMM d, yyyy"
                    )
                  }}</span>
                </div>
                <div class="flex items-center">
                  <Clock class="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{{ formatTime(selectedAppointment.time) }}</span>
                </div>
                <div class="flex items-center">
                  <CheckCircle2
                    v-if="selectedAppointment.status === 'Completed'"
                    class="mr-2 h-4 w-4 text-green-500"
                  />
                  <AlertCircle v-else class="mr-2 h-4 w-4 text-primary" />
                  <span>{{ selectedAppointment.status }}</span>
                </div>
              </div>

              <div>
                <h4 class="text-sm font-medium mb-1">
                  {{
                    store.user.role === "patient" ? "Notes" : "Reason for Visit"
                  }}
                </h4>
                <p class="text-sm text-muted-foreground">
                  {{ selectedAppointment.reason }}
                </p>
              </div>

              <div
                v-if="
                  store.user.role === 'patient' &&
                  selectedAppointment.status === 'Scheduled'
                "
              >
                <h4 class="text-sm font-medium mb-1">Reschedule</h4>
                <div class="flex gap-2">
                  <Popover>
                    <PopoverTrigger as-child>
                      <Button
                        variant="outline"
                        size="sm"
                        class="w-[150px] justify-start text-left font-normal"
                      >
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        {{ format(new Date(selectedAppointment.date), "PPP") }}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0">
                      <Calendar
                        v-model="rescheduleDate"
                        mode="single"
                        initial-focus
                        @update:model-value="updateAppointmentDate"
                      />
                    </PopoverContent>
                  </Popover>

                  <Select
                    v-model="rescheduleTime"
                    @update:model-value="updateAppointmentTime"
                  >
                    <SelectTrigger class="w-[110px]">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="13:00">1:00 PM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter
              class="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2"
            >
              <Button variant="outline" @click="isDetailsOpen = false">
                Cancel
              </Button>

              <Button
                v-if="
                  store.user.role === 'patient' &&
                  selectedAppointment?.status === 'Scheduled'
                "
                @click="isDetailsOpen = false"
              >
                Update Appointment
              </Button>

              <Button
                v-if="store.user.role === 'doctor'"
                :variant="
                  selectedAppointment?.status === 'Completed'
                    ? 'outline'
                    : 'default'
                "
                @click="handleStatusChange"
              >
                {{
                  selectedAppointment?.status === "Completed"
                    ? "Mark as Scheduled"
                    : "Mark as Completed"
                }}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <!-- New Appointment Modal -->
        <Dialog
          :open="isNewAppointmentOpen"
          @update:open="isNewAppointmentOpen = $event"
        >
          <DialogContent class="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>
                Fill in the details to book your appointment with a doctor.
              </DialogDescription>
            </DialogHeader>

            <div class="grid gap-4 py-4">
              <div class="grid gap-2">
                <Label for="doctor">Select Doctor</Label>
                <Select v-model="newAppointment.doctor">
                  <SelectTrigger id="doctor">
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="doctor in doctors"
                      :key="doctor.id"
                      :value="doctor.id.toString()"
                    >
                      {{ doctor.name }} - {{ doctor.specialty }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                  <Label for="date">Date</Label>
                  <Popover>
                    <PopoverTrigger as-child>
                      <Button
                        id="date"
                        variant="outline"
                        class="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        {{
                          newAppointment.date
                            ? format(newAppointment.date, "PPP")
                            : "Pick a date"
                        }}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0">
                      <Calendar
                        v-model="newAppointment.date"
                        mode="single"
                        initial-focus
                        :disabled="
                          (date) =>
                            date < new Date() ||
                            date.getDay() === 0 ||
                            date.getDay() === 6
                        "
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div class="grid gap-2">
                  <Label for="time">Time</Label>
                  <Select v-model="newAppointment.time">
                    <SelectTrigger id="time">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="13:00">1:00 PM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div class="grid gap-2">
                <Label for="notes">Reason</Label>
                <Input
                  id="notes"
                  placeholder="Any specific concerns or information for the doctor"
                  v-model="newAppointment.reason"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" @click="isNewAppointmentOpen = false">
                Cancel
              </Button>
              <Button @click="handleScheduleAppointment">
                Schedule Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </template>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CalendarIcon,
  Clock,
  Plus,
  User,
  CheckCircle2,
  AlertCircle,
  CalendarPlus2,
} from "lucide-vue-next";
import { AppointmentStatus, UserRole, type Appointment } from "@/types";
import api from "@/services/api";
// import CalendarPlus2Icon from 'lucide-vue-next/dist/esm/icons/calendar-plus-2';

// Mock doctors data
const doctors = [
  { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiologist" },
  { id: 6, name: "Dr. Michael Chen", specialty: "Dermatologist" },
  { id: 7, name: "Dr. Emily Rodriguez", specialty: "General Practitioner" },
  { id: 8, name: "Dr. David Wilson", specialty: "Neurologist" },
  { id: 11, name: "Dr. Lisa Thompson", specialty: "Pediatrician" },
];

export default defineComponent({
  name: "DashboardPage",
  components: {
    Button,
    Calendar,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Input,
    Label,
    CalendarIcon,
    Clock,
    Plus,
    User,
    CheckCircle2,
    AlertCircle,
    CalendarPlus2,
  },
  setup() {
    const store = useUserStore();
    const appointments = ref<Appointment[]>([]);
    const date = ref<Date | undefined>(new Date());
    const selectedAppointment = ref<Appointment | null>(null);
    const isDetailsOpen = ref(false);
    const isNewAppointmentOpen = ref(false);
    const rescheduleDate = ref<Date | undefined>(new Date());
    const rescheduleTime = ref<string>("");

    const userRole = UserRole;

    const newAppointment = ref({
      doctor: "",
      date: new Date() as Date | undefined,
      time: "09:00",
      duration: 30,
      reason: "",
    });

    // Fetch appointments on mount
    onMounted(async () => {
      try {
        const res = await api.get("/appointments"); // Assuming endpoint is /appointments
        appointments.value = res.data;
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    });

    const handleAppointmentClick = (appointment: Appointment) => {
      selectedAppointment.value = { ...appointment }; // Clone to avoid mutating original
      rescheduleDate.value = new Date(appointment.date);
      rescheduleTime.value = appointment.time.slice(0, 5); // HH:mm format
      isDetailsOpen.value = true;
    };

    const handleStatusChange = () => {
      if (selectedAppointment.value) {
        selectedAppointment.value.status =
          selectedAppointment.value.status === AppointmentStatus.SCHEDULED
            ? AppointmentStatus.COMPLETED
            : AppointmentStatus.SCHEDULED;
        // Update appointments array (in a real app, you'd call an API here)
        const index = appointments.value.findIndex(
          (appt) => appt.id === selectedAppointment.value!.id
        );
        if (index !== -1) {
          appointments.value[index] = { ...selectedAppointment.value };
        }
        isDetailsOpen.value = false;
      }
    };

    const updateAppointmentDate = (newDate: Date) => {
      if (selectedAppointment.value && newDate) {
        const updatedDate = new Date(selectedAppointment.value.date);
        updatedDate.setFullYear(
          newDate.getFullYear(),
          newDate.getMonth(),
          newDate.getDate()
        );
        selectedAppointment.value.date = updatedDate
          .toISOString()
          .split("T")[0]; // YYYY-MM-DD
      }
    };

    const updateAppointmentTime = (newTime: string) => {
      if (selectedAppointment.value) {
        selectedAppointment.value.time = newTime + ":00"; // Add seconds for consistency
      }
    };

    const handleScheduleAppointment = async () => {
      try {
        const res = await api.post("/appointments", {
          doctorId: Number(newAppointment.value.doctor),
          date: newAppointment.value.date.toISOString().split("T")[0], // YYYY-MM-DD
          time: newAppointment.value.time + ":00", // HH:mm:ss
          duration: newAppointment.value.duration,
          reason: newAppointment.value.reason,
        });
        appointments.value.push(res.data);
        isNewAppointmentOpen.value = false;
      } catch (error) {
        console.error("Failed to create appointment:", error);
      }
    };

    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      const period = hours >= 12 ? "PM" : "AM";
      const adjustedHours = hours % 12 || 12;
      return `${adjustedHours}:${minutes
        .toString()
        .padStart(2, "0")} ${period}`;
    };

    return {
      store,
      appointments,
      date,
      selectedAppointment,
      isDetailsOpen,
      isNewAppointmentOpen,
      newAppointment,
      doctors,
      rescheduleDate,
      rescheduleTime,
      handleAppointmentClick,
      handleStatusChange,
      handleScheduleAppointment,
      updateAppointmentDate,
      updateAppointmentTime,
      format,
      formatTime,
    };
  },
});
</script>

<style scoped>
/* TailwindCSS handles styling */
</style>
