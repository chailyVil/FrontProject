import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../store";
import { Link } from "react-router-dom";
import { login, fetchMe } from "../store/slices/authSlice";



function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "אימייל הוא שדה חובה";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "אימייל לא תקין";
      valid = false;
    }

    if (!password) {
      newErrors.password = "סיסמה היא שדה חובה";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "סיסמה חייבת להיות לפחות 6 תווים";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  /*const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await dispatch(login({ Email: email, Password: password }));
    if (login.fulfilled.match(result)) {
      navigate("/AdminPanel");
    }
  };*/
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;

  // שליחת הבקשה לשרת דרך ה-Redux Thunk
  const result = await dispatch(login({ Email: email, Password: password }));

  if (login.fulfilled.match(result)) {
    await dispatch(fetchMe());
    // קבלת נתוני המשתמש מה-Payload שחזר מהשרת
    const user = result.payload.user;


    if (user?.role === "admin" ) {
      navigate("/admin"); // ניתוב לפאנל הניהול כנדרש [cite: 29]
    } else {
      navigate("/Dashboard"); // ניתוב למשתמש רגיל
    }
  }
};

  return (
  <div className="auth-wrapper">
    <div className="auth-card">
      <h2 className="auth-title">התחברות</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">אימייל</label>
          <input
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="הכנס אימייל"
            dir="ltr"
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">סיסמה</label>
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="הכנס סיסמה"
            dir="ltr"
          />
          {errors.password && <p className="form-error">{errors.password}</p>}
        </div>
        {error && <p className="form-error">{error}</p>}
        <button className="btn btn-primary" style={{width:"100%"}} type="submit" disabled={loading}>
          {loading ? "מתחבר..." : "התחבר"}
        </button>
      </form>
      <p className="auth-footer">
        אין לך חשבון?{" "}
        <Link to="/register" className="auth-link">הירשם כאן</Link>
      </p>
    </div>
  </div>
);
}

/*const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f2f5",
    direction: "rtl",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    textAlign: "center",
    marginBottom: "24px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#555",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "15px",
    outline: "none",
  },
  errorMsg: {
    color: "#e53e3e",
    fontSize: "12px",
    margin: 0,
  },
  button: {
    padding: "12px",
    backgroundColor: "#4a6cf7",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "8px",
  },
  footer: {
    textAlign: "center",
    fontSize: "13px",
    color: "#999",
    marginTop: "20px",
  },
  link: {
    color: "#4a6cf7",
    fontWeight: 600,
    textDecoration: "none",
  },
};*/

export default Login;