import React, { useState } from "react";

type Tab = "projects" | "tasks" | "subtasks" | "users" | "history";

function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("projects");

  return (
    <div style={styles.layout}>
      {/* תפריט צד */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <span style={styles.sidebarTitle}>לוח מנהל</span>
        </div>
        <div style={styles.navSection}>ניהול</div>
        {[
          { id: "projects", label: "פרויקטים", icon: "📁" },
          { id: "tasks", label: "משימות", icon: "✓" },
          { id: "subtasks", label: "תתי משימות", icon: "◦" },
        ].map((item) => (
          <div
            key={item.id}
            style={{
              ...styles.navItem,
              ...(activeTab === item.id ? styles.navItemActive : {}),
            }}
            onClick={() => setActiveTab(item.id as Tab)}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            {item.label}
          </div>
        ))}
        <div style={styles.navSection}>צוות</div>
        {[
          { id: "users", label: "עובדים", icon: "👥" },
          { id: "history", label: "ביצועים", icon: "📊" },
        ].map((item) => (
          <div
            key={item.id}
            style={{
              ...styles.navItem,
              ...(activeTab === item.id ? styles.navItemActive : {}),
            }}
            onClick={() => setActiveTab(item.id as Tab)}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>

      {/* תוכן ראשי */}
      <div style={styles.mainContent}>
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
  return (
    <div>
      <div style={styles.pageTitle}>פרויקטים</div>
      <div style={styles.tableHeader}>
        <span style={styles.tableTitle}>רשימת פרויקטים</span>
        <button style={styles.addBtn}>+ הוסף פרויקט</button>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>שם</th>
            <th style={styles.th}>תיאור</th>
            <th style={styles.th}>דדליין</th>
            <th style={styles.th}>סטטוס</th>
            <th style={styles.th}>פעולות</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.td}>פרויקט א</td>
            <td style={styles.td}>פיתוח מערכת</td>
            <td style={styles.td}>01/06/2026</td>
            <td style={styles.td}><span style={styles.badgeProgress}>בביצוע</span></td>
            <td style={styles.td}>
              <button style={styles.actionBtn}>עריכה</button>
              <button style={styles.actionBtn}>ביטול</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function TasksTab() {
  return (
    <div>
      <div style={styles.pageTitle}>משימות</div>
      <div style={styles.tableHeader}>
        <span style={styles.tableTitle}>רשימת משימות</span>
        <button style={styles.addBtn}>+ הוסף משימה</button>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>כותרת</th>
            <th style={styles.th}>פרויקט</th>
            <th style={styles.th}>עדיפות</th>
            <th style={styles.th}>סטטוס</th>
            <th style={styles.th}>פעולות</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.td}>בניית API</td>
            <td style={styles.td}>פרויקט א</td>
            <td style={styles.td}><span style={styles.badgeHigh}>גבוהה</span></td>
            <td style={styles.td}><span style={styles.badgeProgress}>בביצוע</span></td>
            <td style={styles.td}>
              <button style={styles.actionBtn}>עריכה</button>
              <button style={styles.actionBtn}>ביטול</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function SubTasksTab() {
  return (
    <div>
      <div style={styles.pageTitle}>תתי משימות</div>
      <div style={styles.tableHeader}>
        <span style={styles.tableTitle}>רשימת תתי משימות</span>
        <button style={styles.addBtn}>+ הוסף תת משימה</button>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>כותרת</th>
            <th style={styles.th}>משימה</th>
            <th style={styles.th}>סטטוס</th>
            <th style={styles.th}>פעולות</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.td}>הגדרת endpoints</td>
            <td style={styles.td}>בניית API</td>
            <td style={styles.td}><span style={styles.badgeDone}>הושלם</span></td>
            <td style={styles.td}>
              <button style={styles.actionBtn}>עריכה</button>
              <button style={styles.actionBtn}>ביטול</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function UsersTab() {
  return (
    <div>
      <div style={styles.pageTitle}>עובדים</div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>שם</th>
            <th style={styles.th}>אימייל</th>
            <th style={styles.th}>תפקיד</th>
            <th style={styles.th}>סטטוס</th>
            <th style={styles.th}>פעולות</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.td}>יוסי כהן</td>
            <td style={styles.td}>yosi@gmail.com</td>
            <td style={styles.td}>user</td>
            <td style={styles.td}><span style={styles.badgeDone}>פעיל</span></td>
            <td style={styles.td}>
              <button style={styles.actionBtn}>השבת</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function HistoryTab() {
  return (
    <div>
      <div style={styles.pageTitle}>ביצועי עובדים</div>
      <div style={styles.statsGrid}>
        {[
          { label: "משימות הושלמו", value: "24" },
          { label: "בביצוע", value: "8" },
          { label: "ממוצע ימים", value: "4.2" },
          { label: "בוטלו", value: "3" },
        ].map((s) => (
          <div key={s.label} style={styles.statCard}>
            <div style={styles.statLabel}>{s.label}</div>
            <div style={styles.statValue}>{s.value}</div>
          </div>
        ))}
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>עובד</th>
            <th style={styles.th}>תת משימה</th>
            <th style={styles.th}>סטטוס ישן</th>
            <th style={styles.th}>סטטוס חדש</th>
            <th style={styles.th}>תאריך</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.td}>יוסי כהן</td>
            <td style={styles.td}>הגדרת endpoints</td>
            <td style={styles.td}><span style={styles.badgeProgress}>בביצוע</span></td>
            <td style={styles.td}><span style={styles.badgeDone}>הושלם</span></td>
            <td style={styles.td}>15/03/2026</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    direction: "rtl",
    backgroundColor: "#f0f2f5",
  },
  sidebar: {
    width: "200px",
    backgroundColor: "#fff",
    borderLeft: "1px solid #e5e5e5",
    flexShrink: 0,
  },
  sidebarHeader: {
    padding: "16px",
    borderBottom: "1px solid #e5e5e5",
  },
  sidebarTitle: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#333",
  },
  navSection: {
    fontSize: "11px",
    color: "#999",
    padding: "12px 16px 4px",
    textTransform: "uppercase",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 16px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#555",
  },
  navItemActive: {
    backgroundColor: "#f0f2f5",
    color: "#1a1a1a",
    fontWeight: 600,
    borderRight: "3px solid #4a6cf7",
  },
  navIcon: {
    fontSize: "14px",
  },
  mainContent: {
    flex: 1,
    padding: "24px",
    backgroundColor: "#f0f2f5",
  },
  pageTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "16px",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  tableTitle: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#333",
  },
  addBtn: {
    padding: "8px 16px",
    backgroundColor: "#4a6cf7",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
  },
  th: {
    padding: "10px 14px",
    textAlign: "right",
    fontSize: "13px",
    fontWeight: 500,
    color: "#777",
    borderBottom: "1px solid #eee",
    backgroundColor: "#fafafa",
  },
  td: {
    padding: "10px 14px",
    fontSize: "13px",
    color: "#333",
    borderBottom: "1px solid #eee",
  },
  actionBtn: {
    fontSize: "12px",
    padding: "4px 10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    cursor: "pointer",
    background: "transparent",
    color: "#555",
    marginLeft: "4px",
  },
  badgeProgress: {
    backgroundColor: "#FAEEDA",
    color: "#633806",
    padding: "2px 8px",
    borderRadius: "10px",
    fontSize: "12px",
  },
  badgeDone: {
    backgroundColor: "#EAF3DE",
    color: "#27500A",
    padding: "2px 8px",
    borderRadius: "10px",
    fontSize: "12px",
  },
  badgeHigh: {
    backgroundColor: "#FCEBEB",
    color: "#791F1F",
    padding: "2px 8px",
    borderRadius: "10px",
    fontSize: "12px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    marginBottom: "20px",
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "16px",
  },
  statLabel: {
    fontSize: "12px",
    color: "#999",
    marginBottom: "6px",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: 600,
    color: "#1a1a1a",
  },
};

export default AdminPanel;