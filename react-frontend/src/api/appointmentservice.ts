import { Appointment } from "@/types";
import api, { handleApiError } from "./axios";

export const getAppointments = async (): Promise<{
  status: number;
  data: Appointment[];
}> => {
  try {
    const response = api.get("/appointments");
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const createAppointment = async (appointmentData: {
  date: Date;
  doctorId: number;
  duration: number;
  reason: string;
  time: string;
}): Promise<{ status: number; data: Appointment }> => {
  try {
    const response = await api.post("/appointments", appointmentData);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};
