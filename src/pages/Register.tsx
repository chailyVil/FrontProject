import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import type { AppDispatch } from "../store";
import { register, fetchMe } from "../store/slices/authSlice";

function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [nameUser, setNameUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    nameUser: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validate = () => {
    let valid = true;
    const newErrors = { nameUser: "", email: "", password: "", confirmPassword: "" };

    if (!nameUser) {
      newErrors.nameUser = "שם הוא שדה חובה";
      valid = false;
    }
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
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "הסיסמאות לא תואמות";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(register({
      NameUser: nameUser,
      Email: email,
      Password: password,
      Role: "user",
    }));

    if (register.fulfilled.match(result)) {
  await dispatch(fetchMe());  // ✅
  const user = result.payload.user;
  if (user?.role === "admin") {
    navigate("/admin");
  } else {
    navigate("/dashboard");
  }
}
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>הרשמה</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>שם משתמש</label>
            <input
              type="text"
              value={nameUser}
              onChange={(e) => setNameUser(e.target.value)}
              placeholder="הכנס שם"
              style={styles.input}
              dir="rtl"
            />
            {errors.nameUser && <p style={styles.errorMsg}>{errors.nameUser}</p>}
          </div>
          <div style={styles.field}>
            <label style={styles.label}>אימייל</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="הכנס אימייל"
              style={styles.input}
              dir="ltr"
            />
            {errors.email && <p style={styles.errorMsg}>{errors.email}</p>}
          </div>
          <div style={styles.field}>
            <label style={styles.label}>סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="הכנס סיסמה"
              style={styles.input}
              dir="ltr"
            />
            {errors.password && <p style={styles.errorMsg}>{errors.password}</p>}
          </div>
          <div style={styles.field}>
            <label style={styles.label}>אימות סיסמה</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="הכנס סיסמה שוב"
              style={styles.input}
              dir="ltr"
            />
            {errors.confirmPassword && <p style={styles.errorMsg}>{errors.confirmPassword}</p>}
          </div>
          <button type="submit" style={styles.button}>
            הירשם
          </button>
        </form>
        <p style={styles.footer}>
          כבר יש לך חשבון?{" "}
          <a href="/login" style={styles.link}>התחבר כאן</a>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
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
};

export default Register;