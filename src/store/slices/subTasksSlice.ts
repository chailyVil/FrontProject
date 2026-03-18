import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { SubTasksState, SubTask } from "../../types";
import API from "../../services/api";

export const fetchSubTasks = createAsyncThunk(
  "subTasks/fetchAll",
  async () => {
    const response = await API.get("/SubTask");
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
    const mapped = {
      id: subTask.Id,
      taskId: subTask.TaskId,  // צריך להוסיף TaskId ל-types.ts
      taskName: subTask.TaskName,
      title: subTask.Title,
      description: subTask.Description,
      assignedTo: subTask.AssignedTo,
      status: subTask.Status,
    };
    const response = await API.put(`/SubTask/${subTask.Id}`, mapped);
    return response.data;
  }
);
  
export const cancelSubTask = createAsyncThunk(
    "subTasks/cancel",
    async (subTask: any) => {
      const id = subTask.id || subTask.Id;
      const response = await API.delete(`/SubTask/${id}`);
      return { ...subTask, Status: 3, status: 3 };
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
  const t = action.payload;
  const index = state.subTasks.findIndex((s: any) => (s.id || s.Id) === (t.id || t.Id));
  if (index !== -1) state.subTasks[index] = action.payload;
  // אם לא נמצא — לא מוסיפים!
})
        .addCase(cancelSubTask.fulfilled, (state, action) => {
  const t = action.payload as any;
  const index = state.subTasks.findIndex((s: any) => (s.id || s.Id) === (t.id || t.Id));
  if (index !== -1) state.subTasks[index] = action.payload;
})
    },
  });
  
  export default subTasksSlice.reducer;