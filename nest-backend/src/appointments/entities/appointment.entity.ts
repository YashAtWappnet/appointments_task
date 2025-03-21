import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

export enum AppointmentStatus {
  SCHEDULED = 'Scheduled',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.doctorAppointments, { eager: true })
  doctor: User;

  @ManyToOne(() => User, (user) => user.patientAppointments, { eager: true })
  patient: User;

  @Column({ type: 'date' })
  date: string; // Format: YYYY-MM-DD

  @Column({ type: 'time' })
  time: string; // Format: HH:mm:ss (Military time)

  @Column({ type: 'int' })
  duration: number; // Duration in minutes

  @Column({ type: 'text' })
  reason: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED, // Default value
  })
  status: AppointmentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
