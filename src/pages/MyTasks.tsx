import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store';
import { fetchTasks } from '../store/slices/tasksSlice';
import { fetchSubTasks, updateSubTask } from '../store/slices/subTasksSlice';
import type { Task, SubTask } from '../types';

// 0=Pending, 1=InProgress, 2=Done, 3=Canceled
const statusConfig: Record<number, { label: string; color: string; bg: string }> = {
  0: { label: 'ממתין',  color: '#b45309', bg: '#fef3c7' },
  1: { label: 'בביצוע', color: '#1d4ed8', bg: '#dbeafe' },
  2: { label: 'הושלם',  color: '#15803d', bg: '#dcfce7' },
  3: { label: 'בוטל',   color: '#b91c1c', bg: '#fee2e2' },
};

const SuccessToast = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div style={toastStyle}>
    <span>✓</span>
    <span>{message}</span>
    <button onClick={onClose} style={toastCloseStyle}>×</button>
  </div>
);

// ---- מודל תתי משימות ----
const SubTasksModal = ({
  task, subTasks, loading, onClose, onUpdateStatus,
}: {
  task: Task; subTasks: SubTask[]; loading: boolean;
  onClose: () => void; onUpdateStatus: (st: SubTask, status: number) => void;
}) => (
  <div style={overlayStyle} onClick={onClose}>
    <div style={modalStyle} onClick={e => e.stopPropagation()}>
      <div style={modalHeaderStyle}>
        <h2 style={modalTitleStyle}>{task.Title}</h2>
        <button onClick={onClose} style={modalCloseStyle}>×</button>
      </div>
      <p style={modalDescStyle}>{task.Description || 'אין תיאור'}</p>
      <div style={modalDividerStyle} />
      <h3 style={subTasksHeadingStyle}>תתי משימות</h3>
      {loading ? (
        <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>טוען...</p>
      ) : subTasks.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>אין תתי משימות</p>
      ) : (
        <div style={subTasksListStyle}>
          {subTasks.map(st => (
            <div key={st.Id} style={subTaskRowStyle}>
              <div style={{ flex: 1 }}>
                <p style={subTaskTitleStyle}>{st.Title || (st as any).title}</p>
                {(st.Description || (st as any).description) && <p style={subTaskDescStyle}>{st.Description || (st as any).description}</p>}                </div>
              <div style={statusBtnsStyle}>
                {[{ val: 0, label: 'ממתין' }, { val: 1, label: 'בביצוע' }, { val: 2, label: 'הושלם' }].map(s => (
                  <button
                    key={s.val}
                    onClick={() => onUpdateStatus(st, s.val)}
                    style={{
                      ...statusBtnBase,
                      background: (st.Status ?? (st as any).status) === s.val ? statusConfig[s.val].bg : 'transparent',
                      color: (st.Status ?? (st as any).status) === s.val ? statusConfig[s.val].color : '#9ca3af',
                      borderColor: (st.Status ?? (st as any).status) === s.val ? statusConfig[s.val].color : '#e5e7eb',
                      fontWeight: (st.Status ?? (st as any).status) === s.val ? 700 : 400,
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

// ---- הדף הראשי ----
const MyTasks: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { tasks } = useSelector((state: RootState) => state.tasks);
  const { subTasks, loading: subLoading } = useSelector((state: RootState) => state.subTasks);
  const { user } = useSelector((state: RootState) => state.auth);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

const handleOpenTask = (task: Task) => {
  console.log("selectedTask.Id:", task.Id);  // ✅
  setSelectedTask(task);
  dispatch(fetchSubTasks());
};

const handleUpdateSubTaskStatus = async (subTask: any, newStatus: number) => {
  await dispatch(updateSubTask({
    Id: subTask.id || subTask.Id,
    TaskId: subTask.taskId || subTask.TaskId,
    TaskName: subTask.taskName || subTask.TaskName,
    Title: subTask.title || subTask.Title,
    Description: subTask.description || subTask.Description,
    AssignedTo: subTask.assignedTo || subTask.AssignedTo,
    Status: newStatus,
  } as any));
  setSuccessMsg('הסטטוס עודכן בהצלחה');
  setTimeout(() => setSuccessMsg(null), 3000);
};

const totalMyTasks = user ? tasks.filter(t => t.AssignedTo !== null && t.AssignedTo === ((user as any).id || (user as any).Id)).length : 0;
const myTasks = (user ? tasks.filter(t => t.AssignedTo !== null && t.AssignedTo === user.Id) : [])    .filter(t =>
      t.Title?.toLowerCase().includes(search.toLowerCase()) ||
      t.Description?.toLowerCase().includes(search.toLowerCase())
    )
    .filter(t => statusFilter === 'all' || t.Status === Number(statusFilter));

const currentSubTasks = selectedTask
  ? subTasks.filter((st: any) => {
      console.log("subTask:", st);  // ✅ הוסיפי את זה
      return (st.taskId || st.TaskId) === selectedTask.Id;
    })
  : [];

  return (
    <div style={containerStyle}>
      {successMsg && <SuccessToast message={successMsg} onClose={() => setSuccessMsg(null)} />}
      {selectedTask && (
        <SubTasksModal
          task={selectedTask}
          subTasks={currentSubTasks}
          loading={subLoading}
          onClose={() => setSelectedTask(null)}
          onUpdateStatus={handleUpdateSubTaskStatus}
        />
      )}

      {/* Header */}
      <header style={headerStyle}>
        <div>
          <button onClick={() => navigate('/dashboard')} style={backBtnStyle}>← חזרה ללוח</button>
          <h1 style={h1Style}>המשימות שלי</h1>
          {user && <p style={subtitleStyle}>{totalMyTasks} משימות פעילות</p>}
        </div>
      </header>

      {/* Filters */}
      <div style={filtersRow}>
        <input
          type="text"
          placeholder="חיפוש משימה..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={searchStyle}
        />
        <div style={filterButtonsStyle}>
          {[
            { key: 'all', label: 'הכל' },
            { key: '0',   label: 'ממתין' },
            { key: '1',   label: 'בביצוע' },
            { key: '2',   label: 'הושלם' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              style={{
                ...filterBtnBase,
                background: statusFilter === f.key ? '#111' : 'transparent',
                color: statusFilter === f.key ? '#fff' : '#6b7280',
                borderColor: statusFilter === f.key ? '#111' : '#e5e7eb',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={dividerStyle} />

      {/* Grid */}
      {myTasks.length === 0 ? (
        <div style={emptyStyle}>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>
            {totalMyTasks === 0 ? 'עדיין לא לקחת משימות' : 'אין משימות התואמות לחיפוש'}
          </p>
          {totalMyTasks === 0 && (
            <button onClick={() => navigate('/dashboard')} style={goBackBtnStyle}>
              עבור ללוח המשימות
            </button>
          )}
        </div>
      ) : (
        <div style={gridStyle}>
          {myTasks.map(task => {
            const status = statusConfig[task.Status] ?? { label: String(task.Status), color: '#374151', bg: '#f3f4f6' };
            return (
              <div key={task.Id} style={cardStyle}>
                <span style={{ ...badgeStyle, color: status.color, background: status.bg }}>
                  {status.label}
                </span>
                <h3 style={cardTitleStyle}>{task.Title}</h3>
                <p style={cardDescStyle}>{task.Description || 'אין תיאור'}</p>
                <button onClick={() => handleOpenTask(task)} style={viewBtnStyle}>
                  תתי משימות ▾
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────

const containerStyle: React.CSSProperties = {
  direction: 'rtl', fontFamily: "'Heebo', 'Segoe UI', sans-serif",
  maxWidth: '1100px', margin: '0 auto', padding: '48px 32px',
  minHeight: '100vh', background: '#fafafa', color: '#111', position: 'relative',
};

const headerStyle: React.CSSProperties = { marginBottom: '32px' };

const backBtnStyle: React.CSSProperties = {
  background: 'none', border: 'none', color: '#6b7280',
  fontSize: '0.85rem', cursor: 'pointer', padding: '0 0 10px', fontFamily: 'inherit',
};

const h1Style: React.CSSProperties = {
  fontSize: '1.75rem', fontWeight: 700, margin: 0, letterSpacing: '-0.5px', color: '#111',
};

const subtitleStyle: React.CSSProperties = {
  margin: '6px 0 0', fontSize: '0.9rem', color: '#6b7280',
};

const filtersRow: React.CSSProperties = {
  display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px',
};

const searchStyle: React.CSSProperties = {
  flex: '1', minWidth: '200px', padding: '10px 14px',
  border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.9rem',
  background: '#fff', outline: 'none', direction: 'rtl', color: '#111',
};

const filterButtonsStyle: React.CSSProperties = { display: 'flex', gap: '8px', flexWrap: 'wrap' };

const filterBtnBase: React.CSSProperties = {
  padding: '8px 16px', border: '1px solid', borderRadius: '20px',
  fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer',
  transition: 'all 0.15s ease', fontFamily: 'inherit',
};

const dividerStyle: React.CSSProperties = { height: '1px', background: '#f3f4f6', marginBottom: '28px' };

const emptyStyle: React.CSSProperties = {
  textAlign: 'center', padding: '60px 0',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
};

const goBackBtnStyle: React.CSSProperties = {
  padding: '10px 20px', background: '#111', color: '#fff', border: 'none',
  borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.88rem', fontWeight: 600,
};

const gridStyle: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px',
};

const cardStyle: React.CSSProperties = {
  background: '#fff', border: '1px solid #f0f0f0', borderRadius: '12px',
  padding: '22px', display: 'flex', flexDirection: 'column', gap: '10px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
  fontSize: '0.75rem', fontWeight: 600, width: 'fit-content',
};

const cardTitleStyle: React.CSSProperties = {
  margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111', lineHeight: 1.4,
};

const cardDescStyle: React.CSSProperties = {
  margin: 0, fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.6, flexGrow: 1,
};

const viewBtnStyle: React.CSSProperties = {
  marginTop: '6px', padding: '10px', background: '#111', color: '#fff',
  border: 'none', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600,
  fontFamily: 'inherit', cursor: 'pointer',
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 200, direction: 'rtl',
};

const modalStyle: React.CSSProperties = {
  background: '#fff', borderRadius: '16px', padding: '32px',
  width: '100%', maxWidth: '580px', maxHeight: '80vh',
  overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
};

const modalHeaderStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px',
};

const modalTitleStyle: React.CSSProperties = { margin: 0, fontSize: '1.2rem', fontWeight: 700 };

const modalCloseStyle: React.CSSProperties = {
  background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#9ca3af', lineHeight: 1,
};

const modalDescStyle: React.CSSProperties = { margin: 0, fontSize: '0.88rem', color: '#6b7280' };

const modalDividerStyle: React.CSSProperties = { height: '1px', background: '#f3f4f6', margin: '16px 0' };

const subTasksHeadingStyle: React.CSSProperties = {
  fontSize: '0.9rem', fontWeight: 700, color: '#374151', margin: '0 0 12px',
};

const subTasksListStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px' };

const subTaskRowStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  gap: '12px', padding: '12px', background: '#fafafa', borderRadius: '8px', flexWrap: 'wrap',
};

const subTaskTitleStyle: React.CSSProperties = { margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#374151' };
const subTaskDescStyle: React.CSSProperties = { margin: '2px 0 0', fontSize: '0.78rem', color: '#9ca3af' };

const statusBtnsStyle: React.CSSProperties = { display: 'flex', gap: '6px' };

const statusBtnBase: React.CSSProperties = {
  padding: '5px 12px', border: '1px solid', borderRadius: '20px',
  fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s ease',
};

const toastStyle: React.CSSProperties = {
  position: 'fixed', bottom: '28px', left: '50%', transform: 'translateX(-50%)',
  background: '#111', color: '#fff', padding: '12px 20px', borderRadius: '10px',
  display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem',
  fontWeight: 500, zIndex: 1000, direction: 'rtl', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
};

const toastCloseStyle: React.CSSProperties = {
  background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', padding: '0 4px',
};

export default MyTasks;