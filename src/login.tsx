import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("נא למלא את כל השדות");
      return;
    }

    setLoading(true);

    // TODO: החלף בקריאת API אמיתית
    setTimeout(() => {
      setLoading(false);
      // כאן תנתבי לדף הראשי לאחר התחברות
      console.log("Logged in:", email);
    }, 1000);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Logo / Title */}
        <div style={styles.header}>
          <div style={styles.dot} />
          <h1 style={styles.title}>המשימות שלי</h1>
          <p style={styles.subtitle}>התחברי כדי להמשיך</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>אימייל</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={styles.input}
              dir="ltr"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
              dir="ltr"
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "מתחבר..." : "התחברות"}
          </button>
        </form>

        <p style={styles.footer}>
          אין לך חשבון?{" "}
          <a href="/register" style={styles.link}>
            הרשמי כאן
          </a>
        </p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f7",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    direction: "rtl",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.06)",
  },
  header: {
    marginBottom: "32px",
    textAlign: "center" as const,
  },
  dot: {
    width: "10px",
    height: "10px",
    backgroundColor: "#2d2d2d",
    borderRadius: "50%",
    margin: "0 auto 16px",
  },
  title: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#1a1a1a",
    margin: "0 0 6px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#999",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
  },
  field: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#555",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e5e5e5",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
    backgroundColor: "#fafafa",
    color: "#1a1a1a",
  },
  error: {
    color: "#e53e3e",
    fontSize: "13px",
    margin: 0,
    textAlign: "center" as const,
  },
  button: {
    padding: "12px",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: 600,
    marginTop: "4px",
    transition: "background-color 0.2s",
  },
  footer: {
    textAlign: "center" as const,
    fontSize: "13px",
    color: "#999",
    marginTop: "24px",
  },
  link: {
    color: "#1a1a1a",
    fontWeight: 600,
    textDecoration: "none",
  },
};

export default Login;
