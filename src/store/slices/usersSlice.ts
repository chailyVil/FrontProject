import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { UserState, User } from "../../types";
import API from "../../services/api";

const getErrorMessage = (err: any, fallback: string) => {
  const message = err?.response?.data?.message || err?.response?.data?.error || err?.message;
  return message || fallback;
};

export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/User");
      return response.data;
    } catch (err: any) {
      return rejectWithValue(getErrorMessage(err, "שגיאה בטעינת משתמשים"));
    }
  }
);

export const deactivateUser = createAsyncThunk(
  "users/deactivate",
  async (user: User, { rejectWithValue }) => {
    try {
      const updatedUser = { ...user, IsActive: false };
      const response = await API.put(`/User/${user.Id}`, updatedUser);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(getErrorMessage(err, "שגיאה בהשבתת עובד"));
    }
  }
);

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || "שגיאה בטעינת משתמשים";
      })
      .addCase(deactivateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.Id === action.payload.Id);
        if (index !== -1) state.users[index] = action.payload;
      })
  },
});

export default usersSlice.reducer;