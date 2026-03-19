import React, { useState, useEffect, useContext, createContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { fetchTasks, addTask, updateTask,cancelTask } from "../store/slices/tasksSlice";
import { fetchSubTasks, addSubTask, updateSubTask,cancelSubTask } from "../store/slices/subTasksSlice";
import { fetchUsers ,deactivateUser} from "../store/slices/usersSlice";
import { fetchHistory } from "../store/slices/historySlice";

import { useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";


import { fetchProjects, addProject, updateProject, cancelProject } from "../store/slices/projectSlice";
import type { Task, Project, SubTask } from "../types";


type Tab = "projects" | "tasks" | "subtasks" | "users" | "history";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

const ToastContext = createContext<{
  notify: (message: string, type?: ToastType, duration?: number) => void;
} | null>(null);

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = (message: string, type: ToastType = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  };

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const containerStyle: React.CSSProperties = {
    position: "fixed",
    top: 16,
    right: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    zIndex: 9999,
  };

  const toastStyle = (type: ToastType): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 14px",
    borderRadius: 8,
    color: "#fff",
    background:
      type === "success" ? "#16a34a" : type === "error" ? "#dc2626" : "#2563eb",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.2)",
    minWidth: 220,
    maxWidth: 320,
    fontSize: 14,
  });

  const closeStyle: React.CSSProperties = {
    marginLeft: "auto",
    border: "none",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
    fontSize: 16,
    lineHeight: 1,
  };

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div style={containerStyle} aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div key={toast.id} style={toastStyle(toast.type)}>
            <span>{toast.message}</span>
            <button
              type="button"
              style={closeStyle}
              onClick={() => dismiss(toast.id)}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

function getErrorMessage(err: any, fallback: string) {
  if (!err) return fallback;
  if (typeof err === "string") return err;
  if (err.message) return err.message;
  return fallback;
}

/*function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("projects");

  return (
    <ToastProvider>
      <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-title">לוח מנהל</div>
        </div>
        <div className="nav-section-title">ניהול</div>
        {[
          { id: "projects", label: "פרויקטים", icon: "📁" },
          { id: "tasks", label: "משימות", icon: "✓" },
          { id: "subtasks", label: "תתי משימות", icon: "◦" },
        ].map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setActiveTab(item.id as Tab)}
          >
            <span>{item.icon}</span>
            {item.label}
          </div>
        ))}
        <div className="nav-section-title">צוות</div>
        {[
          { id: "users", label: "עובדים", icon: "👥" },
          { id: "history", label: "ביצועים", icon: "📊" },
        ].map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setActiveTab(item.id as Tab)}
          >
            <span>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>

      <div className="admin-main">
        {activeTab === "projects" && <ProjectsTab />}
        {activeTab === "tasks" && <TasksTab />}
        {activeTab === "subtasks" && <SubTasksTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "history" && <HistoryTab />}
      </div>
    </div>
  );
}*/
function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <ToastProvider>
      <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-title">לוח מנהל</div>
        </div>
        <div className="nav-section-title">ניהול</div>
        {[
          { id: "projects", label: "פרויקטים", icon: "📁" },
          { id: "tasks", label: "משימות", icon: "✓" },
          { id: "subtasks", label: "תתי משימות", icon: "◦" },
        ].map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setActiveTab(item.id as Tab)}
          >
            <span>{item.icon}</span>
            {item.label}
          </div>
        ))}
        <div className="nav-section-title">צוות</div>
        {[
          { id: "users", label: "עובדים", icon: "👥" },
          { id: "history", label: "ביצועים", icon: "📊" },
        ].map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setActiveTab(item.id as Tab)}
          >
            <span>{item.icon}</span>
            {item.label}
          </div>
        ))}

        {/* ✅ כפתור התנתקות */}
        <div
          className="nav-item"
          onClick={handleLogout}
          style={{ color: '#ef4444', marginTop: 'auto', cursor: 'pointer' }}
        >
          <span>🚪</span>
          התנתק
        </div>

      </div>

      <div className="admin-main">
        {activeTab === "projects" && <ProjectsTab />}
        {activeTab === "tasks" && <TasksTab />}
        {activeTab === "subtasks" && <SubTasksTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "history" && <HistoryTab />}
      </div>
    </div>
    </ToastProvider>
  );
}

