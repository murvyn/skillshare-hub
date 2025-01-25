import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  interests: [],
  status: "idle",
  error: null,
};

const interestsSlice = createSlice({
  name: "interests",
  initialState,
  reducers: {
    setInterests: (state, action) => {
      state.interests = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setInterests, setStatus, setError } = interestsSlice.actions;

export default interestsSlice.reducer;