import { createAction, props } from '@ngrx/store';
import { Appointment } from './appointment.state';

export const loadAppointments = createAction('[Dashboard] Load Appointments');
export const loadAppointmentsSuccess = createAction(
  '[Dashboard] Load Appointments Success',
  props<{ appointments: Appointment[] }>()
);
export const loadAppointmentsFailure = createAction(
  '[Dashboard] Load Appointments Failure',
  props<{ error: string }>()
);

export const createAppointment = createAction(
  '[Dashboard] Create Appointment',
  props<{
    doctorId: number;
    date: string; // ISO Date string
    time: string; // HH:mm:ss
    duration: number;
    reason: string;
  }>()
);
export const createAppointmentSuccess = createAction(
  '[Dashboard] Create Appointment Success',
  props<{ appointment: Appointment }>()
);
export const createAppointmentFailure = createAction(
  '[Dashboard] Create Appointment Failure',
  props<{ error: string }>()
);
