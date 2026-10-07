// src/routes/AppRoutes.tsx
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import AdminLayout from "@/layouts/AdminLayout";
import EmployeeLayout from "@/layouts/EmployeeLayout";
import ProtectedRoute from "./ProtectedRoute";
import RootRedirect from "./RootRedirect";
import PublicRoute from "./PublicRoute";
import NotFoundPage from "@/pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      {/* "/" sends the user to login or to their role's home */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public: logged-in users are redirected away */}
      <Route element={<PublicRoute />}>
        <Route path="/auth/login" element={<LoginPage />} />
      </Route>

      {/* Admin only */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<div>Dashboard</div>} />
          <Route path="policies" element={<div>Policies</div>} />
          <Route path="upload" element={<div>Upload Policy</div>} />
          <Route path="queue" element={<div>Processing Queue</div>} />
          <Route path="analytics" element={<div>Analytics</div>} />
          <Route path="evaluation" element={<div>Evaluation</div>} />
          <Route path="users" element={<div>Users</div>} />
          <Route path="settings" element={<div>Settings</div>} />
        </Route>
      </Route>

      {/* Employee only */}
      <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
        <Route element={<EmployeeLayout />}>
          <Route path="/chat" element={<div>Chat</div>} />
          <Route path="/history" element={<div>Chat History</div>} />
          <Route path="/bookmarks" element={<div>Bookmarks</div>} />
          <Route path="/feedback" element={<div>Feedback</div>} />
          <Route path="/profile" element={<div>Profile</div>} />
        </Route>
      </Route>

      {/* Not found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
