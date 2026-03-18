import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { HistoryState } from "../../types";
import API from "../../services/api";
export const fetchHistory = createAsyncThunk(
    "history/fetchAll",
    async () => {
      const response = await API.get('/History');
      return response.data;
    }
);
const initialState: HistoryState = {
    history: [],
    loading: false,
    error: null,
  };
  
  const historySlice = createSlice({
    name: "history",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchHistory.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchHistory.fulfilled, (state, action) => {
          state.loading = false;
          state.history = action.payload;
        })
        .addCase(fetchHistory.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || "שגיאה בטעינת היסטוריה";
        })
    },
  });
  export default historySlice.reducer;

  