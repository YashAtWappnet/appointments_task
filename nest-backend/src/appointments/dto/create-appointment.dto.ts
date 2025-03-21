import {
  IsDateString,
  IsInt,
  IsString,
  Min,
  Max,
  Matches,
  IsMilitaryTime,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @IsInt()
  doctorId: number;

  @IsDateString()
  date: string; // Format: YYYY-MM-DD

  @IsMilitaryTime()
  time: string; // Format: HH:mm (24-hour)

  @IsInt()
  @Min(30)
  @Max(60)
  duration: number; // Duration in minutes (30-60 min)

  @IsString()
  reason: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}
