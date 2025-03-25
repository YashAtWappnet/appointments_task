// Types (you can move these to a separate `src/types/index.ts` file if preferred)
export enum UserRole {
  PATIENT = "patient",
  DOCTOR = "doctor",
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string; // ISO Date string
}

export enum AppointmentStatus {
  SCHEDULED = "Scheduled",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export interface Appointment {
  id: number;
  doctor: User;
  patient: User;
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:mm:ss
  duration: number; // In minutes
  reason: string;
  status: AppointmentStatus;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}
