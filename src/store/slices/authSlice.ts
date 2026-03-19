import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AuthState, LoginDTO, RegisterDTO } from "../../types";
import API from "../../services/api";

// התחברות
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginDTO) => {
    const response = await API.post("/auth/login", credentials);
    return response.data;
  }
);

// הרשמה
export const register = createAsyncThunk(
  "auth/register",
  async (credentials: RegisterDTO) => {
    const response = await API.post("/auth/register", credentials);
    return response.data;
  }
);

// שחזור יוזר לפי token (אחרי רענון)
export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async () => {
    const response = await API.get("/auth/me");
    return response.data;
  }
);

const token = localStorage.getItem("token");

const initialState: AuthState = {
  user: null,
  token: token,
  isLoggedIn: !!token,
  loading: false,
  error: null,
  isInitialized: !token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.isInitialized = true;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
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

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "שגיאה בהרשמה";
      })

      // fetchMe — שחזור יוזר אחרי רענון
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isInitialized = true;
        // השרת מחזיר camelCase, ממפים ל-PascalCase
        state.user = {
          Id: action.payload.id,
          NameUser: action.payload.nameUser,
          Email: action.payload.email,
          Password: action.payload.password,
          role: action.payload.role,
        };
        state.isLoggedIn = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.isInitialized = true;
        // token לא תקף — ניקוי מלא
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
        localStorage.removeItem("token");
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;