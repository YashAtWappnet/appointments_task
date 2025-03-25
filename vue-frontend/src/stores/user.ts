import type { Appointment, AppointmentStatus, User } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

// Pinia Store
export const useUserStore = defineStore("user", () => {
  // State
  const user = ref<User | null>(null); // Logged-in user
  const appointments = ref<Appointment[]>([]); // List of appointments

  // Actions
  const setUser = (newUser: User) => {
    user.value = newUser;
  };

  const removeUser = () => {
    user.value = null; // Logout action
  };

  const addAppointment = (appointment: Appointment) => {
    appointments.value.push(appointment);
  };

  const updateAppointment = (updatedAppointment: Appointment) => {
    const index = appointments.value.findIndex(
      (appt) => appt.id === updatedAppointment.id
    );
    if (index !== -1) {
      appointments.value[index] = updatedAppointment;
    }
  };

  const removeAppointment = (appointmentId: number) => {
    appointments.value = appointments.value.filter(
      (appt) => appt.id !== appointmentId
    );
  };

  // Getters (computed-like properties)
  const isAuthenticated = () => !!user.value;
  const userRole = () => user.value?.role || null;
  const getAppointmentsByStatus = (status: AppointmentStatus) =>
    appointments.value.filter((appt) => appt.status === status);

  return {
    user,
    appointments,
    setUser,
    removeUser,
    addAppointment,
    updateAppointment,
    removeAppointment,
    isAuthenticated,
    userRole,
    getAppointmentsByStatus,
  };
});
