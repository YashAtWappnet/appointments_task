import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createAppointment(dto: CreateAppointmentDto, patientId?: number) {
    const { doctorId, date, time, duration, reason } = dto;

    // 1️⃣ Validate doctor exists and has DOCTOR role
    const doctor = await this.userRepository.findOne({
      where: { id: doctorId, role: UserRole.DOCTOR },
    });
    if (!doctor)
      throw new BadRequestException('Invalid doctorId. Must be a doctor.');

    // 2️⃣ Validate patient exists and has PATIENT role
    const patient = await this.userRepository.findOne({
      where: { id: patientId, role: UserRole.PATIENT },
    });
    if (!patient)
      throw new BadRequestException('Invalid patient. Must be a patient.');

    // 3️⃣ Convert time string to Date
    const [hours, minutes] = time.split(':').map(Number);
    const appointmentStart = new Date(date);
    appointmentStart.setHours(hours, minutes, 0, 0);

    const appointmentEnd = new Date(appointmentStart);
    appointmentEnd.setMinutes(appointmentEnd.getMinutes() + duration);

    const appointmentStartTime = appointmentStart.toTimeString().split(' ')[0];
    const appointmentEndTime = appointmentEnd.toTimeString().split(' ')[0];

    // 4️⃣ Validate time slot availability
    const conflictingAppointment = await this.appointmentRepository.findOne({
      where: {
        doctor: {
          id: doctorId,
        },
        date,
        time: Between(appointmentStartTime, appointmentEndTime),
      },
    });

    if (conflictingAppointment) {
      throw new BadRequestException('Doctor is unavailable at this time.');
    }

    // 5️⃣ Create and save appointment
    const appointment = this.appointmentRepository.create({
      doctor,
      patient,
      date,
      time, // Keep it as string in HH:mm format
      duration,
      reason,
      status: AppointmentStatus.SCHEDULED,
    });

    return this.appointmentRepository.save(appointment);
  }
}
