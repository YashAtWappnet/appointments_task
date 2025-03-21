import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { hash } from 'bcrypt';
import { Appointment } from 'src/appointments/entities/appointment.entity';

export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // Prevents password from being fetched in queries
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.PATIENT })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  doctorAppointments: Appointment[];

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  patientAppointments: Appointment[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}
