import { Appointment } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppointmentState {
  appointments: Appointment[];
}

const initialState: AppointmentState = {
  appointments: [],
};

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload;
    },
    clearAppointments: (state) => {
      state.appointments = [];
    },
  },
});

export const { setAppointments, clearAppointments } = appointmentSlice.actions;
export default appointmentSlice.reducer;
