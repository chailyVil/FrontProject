export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface Task {
  id: number;
  title: string;
  description: string;
  isDone: boolean;
  userId: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
}
ע
export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}