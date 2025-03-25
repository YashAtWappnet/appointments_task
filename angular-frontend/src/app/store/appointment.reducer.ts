import { createReducer, on } from '@ngrx/store';
import { initialAppointmentState, AppointmentState } from './appointment.state';
import * as AppointmentActions from './appointment.actions';
import * as UserActions from './user.actions';

export const appointmentReducer = createReducer(
  initialAppointmentState,
  on(AppointmentActions.loadAppointments, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AppointmentActions.loadAppointmentsSuccess, (state, { appointments }) => ({
    ...state,
    appointments,
    loading: false,
  })),
  on(AppointmentActions.loadAppointmentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AppointmentActions.createAppointment, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AppointmentActions.createAppointmentSuccess, (state, { appointment }) => ({
    ...state,
    appointments: [...state.appointments, appointment],
    loading: false,
  })),
  on(AppointmentActions.createAppointmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(UserActions.logout, (state) => initialAppointmentState) // Reset on logout
);
