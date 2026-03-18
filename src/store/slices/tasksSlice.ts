import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { TasksState, Task } from "../../types";
import API from "../../services/api";

export const fetchTasks = createAsyncThunk(
    "tasks/fetchAll", 
    async () => {
      const response = await API.get("/TaskItem");
      return response.data;
    }
);

export const addTask = createAsyncThunk(
    "tasks/add",
    async (task: Partial<Task>) => {
      const response = await API.post("/TaskItem", task);
      return response.data;
    }
);

export const updateTask = createAsyncThunk(
    "tasks/update",
    async (task: Task) => {
      const mapped = {
        id: task.Id,
        projectId: task.ProjectId,
        projectName: task.ProjectName,
        title: task.Title,
        description: task.Description,
        expected: task.Expected,
        assignedTo: task.AssignedTo,
        priority: task.Priority,
        status: task.Status,
        startedAt: task.StartedAt,
        deadline: task.Deadline,
      };
      console.log("sending task:", mapped);  // ✅ הוסיפי את זה
      const response = await API.put(`/TaskItem/${task.Id}`, mapped); // ✅
      return response.data;
    }
);

export const cancelTask = createAsyncThunk(
    "tasks/cancel",
    async (task: Task) => {
      const response = await API.delete(`/TaskItem/${task.Id}`);
      return { ...task, Status: 3 };
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
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.map((t: any) => ({
          Id: t.id,
          ProjectId: t.projectId,
          ProjectName: t.projectName,
          Title: t.title,
          Description: t.description,
          Expected: t.expected,
          AssignedTo: t.assignedTo,
          Priority: t.priority,
          Status: t.status,
          StartedAt: t.startedAt,
          Deadline: t.deadline,
        }));
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "שגיאה בטעינת משימות";
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const t = action.payload;
        state.tasks.push({
          Id: t.id,
          ProjectId: t.projectId,
          ProjectName: t.projectName,
          Title: t.title,
          Description: t.description,
          Expected: t.expected,
          AssignedTo: t.assignedTo,
          Priority: t.priority,
          Status: t.status,
          StartedAt: t.startedAt,
          Deadline: t.deadline,
        });
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const mapped = {
          Id: action.payload.id,
          ProjectId: action.payload.projectId,
          ProjectName: action.payload.projectName,
          Title: action.payload.title,
          Description: action.payload.description,
          Expected: action.payload.expected,
          AssignedTo: action.payload.assignedTo,
          Priority: action.payload.priority,
          Status: action.payload.status,
          StartedAt: action.payload.startedAt,
          Deadline: action.payload.deadline,
        };
        const index = state.tasks.findIndex(t => t.Id === mapped.Id);
        if (index !== -1) state.tasks[index] = mapped;
      })
      .addCase(cancelTask.fulfilled, (state, action) => {
  const t = action.payload;
  const index = state.tasks.findIndex(task => task.Id === t.id);
  if (index !== -1) state.tasks[index] = {
    Id: t.id,
    ProjectId: t.projectId,
    ProjectName: t.projectName,
    Title: t.title,
    Description: t.description,
    Expected: t.expected,
    AssignedTo: t.assignedTo,
    Priority: t.priority,
    Status: t.status,
    StartedAt: t.startedAt,
    Deadline: t.deadline,
  };
})
  },
});

export default tasksSlice.reducer;