import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not } from 'typeorm';
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

    const newDate = dto.date ? new Date(dto.date) : new Date(date);
    newDate.setHours(0, 0, 0, 0); // Normalize to start of the day
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (newDate < now) {
      throw new BadRequestException(
        'You cannot schedule an appointment in the past.',
      );
    }

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
        status: Not(AppointmentStatus.CANCELLED),
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

  async updateAppointment(
    id: number,
    dto: Partial<CreateAppointmentDto>,
    userId?: number,
  ) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found.');
    }

    // Only the patient who booked the appointment can modify it
    if (appointment.patient.id !== userId) {
      throw new ForbiddenException(
        'You are not allowed to modify this appointment.',
      );
    }

    // Prevent updates if the appointment is already Cancelled or Completed
    if (
      appointment.status === AppointmentStatus.CANCELLED ||
      appointment.status === AppointmentStatus.COMPLETED
    ) {
      throw new BadRequestException(
        `This appointment has already been ${appointment.status.toLowerCase()} and cannot be modified.`,
      );
    }

    // If updating the date/time, ensure it's in the future
    if (dto.date || dto.time) {
      const newDate = dto.date
        ? new Date(dto.date)
        : new Date(appointment.date);
      newDate.setHours(0, 0, 0, 0); // Normalize to start of the day
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      if (newDate < now) {
        throw new BadRequestException(
          'You cannot schedule an appointment in the past.',
        );
      }

      if (dto.time) {
        // Convert time string (HH:MM) to Date object
        const [hours, minutes] = dto.time.split(':').map(Number);
        const appointmentStart = new Date(newDate);
        appointmentStart.setHours(hours, minutes, 0, 0);

        const appointmentEnd = new Date(appointmentStart);
        appointmentEnd.setMinutes(
          appointmentEnd.getMinutes() + (dto.duration || appointment.duration),
        );

        // Check for conflicting appointments (excluding Cancelled ones)
        const conflictingAppointment = await this.appointmentRepository.findOne(
          {
            where: {
              doctor: {
                id: appointment.doctor.id,
              },
              date: dto.date || appointment.date, // Use new or existing date
              status: Not(AppointmentStatus.CANCELLED), // Ignore cancelled appointments
              time: Between(
                appointmentStart.toTimeString().split(' ')[0],
                appointmentEnd.toTimeString().split(' ')[0],
              ),
            },
          },
        );

        if (conflictingAppointment) {
          throw new BadRequestException(
            'The doctor is unavailable at this time.',
          );
        }
      }
    }

    // Prevent users from manually setting status to Completed
    if (dto.status && dto.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException(
        'Only doctors can mark an appointment as completed.',
      );
    }

    // Apply updates
    Object.assign(appointment, dto);

    return this.appointmentRepository.save(appointment);
  }

  async completeAppointment(id: number, doctorId?: number) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['doctor'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found.');
    }

    // Ensure only the assigned doctor can complete the appointment
    if (appointment.doctor.id !== doctorId) {
      throw new ForbiddenException(
        'You are not allowed to mark this appointment as completed.',
      );
    }

    // Prevent completing a cancelled appointment
    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException(
        'You cannot complete a cancelled appointment.',
      );
    }

    // Ensure appointment has started before marking it as completed
    const now = new Date();
    const appointmentDate = new Date(appointment.date);
    const [hours, minutes] = appointment.time.split(':').map(Number);

    appointmentDate.setHours(hours, minutes, 0, 0); // Set time for comparison

    if (now < appointmentDate) {
      throw new BadRequestException(
        'You cannot complete an appointment before it starts.',
      );
    }

    // Mark the appointment as completed
    appointment.status = AppointmentStatus.COMPLETED;

    return this.appointmentRepository.save(appointment);
  }

  async getAppointments(userId?: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    let whereCondition = {};
    // If the user is a doctor, fetch their appointments
    if (user.role === UserRole.DOCTOR) {
      whereCondition = {
        doctor: { id: userId },
        status: Not(AppointmentStatus.CANCELLED),
      };
    }
    // If the user is a patient, fetch their appointments
    else if (user.role === UserRole.PATIENT) {
      whereCondition = {
        patient: { id: userId },
        status: Not(AppointmentStatus.CANCELLED),
      };
    } else {
      throw new ForbiddenException(
        'You are not authorized to view appointments.',
      );
    }

    return this.appointmentRepository.find({
      where: whereCondition,
      relations: ['doctor', 'patient'],
      order: { date: 'ASC', time: 'ASC' },
    });
  }

  async getAppointmentById(id: number, userId?: number) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['doctor', 'patient'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found.');
    }

    if (appointment.doctor.id !== userId && appointment.patient.id !== userId) {
      throw new ForbiddenException('Access denied.');
    }

    return appointment;
  }

  async getAvailableSlots(doctorId: number, date: string) {
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0); // Normalize date

    const doctor = await this.userRepository.findOne({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found.');
    }

    // Fetch all non-cancelled appointments for the given doctor & date
    const appointments = await this.appointmentRepository.find({
      where: {
        doctor: { id: doctorId },
        date: selectedDate.toDateString(),
        status: Not(AppointmentStatus.CANCELLED),
      },
    });

    // Define working hours (Adjust as needed)
    const startHour = 9; // 9:00 AM
    const endHour = 17; // 5:00 PM
    const slotDuration = 30; // Each slot is 30 minutes
    const availableSlots: string[] = [];

    // Generate all possible slots within working hours
    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += slotDuration) {
        const slotTime = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

        // Convert slot to a Date object
        const slotDate = new Date(selectedDate);
        slotDate.setHours(hour, min, 0, 0);

        // Check if this slot conflicts with an existing appointment
        const isTaken = appointments.some((appointment) => {
          const appointmentStart = new Date(
            `${appointment.date}T${appointment.time}`,
          );
          const appointmentEnd = new Date(appointmentStart);
          appointmentEnd.setMinutes(
            appointmentEnd.getMinutes() + appointment.duration,
          );
          return slotDate >= appointmentStart && slotDate < appointmentEnd;
        });

        if (!isTaken) {
          availableSlots.push(slotTime);
        }
      }
    }

    return {
      doctorId,
      date,
      availableSlots,
    };
  }
}
