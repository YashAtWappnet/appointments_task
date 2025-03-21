import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  BadRequestException,
  Patch,
  Param,
  ParseIntPipe,
  Get,
  Query,
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

  @Get('available-slots')
  async getAvailableSlots(
    @Query('doctorId', ParseIntPipe) doctorId: number,
    @Query('date') date: string,
  ) {
    return this.appointmentsService.getAvailableSlots(doctorId, date);
  }

  @Patch(':id')
  updateAppointment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateAppointmentDto>,
    @Req() req: Request, // Extract user ID from JWT
  ) {
    return this.appointmentsService.updateAppointment(id, dto, req.user?.id);
  }

  @Patch(':id/complete')
  completeAppointment(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request, // Extract user ID from JWT
  ) {
    return this.appointmentsService.completeAppointment(id, req.user?.id);
  }

  @Get(':id')
  async getAppointmentById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    return this.appointmentsService.getAppointmentById(id, req.user?.id);
  }

  @Get()
  async getUserAppointments(@Req() req: Request) {
    return this.appointmentsService.getAppointments(req.user?.id);
  }
}
