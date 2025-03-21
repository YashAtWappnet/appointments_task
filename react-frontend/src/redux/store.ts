import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import appointmentReducer from "./slices/appointmentSlice";
import storage from "redux-persist/lib/storage"; // Uses localStorage by default
import { persistReducer, persistStore } from "redux-persist";

import { combineReducers } from "redux";

// 🔹 Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  appointments: appointmentReducer,
});

// 🔹 Configure Redux Persist
const persistConfig = {
  key: "root", // Key for localStorage
  storage, // Default storage method
};

// 🔹 Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🔹 Configure store with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed to avoid errors with non-serializable values
    }),
});

// 🔹 Persistor for persisting store
export const persistor = persistStore(store);

// 🔹 Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
