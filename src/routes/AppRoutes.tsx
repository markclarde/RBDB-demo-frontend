import { Route, Routes, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { QuotationsPage } from "@/pages/QuotationsPage";
import { UsersPage } from "@/pages/UsersPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { RolesPermissionsPage } from "@/pages/RolesPermissionsPage";
import { AppShell } from "@/components/layout/AppShell";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/quotations" element={<QuotationsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/admin/roles" element={<RolesPermissionsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
