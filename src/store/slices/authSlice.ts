import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AuthState, LoginDTO ,RegisterDTO} from "../../types";
import API from "../../services/api";

// פעולת התחברות
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginDTO) => {
    const response = await API.post("/auth/login", credentials);
    return response.data;
  }
);

// פעולת הרשמה
export const register = createAsyncThunk(
  "auth/register",
  async (credentials: RegisterDTO) => {
    const response = await API.post("/auth/register", credentials);
    return response.data;
  }
);

const initialState: AuthState = {
  user: null,
  token: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // התנתקות
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "שגיאה בהתחברות";
      })
  },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;