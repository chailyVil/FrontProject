import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { fetchTasks, addTask, updateTask,cancelTask } from "../store/slices/tasksSlice";
import { fetchSubTasks, addSubTask, updateSubTask,cancelSubTask } from "../store/slices/subTasksSlice";
import { fetchUsers } from "../store/slices/usersSlice";

import { fetchProjects, addProject, updateProject, cancelProject } from "../store/slices/projectSlice";
import type { Task, Project, SubTask } from "../types";


type Tab = "projects" | "tasks" | "subtasks" | "users" | "history";

function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("projects");

  return (
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
}

function ProjectsTab() {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, loading, error } = useSelector((state: RootState) => state.projects);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, []);

  const handleAdd = async (project: Partial<Project>) => {
    await dispatch(addProject(project));
    await dispatch(fetchProjects());
    setShowAddModal(false);
  };

  const handleEdit = async (project: Project) => {
    await dispatch(updateProject(project));
    setEditProject(null);
  };

  const handleCancel = async (project: Project) => {
    await dispatch(cancelProject(project));
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

      {/* Modal עריכה */}
      {editProject && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">עריכת פרויקט</h3>
              <button className="modal-close" onClick={() => setEditProject(null)}>✕</button>
            </div>
            <ProjectForm
              onSubmit={(data) => handleEdit({ ...editProject, ...data } as Project)}
              onCancel={() => setEditProject(null)}
              initialData={editProject}
            />
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
                  <button className="btn btn-outline" onClick={() => setEditProject(project)}>
                    עריכה
                  </button>
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
    await dispatch(addTask(task));
    await dispatch(fetchTasks());
    setShowAddModal(false);
  };

  const handleEdit = async (task: any) => {
    await dispatch(updateTask(task));
    await dispatch(fetchTasks());
    setEditTask(null);
  };

  const handleCancel = async (task: any) => {
    await dispatch(cancelTask(task));
    await dispatch(fetchTasks());
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

      {editTask && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">עריכת משימה</h3>
              <button className="modal-close" onClick={() => setEditTask(null)}>✕</button>
            </div>
            <TaskForm
              onSubmit={(data) => handleEdit({ ...editTask, ...data })}
              onCancel={() => setEditTask(null)}
              initialData={editTask}
            />
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
            {tasks.map((task: any) => (
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
                  <button className="btn btn-outline" onClick={() => setEditTask(task)}>עריכה</button>
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
  const { subTasks, loading, error } = useSelector((state: RootState) => state.subTasks);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editSubTask, setEditSubTask] = useState<any>(null);
  useEffect(() => {
    dispatch(fetchSubTasks());
  }, []);

  const handleAdd = async (task: any) => {
    await dispatch(addSubTask(task));
    await dispatch(fetchSubTasks());
    setShowAddModal(false);
  };

  const handleEdit = async (task: any) => {
    await dispatch(updateSubTask(task));
    await dispatch(fetchSubTasks());
    setEditSubTask(null);
  };

  const handleCancel = async (task: any) => {
    await dispatch(cancelSubTask(task));
    await dispatch(fetchSubTasks());
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

      {editSubTask && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">עריכת תת משימה</h3>
              <button className="modal-close" onClick={() => setEditSubTask(null)}>✕</button>
            </div>
            <SubTaskForm 
              onSubmit={(data) => handleEdit({ ...editSubTask, ...data })}
              onCancel={() => setEditSubTask(null)}
              initialData={editSubTask}
            />
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
            {subTasks.map((subTask: any) => (
              <tr key={subTask.id || subTask.Id}>
                <td>{subTask.title || subTask.Title}</td>
                <td>{subTask.taskName || subTask.TaskName}</td>
                
                <td>
                  <span className={`badge ${
                    (subTask.status || subTask.Status) === 1 ? "badge-progress" :
                    (subTask.status || subTask.Status) === 2 ? "badge-done" :
                    (subTask.status || subTask.Status) === 3 ? "badge-canceled" :
                    "badge-open"
                  }`}>
                    {(subTask.status || subTask.Status) === 1 ? "בביצוע" :
                     (subTask.status || subTask.Status) === 2 ? "הושלם" :
                     (subTask.status || subTask.Status) === 3 ? "בוטל" : "פתוח"}
                  </span>
                </td>
                <td>
                  <button className="btn btn-outline" onClick={() => setEditSubTask(subTask)}>עריכה</button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleCancel(subTask)}
                    disabled={(subTask.status || subTask.Status) === 3}
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
  const [deadline, setDeadline] = useState(
    (initialData?.deadline || initialData?.Deadline)
      ? new Date(initialData.deadline || initialData.Deadline).toISOString().split("T")[0]
      : ""
  );

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
      deadline: new Date(deadline),
      assignedTo: (user as any)?.id || (user as any)?.Id || 2,
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
          {tasks.map((t: any) => (
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
            <tr>
              <td>יוסי כהן</td>
              <td>yosi@gmail.com</td>
              <td>user</td>
              <td><span className="badge badge-done">פעיל</span></td>
              <td>
                <button className="btn btn-danger">השבת</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HistoryTab() {
  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">ביצועי עובדים</h2>
      </div>
      <div className="stats-grid">
        {[
          { label: "משימות הושלמו", value: "24" },
          { label: "בביצוע", value: "8" },
          { label: "ממוצע ימים", value: "4.2" },
          { label: "בוטלו", value: "3" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>עובד</th>
              <th>תת משימה</th>
              <th>סטטוס ישן</th>
              <th>סטטוס חדש</th>
              <th>תאריך</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>יוסי כהן</td>
              <td>הגדרת endpoints</td>
              <td><span className="badge badge-progress">בביצוע</span></td>
              <td><span className="badge badge-done">הושלם</span></td>
              <td>15/03/2026</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPanel;