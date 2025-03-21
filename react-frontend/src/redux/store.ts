import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import appointmentReducer from "./slices/appointmentSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    appointments: appointmentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
