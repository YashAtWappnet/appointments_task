import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as AppointmentActions from './appointment.actions';
import { Appointment } from './appointment.state';

@Injectable()
export class AppointmentEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  loadAppointments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.loadAppointments),
      switchMap(() =>
        this.http.get<Appointment[]>('http://localhost:3000/appointments').pipe(
          map((appointments) => {
            console.log('Appointment response', appointments);
            return AppointmentActions.loadAppointmentsSuccess({
              appointments: appointments, // Directly use the array
            });
          }),
          catchError((error) =>
            of(
              AppointmentActions.loadAppointmentsFailure({
                error: error.message || 'Failed to load appointments',
              })
            )
          )
        )
      )
    )
  );

  createAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.createAppointment),
      switchMap(({ doctorId, date, time, duration, reason }) =>
        this.http
          .post<Appointment>('http://localhost:3000/appointments', {
            doctorId,
            date,
            time,
            duration,
            reason,
          })
          .pipe(
            map((appointment) => {
              console.log('Created appointment', appointment);
              return AppointmentActions.createAppointmentSuccess({
                appointment: appointment, // Expect a single Appointment object
              });
            }),
            catchError((error) =>
              of(
                AppointmentActions.createAppointmentFailure({
                  error: error.message || 'Failed to create appointment',
                })
              )
            )
          )
      )
    )
  );
}
