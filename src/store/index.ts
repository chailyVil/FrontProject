import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import tasksReducer from "./slices/tasksSlice";
import projectsReducer from "./slices/projectSlice";
import subTasksReducer from "./slices/subTasksSlice";
import usersReducer from "./slices/usersSlice";
import historyReducer from "./slices/historySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    projects: projectsReducer,
    users: usersReducer,
    subTasks: subTasksReducer,
    history: historyReducer,

    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;