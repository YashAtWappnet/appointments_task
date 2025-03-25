import { AppointmentState } from './appointment.state';

export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const initialUserState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export interface AppState {
  user: UserState;
  appointments: AppointmentState;
}
