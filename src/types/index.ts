export interface User {
  Id: number;
  NameUser: string;
  Email: string;
  Password: string;
  role: "user" | "admin";
}

export interface Task {
  Id: number;
  ProjectName: string;
  Title: string;
  Description: string;
  Expected:number;
  AssignedTo:number;
  Priority: "Low" | "Medium" | "High";
  Status: "Open" | "InProgress" | "Completed" | "Canceled";
  StartedAt:Date;
  Deadline:Date;
}

export interface SubTask {
  Id: number;
  TaskName: string;
  Title: string;
  Description: string;
  AssignedTo: number;
  Status: "Open" | "InProgress" | "Completed" | "Canceled";
  Deadline: Date;
}
  
export interface Project {
  Id: number;
  NameProject: string;
  Description: string;
  Status:"Open" | "InProgress" | "Completed" | "Canceled";
  Deadline: Date;
}

export interface History {
    Id: number;
    SubTaskId: number;
    OldStatus: "Open" | "InProgress" | "Completed" | "Canceled";
    NewStatus: "Open" | "InProgress" | "Completed" | "Canceled";
    ChangedAt: Date;
}



// Auth State
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}
export interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

export interface SubTasksState {
  subTasks: SubTask[];
  loading: boolean;
  error: string | null;
}
export interface HistoryState {
  history: History[];
  loading: boolean;
  error: string | null;
}
export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

// לטפסי התחברות והרשמה
export interface LoginDTO {
  Email: string;
  Password: string;
}

export interface RegisterDTO {
  NameUser: string;
  Email: string;
  Password: string;
}