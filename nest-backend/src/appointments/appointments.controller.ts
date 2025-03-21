import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Request } from 'express';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  // @Roles([UserRole.PATIENT]) // Only patients can book an appointment
  async createAppointment(
    @Body() dto: CreateAppointmentDto,
    @Req() req: Request,
  ) {
    const patientId = req.user?.id; // Get logged-in patient ID

    return this.appointmentsService.createAppointment(dto, patientId);
  }
}