function ProjectsTab() {
  const dispatch = useDispatch<AppDispatch>();
  const { notify } = useToast();
  const { projects, loading, error } = useSelector((state: RootState) => state.projects);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, []);

  const handleAdd = async (project: Partial<Project>) => {
    try {
      await dispatch(addProject(project)).unwrap();
      notify("הפרויקט נוסף בהצלחה", "success");
      await dispatch(fetchProjects());
      setShowAddModal(false);
    } catch (err: any) {
      notify(getErrorMessage(err, "שגיאה בהוספת פרויקט"), "error");
    }
  };

  const handleEdit = async (project: Project) => {
    try {
      await dispatch(updateProject(project)).unwrap();
      notify("הפרויקט עודכן בהצלחה", "success");
      setEditProject(null);
    } catch (err: any) {
      notify(getErrorMessage(err, "שגיאה בעדכון פרויקט"), "error");
    }
  };

  const handleCancel = async (project: Project) => {
    try {
      await dispatch(cancelProject(project)).unwrap();
      notify("הפרויקט בוטל", "success");
    } catch (err: any) {
      notify(getErrorMessage(err, "שגיאה בביטול פרויקט"), "error");
    }
  };

  if (loading) return <div className="loading">טוען...</div>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">פרויקטים</h2>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + הוסף פרויקט
        </button>
      </div>

      {/* Modal הוספה */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">הוספת פרויקט</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <ProjectForm onSubmit={handleAdd} onCancel={() => setShowAddModal(false)} />
          </div>
        </div>
      )}

     

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>שם</th>
              <th>תיאור</th>
              <th>דדליין</th>
              <th>סטטוס</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project: any) => (
                <tr key={project.id || project.Id}>
                <td>{(project as any).nameProject || project.NameProject}</td>
                <td>{(project as any).description || project.Description}</td>
                <td>{(project as any).deadline ? new Date((project as any).deadline).toLocaleDateString("he-IL") : "-"}</td>
                <td>
                  <span className={`badge ${
                    project.Status == 1 ? "badge-progress" :
                    project.Status ==2 ? "badge-done" :
                    project.Status == 3 ? "badge-canceled" :
                    "badge-open"
                  }`}>
                    {project.Status == 1 ? "בביצוע" :
                     project.Status ==2 ? "הושלם" :
                     project.Status ==3 ? "בוטל" : "פתוח"}
                  </span>
                </td>
                <td>
                  
                  <button
                    className="btn btn-danger"
                    onClick={() => handleCancel(project)}
                    disabled={project.Status ==3}
                  >
                    ביטול
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProjectForm({ onSubmit, onCancel, initialData }: {
  onSubmit: (project: Partial<Project>) => void;
  onCancel: () => void;
  initialData?: Project;
}) {
  const [nameProject, setNameProject] = useState(initialData?.NameProject || "");
  const [description, setDescription] = useState(initialData?.Description || "");
  const [status, setStatus] = useState(initialData?.Status?.toString() || "0");
  const [deadline, setDeadline] = useState(
    initialData?.Deadline
      ? new Date(initialData.Deadline).toISOString().split("T")[0]
      : ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      NameProject: nameProject,
      Description: description,
      Status: parseInt(status) as any,
      Deadline: new Date(deadline),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">שם פרויקט</label>
        <input
          className="form-input"
          value={nameProject}
          onChange={e => setNameProject(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">תיאור</label>
        <input
          className="form-input"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">סטטוס</label>
        <select
          className="form-input"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="0">פתוח</option>
          <option value="1">בביצוע</option>
          <option value="2">הושלם</option>
          <option value="3">בוטל</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">דדליין</label>
        <input
          className="form-input"
          type="date"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          required
        />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-outline" onClick={onCancel}>ביטול</button>
        <button type="submit" className="btn btn-primary">שמור</button>
      </div>
    </form>
  );
}

function TasksTab() {
  const dispatch = useDispatch<AppDispatch>();
  const { notify } = useToast();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const { users } = useSelector((state: RootState) => state.users);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchUsers());
  }, []);

  const getUserName = (id: number | null) => {
    if (!id) return "-";
    const user = users.find((u: any) => (u.id || u.Id) === id);
    return user ? (user.nameUser || user.NameUser) : "-";
  };

  const handleAdd = async (task: any) => {
    try {
      await dispatch(addTask(task)).unwrap();
      notify("המשימה נוספה בהצלחה", "success");
      await dispatch(fetchTasks());
      setShowAddModal(false);
    } catch (err: any) {
      notify(getErrorMessage(err, "שגיאה בהוספת משימה"), "error");
    }
  };

  const handleEdit = async (task: any) => {
    try {
      await dispatch(updateTask(task)).unwrap();
      notify("המשימה עודכנה בהצלחה", "success");
      await dispatch(fetchTasks());
      setEditTask(null);
    } catch (err: any) {
      notify(getErrorMessage(err, "שגיאה בעדכון משימה"), "error");
    }
  };

  const handleCancel = async (task: any) => {
    try {
      await dispatch(cancelTask(task)).unwrap();
      notify("המשימה בוטלה", "success");
      await dispatch(fetchTasks());
    } catch (err: any) {
      notify(getErrorMessage(err, "שגיאה בביטול משימה"), "error");
    }
  };

  if (loading) return <div className="loading">טוען...</div>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">משימות</h2>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + הוסף משימה
        </button>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">הוספת משימה</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <TaskForm onSubmit={handleAdd} onCancel={() => setShowAddModal(false)} />
          </div>
        </div>
      )}

      

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>כותרת</th>
              <th>תיאור</th>
              <th>משויך לפרויקט</th>
              <th>עובד אחראי</th>
              <th>עדיפות</th>
              <th>סטטוס</th>
              <th>דדליין</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {tasks.filter((task: any) => (task.status ?? task.Status) !== 3)
            .map((task: any) => (
              <tr key={task.id || task.Id}>
                <td>{task.title || task.Title}</td>
                <td>{task.description || task.Description}</td>
                <td>{task.projectName || task.ProjectName || "-"}</td>
                <td>{getUserName(task.assignedTo ?? task.AssignedTo)}</td>
                <td>
                  <span className={`badge ${
                    (task.priority ?? task.Priority) === 2 ? "badge-high" :
                    (task.priority ?? task.Priority) === 1 ? "badge-medium" :
                    "badge-low"
                  }`}>
                    {(task.priority ?? task.Priority) === 2 ? "גבוהה" :
                     (task.priority ?? task.Priority) === 1 ? "בינונית" : "נמוכה"}
                  </span>
                </td>
                <td>
                  <span className={`badge ${
                    (task.status ?? task.Status) === 1 ? "badge-progress" :
                    (task.status ?? task.Status) === 2 ? "badge-done" :
                    (task.status ?? task.Status) === 3 ? "badge-canceled" :
                    "badge-open"
                  }`}>
                    {(task.status ?? task.Status) === 1 ? "בביצוע" :
                     (task.status ?? task.Status) === 2 ? "הושלם" :
                     (task.status ?? task.Status) === 3 ? "בוטל" : "פתוח"}
                  </span>
                </td>
                <td>{task.deadline ? new Date(task.deadline).toLocaleDateString("he-IL") : "-"}</td>
                <td>
                  
                  <button
                    className="btn btn-danger"
                    onClick={() => handleCancel(task)}
                    disabled={(task.status ?? task.Status) === 3}
                  >ביטול</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function TaskForm({ onSubmit, onCancel, initialData }: {
    
  onSubmit: (task: any) => void;
  onCancel: () => void;
  initialData?: any;
}) {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
    dispatch(fetchProjects());
    }, []);
  const { user } = useSelector((state: RootState) => state.auth);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(initialData?.title || initialData?.Title || "");
  const [description, setDescription] = useState(initialData?.description || initialData?.Description || "");
  const projects = useSelector((state: RootState) => state.projects.projects);
  const [projectId, setProjectId] = useState(initialData?.projectId || 0);
  const [priority, setPriority] = useState(initialData?.priority?.toString() || "0");
  const [expected, setExpected] = useState(initialData?.expected || 1);
  const [status, setStatus] = useState(initialData?.status?.toString() || initialData?.Status?.toString() || "0");
  const [deadline, setDeadline] = useState(
    (initialData?.deadline || initialData?.Deadline)
      ? new Date(initialData.deadline || initialData.Deadline).toISOString().split("T")[0]
      : ""
  );

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
    // 1. מחפשים את הפרויקט הנבחר מתוך רשימת הפרויקטים כדי לחלץ את השם שלו
    const selectedProject = projects.find((p: any) => (p.id || p.Id) === projectId);
    
    // 2. שומרים את השם (בודקים גם את האפשרות של אות גדולה או קטנה)
    const projectName = selectedProject ? (selectedProject.nameProject || selectedProject.NameProject) : "";

    // 3. שולחים את האובייקט המלא כולל השדה שהיה חסר
    onSubmit({
      projectId: projectId,
      projectName: projectName, // השדה שהשרת צעק עליו שהוא חסר
      title: title,
      description: description,
      priority: parseInt(priority),
      status: 0,
      deadline: new Date(deadline),
      //startedAt: new Date(),
      expected: expected,
      assignedTo: null,
    });
    } catch (err: any) {
      setError(getErrorMessage(err, "שגיאה ביצירת המשימה"));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">כותרת</label>
        <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div className="form-group">
        <label className="form-label">תיאור</label>
        <input className="form-input" value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">פרויקט</label>
        <select className="form-input" value={projectId} onChange={e => setProjectId(parseInt(e.target.value))} required>
            <option value="">בחר פרויקט</option>
            {projects.map((p: any) => (
            <option key={p.id || p.Id} value={p.id || p.Id}>
                {p.nameProject || p.NameProject}
            </option>
            ))}
        </select>
        </div>
      
      <div className="form-group">
  <label className="form-label">זמן משוער (בימים)</label>
  <input
    className="form-input"
    type="number"
    min={1}
    value={expected}
    onChange={e => setExpected(parseInt(e.target.value))}
    required
  />
</div>
     
      <div className="form-group">
        <label className="form-label">דדליין</label>
        <input className="form-input" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} required />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-outline" onClick={onCancel}>ביטול</button>
        <button type="submit" className="btn btn-primary">שמור</button>
      </div>
    </form>
  );
}

