import { User } from './user.state';

export enum AppointmentStatus {
  SCHEDULED = 'Scheduled',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export interface Appointment {
  id: number;
  doctor: User;
  patient: User;
  date: Date | string; // ISO Date string (e.g., "2025-03-25T09:00:00Z")
  time: string; // HH:mm:ss
  duration: number; // In minutes
  reason: string;
  status: AppointmentStatus;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

export interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}

export const initialAppointmentState: AppointmentState = {
  appointments: [],
  loading: false,
  error: null,
};
