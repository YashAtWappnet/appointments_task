import { User } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: User | null;
  access_token: string | null;
}

const initialState: UserState = {
  user: null,
  access_token: localStorage.getItem("access_token") || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ user: UserState["user"]; access_token: string }>
    ) => {
      state.user = action.payload.user;
      state.access_token = action.payload.access_token;
      localStorage.setItem("access_token", action.payload.access_token);
    },
    removeUser: (state) => {
      state.user = null;
      state.access_token = null;
      localStorage.removeItem("access_token");
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
