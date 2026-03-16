import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Project,ProjectsState } from "../../types";
import API from "../../services/api";

export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async () => {
    const response = await API.get("/Project");
    return response.data as Project[];
  }
);
export const addProject = createAsyncThunk(
    "projects/add",
    async (project: Partial<Project>) => {
      const response = await API.post("/Project", project);
      return response.data;
    }
  );
  
  export const updateProject = createAsyncThunk(
    "projects/update",
    async (project: Project) => {
      const response = await API.put(`/Project/${project.Id}`, project);
      return response.data;
    }
  );
  export const cancelProject = createAsyncThunk(
    "projects/cancel",
    async (project: Project) => {
      const updatedProject = { ...project, Status: "Canceled" };
      const response = await API.put(`/Project/${project.Id}`, updatedProject);
      return response.data;
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
          state.error = action.error.message || "שגיאה בטעינת פרויקטים";
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