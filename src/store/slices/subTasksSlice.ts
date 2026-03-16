import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { SubTasksState, SubTask } from "../../types";
import API from "../../services/api";

export const fetchSubTasks = createAsyncThunk(
    "subTasks/fetchAll",
    async (taskId: number) => {
      const response = await API.get(`/SubTask/${taskId}`);
      return response.data;
    }
  );
  
  export const addSubTask = createAsyncThunk(
    "subTasks/add",
    async (subTask: Partial<SubTask>) => {
      const response = await API.post("/SubTask", subTask);
      return response.data;
    }
  );
  
  export const updateSubTask = createAsyncThunk(
    "subTasks/update",
    async (subTask: SubTask) => {
      const response = await API.put(`/SubTask/${subTask.Id}`, subTask);
      return response.data;
    }
  );
  
  export const cancelSubTask = createAsyncThunk(
    "subTasks/cancel",
    async (subTask: SubTask) => {
      const updatedSubTask = { ...subTask, Status: "Canceled" };
      const response = await API.put(`/SubTask/${subTask.Id}`, updatedSubTask);
      return response.data;
    }
  );
  
  const initialState: SubTasksState = {
    subTasks: [],
    loading: false,
    error: null,
  };
  
  const subTasksSlice = createSlice({
    name: "subTasks",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchSubTasks.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchSubTasks.fulfilled, (state, action) => {
          state.loading = false;
          state.subTasks = action.payload;
        })
        .addCase(fetchSubTasks.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || "שגיאה בטעינת תתי משימות";
        })
        .addCase(addSubTask.fulfilled, (state, action) => {
          state.subTasks.push(action.payload);
        })
        .addCase(updateSubTask.fulfilled, (state, action) => {
          const index = state.subTasks.findIndex(s => s.Id === action.payload.Id);
          if (index !== -1) state.subTasks[index] = action.payload;
        })
        .addCase(cancelSubTask.fulfilled, (state, action) => {
          const index = state.subTasks.findIndex(s => s.Id === action.payload.Id);
          if (index !== -1) state.subTasks[index] = action.payload;
        })
    },
  });
  
  export default subTasksSlice.reducer;