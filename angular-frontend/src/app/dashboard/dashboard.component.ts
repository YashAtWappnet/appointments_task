import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Appointment, AppointmentStatus } from '../store/appointment.state';
import * as AppointmentActions from '../store/appointment.actions';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppState, User } from '../store/user.state';
import { format } from 'date-fns';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  private store = inject(Store<AppState>);
  private fb = inject(FormBuilder);

  user$: Observable<User | null> = this.store.select(
    (state) => state.user.user
  );
  appointments$: Observable<Appointment[]> = this.store.select(
    (state) => state.appointments?.appointments || []
  );
  loading$: Observable<boolean> = this.store.select(
    (state) => state.appointments.loading
  );
  error$: Observable<string | null> = this.store.select(
    (state) => state.appointments.error
  );

  date: Date = new Date();
  selectedAppointment: Appointment | null = null;
  isDetailsOpen = false;
  isNewAppointmentOpen = false;

  newAppointmentForm: FormGroup = this.fb.group({
    doctor: ['', Validators.required],
    date: [new Date(), Validators.required],
    time: ['09:00', Validators.required],
    duration: [30, Validators.required],
    reason: ['', Validators.required],
  });

  doctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiologist' },
    { id: 6, name: 'Dr. Michael Chen', specialty: 'Dermatologist' },
    { id: 7, name: 'Dr. Emily Rodriguez', specialty: 'General Practitioner' },
    { id: 8, name: 'Dr. David Wilson', specialty: 'Neurologist' },
    { id: 11, name: 'Dr. Lisa Thompson', specialty: 'Pediatrician' },
  ];

  constructor() {
    this.store.dispatch(AppointmentActions.loadAppointments());
  }

  formatDate(date: string | Date): string {
    return format(new Date(date), 'PPP');
  }

  formatTime(date: string | Date): string {
    return format(new Date(date), 'h:mm a');
  }

  handleAppointmentClick(appointment: Appointment) {
    this.selectedAppointment = { ...appointment };
    this.isDetailsOpen = true;
  }

  handleStatusChange() {
    if (this.selectedAppointment) {
      this.selectedAppointment.status =
        this.selectedAppointment.status === AppointmentStatus.SCHEDULED
          ? AppointmentStatus.COMPLETED
          : AppointmentStatus.SCHEDULED;
      this.isDetailsOpen = false;
    }
  }

  handleScheduleAppointment() {
    if (this.newAppointmentForm.valid) {
      const { doctor, date, time, duration, reason } =
        this.newAppointmentForm.value;
      const isoDate = new Date(date);
      const [hours, minutes] = time.split(':');
      isoDate.setHours(+hours, +minutes);

      this.store.dispatch(
        AppointmentActions.createAppointment({
          doctorId: +doctor,
          date: isoDate.toISOString(),
          time,
          duration,
          reason,
        })
      );
      this.isNewAppointmentOpen = false;
      this.newAppointmentForm.reset({
        doctor: '',
        date: new Date(),
        time: '09:00',
        duration: 30,
        reason: '',
      });
    }
  }
}
