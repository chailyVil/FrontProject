import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store';
import { fetchTasks, updateTask } from '../store/slices/tasksSlice';
import type { Task } from '../types';

// ---- סטטוס צבעים (Status הוא number) ----
// 0 = Pending, 1 = InProgress, 2 = Done, 3 = Canceled
const statusConfig: Record<number, { label: string; color: string; bg: string }> = {
  0: { label: 'ממתין',  color: '#b45309', bg: '#fef3c7' },
  1: { label: 'בביצוע', color: '#1d4ed8', bg: '#dbeafe' },
  2: { label: 'הושלם',  color: '#15803d', bg: '#dcfce7' },
  3: { label: 'בוטל',   color: '#b91c1c', bg: '#fee2e2' },
};

// ---- הודעת הצלחה ----
const SuccessToast = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div style={toastStyle}>
    <span style={{ fontSize: '1.1rem' }}>✓</span>
    <span>{message}</span>
    <button onClick={onClose} style={toastCloseStyle}>×</button>
  </div>
);

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const { user } = useSelector((state: RootState) => state.auth);

  const [search, setSearch] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [takenIds, setTakenIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleTakeTask = async (task: Task) => {
    if (!user) {
      alert('עליך להתחבר כדי לקחת משימה');
      return;
    }
    const updatedTask: Task = {
      ...task,
      AssignedTo: user.Id,
      Status: 1, // 1 = InProgress
    };
    await dispatch(updateTask(updatedTask));
    setTakenIds(prev => new Set(prev).add(task.Id));
    setSuccessMsg(`המשימה "${task.Title}" נלקחה בהצלחה!`);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  // משימות פנויות — רק ממתינות (Status=0) וללא אחראי
  const availableTasks = tasks
    .filter(t => !t.AssignedTo && t.Status === 0)
    .filter(t =>
      t.Title?.toLowerCase().includes(search.toLowerCase()) ||
      t.Description?.toLowerCase().includes(search.toLowerCase())
    );

  // המשימות שהיוזר כבר לקח
  const myTasksCount = user ? tasks.filter(t => t.AssignedTo === user.Id).length : 0;

  if (loading) return (
    <div style={centerStyle}>
      <div style={spinnerStyle} />
      <p style={{ color: '#6b7280', marginTop: '16px', fontSize: '0.9rem' }}>טוען משימות...</p>
    </div>
  );

  if (error) return (
    <div style={centerStyle}>
      <p style={{ color: '#ef4444', fontSize: '0.95rem' }}>שגיאה: {error}</p>
    </div>
  );

  return (
    <div style={containerStyle}>
      {/* Toast */}
      {successMsg && (
        <SuccessToast message={successMsg} onClose={() => setSuccessMsg(null)} />
      )}

      {/* Header */}
      <header style={headerStyle}>
        <div>
          <h1 style={h1Style}>לוח משימות</h1>
          {user && (
            <p style={subtitleStyle}>
              שלום, <strong>{user.NameUser}</strong> — {availableTasks.length} משימות פנויות
            </p>
          )}
        </div>
        {user && (
          <button onClick={() => navigate('/my-tasks')} style={myTasksBtnStyle}>
            המשימות שלי
            {myTasksCount > 0 && (
              <span style={badgeCountStyle}>{myTasksCount}</span>
            )}
          </button>
        )}
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
      </div>

      {/* Divider */}
      <div style={dividerStyle} />

      {/* Grid */}
      {availableTasks.length === 0 ? (
        <div style={emptyStyle}>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>אין משימות התואמות לחיפוש</p>
        </div>
      ) : (
        <div style={gridStyle}>
          {availableTasks.map(task => {
            const status = statusConfig[task.Status] ?? { label: String(task.Status), color: '#374151', bg: '#f3f4f6' };
            const taken = takenIds.has(task.Id);
            return (
              <div key={task.Id} style={{ ...cardStyle, opacity: taken ? 0.5 : 1 }}>
                {/* Status badge */}
                <span style={{ ...badgeStyle, color: status.color, background: status.bg }}>
                  {status.label}
                </span>

                <h3 style={cardTitleStyle}>{task.Title}</h3>
                <p style={cardDescStyle}>{task.Description || 'אין תיאור'}</p>

                <button
                  onClick={() => handleTakeTask(task)}
                  disabled={taken}
                  style={{ ...takeButtonStyle, opacity: taken ? 0.4 : 1, cursor: taken ? 'default' : 'pointer' }}
                >
                  {taken ? '✓ נלקחה' : 'קח משימה'}
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
  direction: 'rtl',
  fontFamily: "'Heebo', 'Segoe UI', sans-serif",
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '48px 32px',
  minHeight: '100vh',
  background: '#fafafa',
  color: '#111',
  position: 'relative',
};

const centerStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center',
  minHeight: '60vh', direction: 'rtl',
};

const spinnerStyle: React.CSSProperties = {
  width: '32px', height: '32px',
  border: '2px solid #e5e7eb',
  borderTop: '2px solid #111',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
};

const headerStyle: React.CSSProperties = {
  marginBottom: '32px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
};

const h1Style: React.CSSProperties = {
  fontSize: '1.75rem',
  fontWeight: 700,
  margin: 0,
  letterSpacing: '-0.5px',
  color: '#111',
};

const subtitleStyle: React.CSSProperties = {
  margin: '6px 0 0',
  fontSize: '0.9rem',
  color: '#6b7280',
};

const filtersRow: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap',
  alignItems: 'center',
  marginBottom: '20px',
};

const searchStyle: React.CSSProperties = {
  flex: '1',
  minWidth: '200px',
  padding: '10px 14px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  fontSize: '0.9rem',
  background: '#fff',
  outline: 'none',
  direction: 'rtl',
  color: '#111',
};

const filterButtonsStyle: React.CSSProperties = {
  display: 'flex', gap: '8px', flexWrap: 'wrap',
};

const filterBtnBase: React.CSSProperties = {
  padding: '8px 16px',
  border: '1px solid',
  borderRadius: '20px',
  fontSize: '0.82rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  fontFamily: 'inherit',
};

const dividerStyle: React.CSSProperties = {
  height: '1px',
  background: '#f3f4f6',
  marginBottom: '28px',
};

const emptyStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '60px 0',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
  gap: '16px',
};

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #f0f0f0',
  borderRadius: '12px',
  padding: '22px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  transition: 'box-shadow 0.2s ease',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '3px 10px',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: 600,
  width: 'fit-content',
};

const cardTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1rem',
  fontWeight: 700,
  color: '#111',
  lineHeight: 1.4,
};

const cardDescStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '0.85rem',
  color: '#6b7280',
  lineHeight: 1.6,
  flexGrow: 1,
};

const takeButtonStyle: React.CSSProperties = {
  marginTop: '6px',
  padding: '10px',
  background: '#111',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '0.88rem',
  fontWeight: 600,
  fontFamily: 'inherit',
  transition: 'background 0.15s ease',
};

const toastStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '28px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: '#111',
  color: '#fff',
  padding: '12px 20px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '0.9rem',
  fontWeight: 500,
  zIndex: 1000,
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  direction: 'rtl',
};

const toastCloseStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#fff',
  fontSize: '1.2rem',
  cursor: 'pointer',
  lineHeight: 1,
  padding: '0 4px',
};

const myTasksBtnStyle: React.CSSProperties = {
  padding: '10px 20px',
  background: '#fff',
  color: '#111',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  fontSize: '0.88rem',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'border-color 0.15s ease',
};

const badgeCountStyle: React.CSSProperties = {
  background: '#111',
  color: '#fff',
  borderRadius: '20px',
  padding: '1px 7px',
  fontSize: '0.75rem',
  fontWeight: 700,
};

export default Dashboard;