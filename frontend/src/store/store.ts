import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../lib/features/user/userSlice";
import interestReducer from "../lib/features/interest/interestSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    interests: interestReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
