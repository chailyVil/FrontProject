import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { fetchTasks, addTask, cancelTask } from "../store/slices/tasksSlice";
import { fetchProjects, addProject, updateProject, cancelProject } from "../store/slices/projectSlice";
import type { Task, Project } from "../types";

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
            {projects.map((project) => (
              <tr key={project.Id}>
                <td>{(project as any).nameProject || project.NameProject}</td>
                <td>{(project as any).description || project.Description}</td>
                <td>{project.Deadline ? new Date(project.Deadline).toLocaleDateString("he-IL") : "-"}</td>
                <td>
                  <span className={`badge ${
                    project.Status === "InProgress" ? "badge-progress" :
                    project.Status === "Completed" ? "badge-done" :
                    project.Status === "Canceled" ? "badge-canceled" :
                    "badge-open"
                  }`}>
                    {project.Status === "InProgress" ? "בביצוע" :
                     project.Status === "Completed" ? "הושלם" :
                     project.Status === "Canceled" ? "בוטל" : "פתוח"}
                  </span>
                </td>
                <td>
                  <button className="btn btn-outline" onClick={() => setEditProject(project)}>
                    עריכה
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleCancel(project)}
                    disabled={project.Status === "Canceled"}
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
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
  }, []);

  const handleAdd = async (task: Partial<Task>) => {
    await dispatch(addTask(task));
    setShowModal(false);
  };

  if (loading) return <div className="loading">טוען...</div>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">משימות</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + הוסף משימה
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">הוספת משימה</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <TaskForm onSubmit={handleAdd} onCancel={() => setShowModal(false)} />
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>כותרת</th>
              <th>פרויקט</th>
              <th>עדיפות</th>
              <th>סטטוס</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.Id}>
                <td>{task.Title}</td>
                <td>{task.ProjectName}</td>
                <td>
                  <span className={`badge ${
                    task.Priority === "High" ? "badge-high" :
                    task.Priority === "Medium" ? "badge-medium" :
                    "badge-low"
                  }`}>
                    {task.Priority === "High" ? "גבוהה" :
                     task.Priority === "Medium" ? "בינונית" : "נמוכה"}
                  </span>
                </td>
                <td>
                  <span className={`badge ${
                    task.Status === "InProgress" ? "badge-progress" :
                    task.Status === "Completed" ? "badge-done" :
                    task.Status === "Canceled" ? "badge-canceled" :
                    "badge-open"
                  }`}>
                    {task.Status === "InProgress" ? "בביצוע" :
                     task.Status === "Completed" ? "הושלם" :
                     task.Status === "Canceled" ? "בוטל" : "פתוח"}
                  </span>
                </td>
                <td>
                  <button className="btn btn-outline">עריכה</button>
                  <button className="btn btn-danger" onClick={() => dispatch(cancelTask(task))}>ביטול</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TaskForm({ onSubmit, onCancel }: {
  onSubmit: (task: Partial<Task>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectName, setProjectName] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      Title: title,
      Description: description,
      ProjectName: projectName,
      Priority: priority,
      Status: "Open",
      Deadline: new Date(deadline),
      Expected: 0,
      AssignedTo: 0,
      StartedAt: new Date(),
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
        <input className="form-input" value={projectName} onChange={e => setProjectName(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">עדיפות</label>
        <select className="form-input" value={priority} onChange={e => setPriority(e.target.value as "Low" | "Medium" | "High")}>
          <option value="Low">נמוכה</option>
          <option value="Medium">בינונית</option>
          <option value="High">גבוהה</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">דדליין</label>
        <input className="form-input" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-outline" onClick={onCancel}>ביטול</button>
        <button type="submit" className="btn btn-primary">שמור</button>
      </div>
    </form>
  );
}

function SubTasksTab() {
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
}

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