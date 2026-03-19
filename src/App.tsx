import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { fetchMe } from "./store/slices/authSlice";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import Register from "./pages/Register";
import MyTasks from "./pages/MyTasks";

// Protected Route — מגן על דפים שדורשים התחברות
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  return isLoggedIn ? children : <Navigate to="/login" />;
}

// Admin Route — מגן על דפים שדורשים מנהל
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  if (!isLoggedIn) return <Navigate to="/login" />;
  if (user?.role !== "admin") return <Navigate to="/dashboard" />;
  return children;
}


// ברירת מחדל לפי סוג משתמש
function HomeRedirect() {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  if (!isLoggedIn) return <Navigate to="/login" />;
  if (user?.role === "admin") return <Navigate to="/admin" />;
  return <Navigate to="/dashboard" />;
}

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
  const [authReady, setAuthReady] = useState(false);

  // אחרי רענון — משחזר את היוזר לפי ה-token
  useEffect(() => {
    let isMounted = true;
    if (token) {
      Promise.resolve(dispatch(fetchMe()))
        .finally(() => {
          if (isMounted) setAuthReady(true);
        });
    } else {
      setAuthReady(true);
    }
    return () => {
      isMounted = false;
    };
  }, [dispatch, token]);

  if (!authReady) return <div className="loading">טוען...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        <Route path="/register" element={<Register />} />

        <Route path="/my-tasks" element={
          <ProtectedRoute>
            <MyTasks />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        } />

        <Route path="/" element={<HomeRedirect />} />
              <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;