function SubTasksTab() {
  const dispatch = useDispatch<AppDispatch>();
  const { notify } = useToast();
  const { users } = useSelector((state: RootState) => state.users);
  const { subTasks, loading, error } = useSelector((state: RootState) => state.subTasks);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editSubTask, setEditSubTask] = useState<any>(null);
  useEffect(() => {
    dispatch(fetchSubTasks());
    dispatch(fetchUsers());
  }, []);
  const getUserName = (id: number | null) => {
  if (!id) return "-";
  const user = users.find((u: any) => (u.id || u.Id) === id);
  return user ? (user.nameUser || user.NameUser) : "-";
};
  const handleAdd = async (task: any) => {
    try {
      await dispatch(addSubTask(task)).unwrap();
      notify("תת המשימה נוספה בהצלחה", "success");
      await dispatch(fetchSubTasks());
      setShowAddModal(false);
    } catch (err: any) {
      notify(getErrorMessage(err, "שגיאה בהוספת תת משימה"), "error");
    }
  };

  const handleEdit = async (task: any) => {
    try {
      await dispatch(updateSubTask(task)).unwrap();
      notify("תת המשימה עודכנה בהצלחה", "success");
      await dispatch(fetchSubTasks());
      setEditSubTask(null);
    } catch (err: any) {
      notify(getErrorMessage(err, "שגיאה בעדכון תת משימה"), "error");
    }
  };

  const handleCancel = async (task: any) => {
    try {
      await dispatch(cancelSubTask(task)).unwrap();
      notify("תת המשימה בוטלה", "success");
      await dispatch(fetchSubTasks());
    } catch (err: any) {
      notify(getErrorMessage(err, "שגיאה בביטול תת משימה"), "error");
    }
  };

  if (loading) return <div className="loading">טוען...</div>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title"> תת משימות</h2>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + הוסף תת משימה
        </button>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">הוספת תת משימה</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <SubTaskForm  onSubmit={handleAdd} onCancel={() => setShowAddModal(false)} />
          </div>
        </div>
      )}

     

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>כותרת</th>
              <th>תיאור</th>
              <th>משויך למשימה </th>
              <th>עובד אחראי</th>
              <th>סטטוס</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
  {subTasks.filter((subTask: any) => (subTask.status ?? subTask.Status) !== 3)
  .map((subTask: any) => (
    <tr key={subTask.id || subTask.Id}>
      <td>{subTask.title || subTask.Title}</td>
      <td>{subTask.description || subTask.Description}</td>
      <td>{subTask.taskName || subTask.TaskName}</td>
      <td>{getUserName(subTask.assignedTo ?? subTask.AssignedTo)}</td>
      <td>
        <span className={`badge ${
          (subTask.status ?? subTask.Status) === 1 ? "badge-progress" :
          (subTask.status ?? subTask.Status) === 2 ? "badge-done" :
          (subTask.status ?? subTask.Status) === 3 ? "badge-canceled" :
          "badge-open"
        }`}>
          {(subTask.status ?? subTask.Status) === 1 ? "בביצוע" :
           (subTask.status ?? subTask.Status) === 2 ? "הושלם" :
           (subTask.status ?? subTask.Status) === 3 ? "בוטל" : "פתוח"}
        </span>
      </td>
      <td>
        
        <button
          className="btn btn-danger"
          onClick={() => handleCancel(subTask)}
          disabled={(subTask.status ?? subTask.Status) === 3}
        >ביטול</button>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
    </div>
  );
}


function SubTaskForm({ onSubmit, onCancel, initialData }: {
  onSubmit: (subTask: any) => void;
  onCancel: () => void;
  initialData?: any;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchTasks());
  }, []);

  const [title, setTitle] = useState(initialData?.title || initialData?.Title || "");
  const [description, setDescription] = useState(initialData?.description || initialData?.Description || "");
  const [taskId, setTaskId] = useState(initialData?.taskId || 0);
  const [status, setStatus] = useState(initialData?.status?.toString() || "0");
  /*const [deadline, setDeadline] = useState(
    (initialData?.deadline || initialData?.Deadline)
      ? new Date(initialData.deadline || initialData.Deadline).toISOString().split("T")[0]
      : ""
  );*/

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedTask = tasks.find((t: any) => (t.id || t.Id) === taskId);
const taskName = selectedTask ? (selectedTask.title || selectedTask.Title) : "";
    onSubmit({
      taskId,
      taskName: taskName, 
      title,
      description,
      status: parseInt(status),
      //deadline: new Date(deadline),
      assignedTo:null,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">כותרת</label>
        <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div className="form-group">
        <label className="form-label">תיאור</label>
        <input className="form-input" value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">משימה</label>
        <select className="form-input" value={taskId} onChange={e => setTaskId(parseInt(e.target.value))} required>
          <option value="">בחר משימה</option>
          {tasks.filter((t: any) => (t.status ?? t.Status) !== 3 && (t.status ?? t.Status) !== 2)  // ✅ לא מבוטלות ולא מושלמות
          .map((t: any) => (
            <option key={t.id || t.Id} value={t.id || t.Id}>
              {t.title || t.Title}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">סטטוס</label>
        <select className="form-input" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="0">פתוח</option>
          <option value="1">בביצוע</option>
          <option value="2">הושלם</option>
          <option value="3">בוטל</option>
        </select>
      </div>
      
      <div className="modal-footer">
        <button type="button" className="btn btn-outline" onClick={onCancel}>ביטול</button>
        <button type="submit" className="btn btn-primary">שמור</button>
      </div>
    </form>
  );
}

/*function SubTasksTab() {
  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">תתי משימות</h2>
        <button className="btn btn-primary">+ הוסף תת משימה</button>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>כותרת</th>
              <th>משימה</th>
              <th>סטטוס</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>הגדרת endpoints</td>
              <td>בניית API</td>
              <td><span className="badge badge-done">הושלם</span></td>
              <td>
                <button className="btn btn-outline">עריכה</button>
                <button className="btn btn-danger">ביטול</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}*/

function UsersTab() {
  const dispatch = useDispatch<AppDispatch>();
  const { notify } = useToast();
  const { users, loading, error } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  const handleDeactivate = async (user: any) => {
    try {
      await dispatch(deactivateUser(user)).unwrap();
      notify("העובד הושבת", "success");
      await dispatch(fetchUsers());
    } catch (err: any) {
      notify(getErrorMessage(err, "שגיאה בהשבתת עובד"), "error");
    }
  };

  if (loading) return <div className="loading">טוען...</div>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">עובדים</h2>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>שם</th>
              <th>אימייל</th>
              <th>תפקיד</th>
              <th>סטטוס</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {users
                .filter((user: any) => (user.role || user.Role) !== "admin")
                .filter((user: any) => (user.isActive ?? user.IsActive) === true)
                .map((user: any) => (
              <tr key={user.id || user.Id}>
                <td>{user.nameUser || user.NameUser}</td>
                <td>{user.email || user.Email}</td>
                <td>{user.role === "admin" ? "מנהל" : "עובד"}</td>
                <td>
                  <span className={`badge ${(user.isActive ?? user.IsActive) ? "badge-done" : "badge-canceled"}`}>
                    {(user.isActive ?? user.IsActive) ? "פעיל" : "מושבת"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeactivate(user)}
                    disabled={!(user.isActive ?? user.IsActive)}
                  >
                    השבת
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HistoryTab() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const { subTasks } = useSelector((state: RootState) => state.subTasks);
  const { users } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchSubTasks());
    dispatch(fetchUsers());
  }, []);

  // סטטיסטיקות כלליות
  const completedTasks = tasks.filter((t: any) => (t.status ?? t.Status) === 2).length;
  const inProgressTasks = tasks.filter((t: any) => (t.status ?? t.Status) === 1).length;
  const canceledTasks = tasks.filter((t: any) => (t.status ?? t.Status) === 3).length;
  const completedSubTasks = subTasks.filter((s: any) => (s.status ?? s.Status) === 2).length;

  // ביצועי עובדים
  const userStats = users.map((u: any) => {
    const userId = u.id || u.Id;
    const userName = u.nameUser || u.NameUser;
    const myTasks = tasks.filter((t: any) => (t.AssignedTo ?? t.assignedTo) === userId);
    const completed = myTasks.filter((t: any) => (t.status ?? t.Status) === 2).length;
    const inProgress = myTasks.filter((t: any) => (t.status ?? t.Status) === 1).length;
    const total = myTasks.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { userId, userName, total, completed, inProgress, percent };
  }).filter(u => u.total > 0);

  // התקדמות משימות
  const taskStats = tasks.map((t: any) => {
    const taskId = t.Id ?? t.id;
    const title = t.Title ?? t.title;
    const mySubTasks = subTasks.filter((s: any) => (s.taskId || s.TaskId) === taskId);
    const completed = mySubTasks.filter((s: any) => (s.status ?? s.Status) === 2).length;
    const total = mySubTasks.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { taskId, title, total, completed, percent };
  }).filter(t => t.total > 0);

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">ביצועי עובדים</h2>
      </div>

      {/* כרטיסיות סטטיסטיקות */}
      <div className="stats-grid">
        {[
          { label: "משימות הושלמו", value: completedTasks },
          { label: "בביצוע", value: inProgressTasks },
          { label: "תתי משימות הושלמו", value: completedSubTasks },
          { label: "בוטלו", value: canceledTasks },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* טבלת ביצועי עובדים */}
      <h3 className="page-title" style={{ marginTop: '32px', marginBottom: '16px' }}>ביצועי עובדים</h3>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>עובד</th>
              <th>משימות שלקח</th>
              <th>הושלמו</th>
              <th>בביצוע</th>
              <th>אחוז השלמה</th>
            </tr>
          </thead>
          <tbody>
            {userStats.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>אין נתונים</td></tr>
            ) : (
              userStats.map(u => (
                <tr key={u.userId}>
                  <td>{u.userName}</td>
                  <td>{u.total}</td>
                  <td>{u.completed}</td>
                  <td>{u.inProgress}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '100px', height: '8px',
                        background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${u.percent}%`, height: '100%',
                          background: u.percent === 100 ? '#15803d' : '#3b82f6',
                          borderRadius: '4px'
                        }} />
                      </div>
                      <span>{u.percent}%</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* טבלת התקדמות משימות */}
      <h3 className="page-title" style={{ marginTop: '32px', marginBottom: '16px' }}>התקדמות משימות</h3>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>משימה</th>
              <th>סה"כ תתי משימות</th>
              <th>הושלמו</th>
              <th>אחוז התקדמות</th>
            </tr>
          </thead>
          <tbody>
            {taskStats.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center' }}>אין נתונים</td></tr>
            ) : (
              taskStats.map(t => (
                <tr key={t.taskId}>
                  <td>{t.title}</td>
                  <td>{t.total}</td>
                  <td>{t.completed}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '100px', height: '8px',
                        background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${t.percent}%`, height: '100%',
                          background: t.percent === 100 ? '#15803d' : '#3b82f6',
                          borderRadius: '4px'
                        }} />
                      </div>
                      <span>{t.percent}%</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default AdminPanel;