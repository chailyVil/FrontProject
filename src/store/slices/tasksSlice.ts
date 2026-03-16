import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { TasksState, Task } from "../../types";
import API from "../../services/api";

// פעולת טעינת המשימות

export const fetchTasks = createAsyncThunk(
    "tasks/fetchAll", 
    async () => {
  const response = await API.get("/TaskItem");
  return response.data;
});
export const addTask = createAsyncThunk(
    "tasks/add",
    async (task: Partial<Task>) => {
      const response = await API.post("/TaskItem", task);
      return response.data;
    }
  );
  // עדכון משימה
export const updateTask = createAsyncThunk(
    "tasks/update",
    async (task: Task) => {
      const response = await API.put(`/TaskItem/${task.Id}`, task);
      return response.data;
    }
  );
  
  // ביטול משימה — משנה סטטוס ל-Canceled
  export const cancelTask = createAsyncThunk(
    "tasks/cancel",
    async (task: Task) => {
      const updatedTask = { ...task, Status: "Canceled" };
      const response = await API.put(`/TaskItem/${task.Id}`, updatedTask);
      return response.data;
    }
  );
  
  const initialState: TasksState = {
    tasks: [],
    loading: false,
    error: null,
  };
  
  const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        // שליפה
        .addCase(fetchTasks.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchTasks.fulfilled, (state, action) => {
          state.loading = false;
          state.tasks = action.payload;
        })
        .addCase(fetchTasks.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || "שגיאה בטעינת משימות";
        })
        // הוספה
        .addCase(addTask.fulfilled, (state, action) => {
          state.tasks.push(action.payload);
        })
        // עדכון
        .addCase(updateTask.fulfilled, (state, action) => {
          const index = state.tasks.findIndex(t => t.Id === action.payload.Id);
          if (index !== -1) state.tasks[index] = action.payload;
        })
        // ביטול
        .addCase(cancelTask.fulfilled, (state, action) => {
          const index = state.tasks.findIndex(t => t.Id === action.payload.Id);
          if (index !== -1) state.tasks[index] = action.payload;
        })
    },
  });
  
  export default tasksSlice.reducer;