import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  Clock,
  Plus,
  User,
  CalendarPlus2Icon as CalendarIcon2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Appointment, AppointmentStatus, UserRole } from "@/types";
import { createAppointment, getAppointments } from "@/api/appointmentservice";

// Mock data for doctors
const doctors = [
  { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiologist" },
  { id: 6, name: "Dr. Michael Chen", specialty: "Dermatologist" },
  { id: 7, name: "Dr. Emily Rodriguez", specialty: "General Practitioner" },
  { id: 8, name: "Dr. David Wilson", specialty: "Neurologist" },
  { id: 11, name: "Dr. Lisa Thompson", specialty: "Pediatrician" },
];

export function Dashboard() {
  const { user } = useSelector((state: RootState) => state.user);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);

  // New appointment form state
  const [newAppointment, setNewAppointment] = useState({
    doctor: "",
    date: new Date(),
    time: "09:00",
    duration: 30,
    reason: "",
  });

  useEffect(() => {
    const fetchUserAppointments = async () => {
      const res = await getAppointments();
      console.log(res);
      setAppointments(res.data);
    };
    fetchUserAppointments();
  }, []);

  if (!user) {
    // alert("You need to be logged in to access this page.");
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex justify-center items-center ">
        <main className="container px-4 py-6 md:py-10 ">
          <h1 className="text-3xl font-bold tracking-tight text-center">
            You need to be logged in to access this page.
          </h1>
        </main>
      </div>
    );
  }

  // Filter appointments by selected date
  // const filteredAppointments = appointments.filter((appointment) =>
  //   date ? appointment.date.toDateString() === date.toDateString() : true
  // );

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsOpen(true);
  };

  const handleStatusChange = () => {
    if (selectedAppointment) {
      selectedAppointment.status =
        selectedAppointment.status === AppointmentStatus.SCHEDULED
          ? AppointmentStatus.COMPLETED
          : AppointmentStatus.SCHEDULED;
      setIsDetailsOpen(false);
    }
  };

  const handleScheduleAppointment = async () => {
    // Schedule new appointment
    console.log(newAppointment);
    try {
      const res = await createAppointment({
        date: newAppointment.date,
        doctorId: Number(newAppointment.doctor),
        duration: newAppointment.duration,
        reason: newAppointment.reason,
        time: newAppointment.time,
      });
      console.log(res);
      setAppointments([...appointments, res.data]);
    } catch (error) {
      console.error(error);
    }

    setIsNewAppointmentOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex justify-center ">
      <main className="container px-4 py-6 md:py-10">
        {/* Top section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {user.role === UserRole.PATIENT
                ? "My Appointments"
                : "Patient Appointments"}
            </h1>
            <p className="text-muted-foreground">
              {user.role === "patient"
                ? "Manage your upcoming medical appointments"
                : "View and manage your scheduled patient appointments"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {user.role === "patient" && (
              <Button onClick={() => setIsNewAppointmentOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Appointment
              </Button>
            )}
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarIcon2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No appointments found</h3>
            <p className="text-muted-foreground mt-1">
              {user.role === "patient"
                ? "You don't have any appointments scheduled for this date."
                : "You don't have any patient appointments scheduled for this date."}
            </p>
            {user.role === "patient" && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsNewAppointmentOpen(true)}
              >
                Schedule an appointment
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment) => (
              <Card
                key={appointment.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  appointment.status === "Completed"
                    ? "border-l-4 border-l-green-500"
                    : "border-l-4 border-l-primary"
                )}
                onClick={() => handleAppointmentClick(appointment)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>
                      {user.role === "patient"
                        ? appointment.doctor.name
                        : appointment.patient.name}
                    </CardTitle>
                    <div
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        appointment.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      )}
                    >
                      {appointment.status}
                    </div>
                  </div>
                  <CardDescription>{appointment.reason}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm mb-1">
                    <CalendarIcon2 className="mr-2 h-4 w-4 text-muted-foreground" />
                    {format(appointment.date, "EEEE, MMMM d, yyyy")}
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    {format(appointment.date, "h:mm a")}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Appointment Details Modal */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>
                {user.role === "patient"
                  ? "View or modify your appointment details"
                  : "View your patient's appointment details"}
              </DialogDescription>
            </DialogHeader>

            {selectedAppointment && (
              <div className="space-y-4 py-2">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {user.role === "patient"
                        ? selectedAppointment.doctor.name
                        : selectedAppointment.patient.name}
                    </h3>
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <CalendarIcon2 className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(selectedAppointment.date, "EEEE, MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{format(selectedAppointment.date, "h:mm a")}</span>
                  </div>
                  <div className="flex items-center">
                    {selectedAppointment.status === "Completed" ? (
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="mr-2 h-4 w-4 text-primary" />
                    )}
                    <span>{selectedAppointment.status}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">
                    {user.role === "patient" ? "Notes" : "Reason for Visit"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedAppointment.reason}
                  </p>
                </div>

                {user.role === "patient" &&
                  selectedAppointment.status === "Scheduled" && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Reschedule</h4>
                      <div className="flex gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-[150px] justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {format(selectedAppointment.date, "PPP")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={new Date(selectedAppointment.date)}
                              onSelect={(date) => {
                                if (date) {
                                  const newDate = new Date(
                                    selectedAppointment.date
                                  );
                                  newDate.setFullYear(date.getFullYear());
                                  newDate.setMonth(date.getMonth());
                                  newDate.setDate(date.getDate());
                                  selectedAppointment.date =
                                    newDate.toDateString();
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <Select
                          defaultValue={format(
                            selectedAppointment.date,
                            "HH:mm"
                          )}
                          onValueChange={(value) => {
                            const [hours, minutes] = value
                              .split(":")
                              .map(Number);
                            const newDate = new Date(selectedAppointment.date);
                            newDate.setHours(hours);
                            newDate.setMinutes(minutes);
                            selectedAppointment.date = newDate.toDateString();
                          }}
                        >
                          <SelectTrigger className="w-[110px]">
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
                  )}
              </div>
            )}

            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                Cancel
              </Button>

              {user.role === "patient" &&
                selectedAppointment?.status === "Scheduled" && (
                  <Button onClick={() => setIsDetailsOpen(false)}>
                    Update Appointment
                  </Button>
                )}

              {user.role === "doctor" && (
                <Button
                  onClick={handleStatusChange}
                  variant={
                    selectedAppointment?.status === "Completed"
                      ? "outline"
                      : "default"
                  }
                >
                  {selectedAppointment?.status === "Completed"
                    ? "Mark as Scheduled"
                    : "Mark as Completed"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* New Appointment Modal */}
        <Dialog
          open={isNewAppointmentOpen}
          onOpenChange={setIsNewAppointmentOpen}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>
                Fill in the details to book your appointment with a doctor.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="doctor">Select Doctor</Label>
                <Select
                  value={newAppointment.doctor}
                  onValueChange={(value) =>
                    setNewAppointment({ ...newAppointment, doctor: value })
                  }
                >
                  <SelectTrigger id="doctor">
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        {doctor.name} - {doctor.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newAppointment.date
                          ? format(newAppointment.date, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newAppointment.date}
                        onSelect={(date) =>
                          date && setNewAppointment({ ...newAppointment, date })
                        }
                        initialFocus
                        disabled={(date) =>
                          date < new Date() ||
                          date.getDay() === 0 ||
                          date.getDay() === 6
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Select
                    value={newAppointment.time}
                    onValueChange={(time) =>
                      setNewAppointment({ ...newAppointment, time })
                    }
                  >
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

              <div className="grid gap-2">
                <Label htmlFor="notes">Reason</Label>
                <Input
                  id="notes"
                  placeholder="Any specific concerns or information for the doctor"
                  value={newAppointment.reason}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      reason: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsNewAppointmentOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => handleScheduleAppointment()}>
                Schedule Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
