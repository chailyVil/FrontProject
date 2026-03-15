import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthState, LoginDTO } from "../../types";
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
      // התחברות הצליחה
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        localStorage.setItem("token", action.payload.token);
      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;