import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Project,ProjectsState } from "../../types";
import API from "../../services/api";

const getErrorMessage = (err: any, fallback: string) => {
  const message = err?.response?.data?.message || err?.response?.data?.error || err?.message;
  return message || fallback;
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/Project");
      return response.data as Project[];
    } catch (err: any) {
      return rejectWithValue(getErrorMessage(err, "שגיאה בטעינת פרויקטים"));
    }
  }
);
export const addProject = createAsyncThunk(
    "projects/add",
    async (project: Partial<Project>, { rejectWithValue }) => {
      try {
        const response = await API.post("/Project", project);
        return response.data;
      } catch (err: any) {
        return rejectWithValue(getErrorMessage(err, "שגיאה בהוספת פרויקט"));
      }
    }
  );
  
  export const updateProject = createAsyncThunk(
    "projects/update",
    async (project: Project, { rejectWithValue }) => {
      try {
        const response = await API.put(`/Project/${project.Id}`, project);
        return response.data;
      } catch (err: any) {
        return rejectWithValue(getErrorMessage(err, "שגיאה בעדכון פרויקט"));
      }
    }
  );
  export const cancelProject = createAsyncThunk(
    "projects/cancel",
    async (project: Project, { rejectWithValue }) => {
      try {
        const updatedProject = { ...project, Status: "Canceled" };
        const response = await API.put(`/Project/${project.Id}`, updatedProject);
        return response.data;
      } catch (err: any) {
        return rejectWithValue(getErrorMessage(err, "שגיאה בביטול פרויקט"));
      }
    }
  );
const initialState: ProjectsState = {
    projects: [],
    loading: false,
    error: null,
};
const projectsSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchProjects.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchProjects.fulfilled, (state, action) => {
          state.loading = false;
          state.projects = action.payload;
        })
        .addCase(fetchProjects.rejected, (state, action) => {
          state.loading = false;
          state.error = (action.payload as string) || action.error.message || "שגיאה בטעינת פרויקטים";
        })
        .addCase(addProject.fulfilled, (state, action) => {
          state.projects.push(action.payload);
        })
        .addCase(updateProject.fulfilled, (state, action) => {
          const index = state.projects.findIndex(p => p.Id === action.payload.Id);
          if (index !== -1) state.projects[index] = action.payload;
        })
        .addCase(cancelProject.fulfilled, (state, action) => {
          const index = state.projects.findIndex(p => p.Id === action.payload.Id);
          if (index !== -1) state.projects[index] = action.payload;
        })
    },
  });
  
  export default projectsSlice.reducer;