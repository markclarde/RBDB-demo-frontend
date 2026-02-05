import { Outlet } from "react-router-dom";

/**
 * TEMP (demo mode): Auth gating is disabled so you can navigate the app UI
 * without a backend.
 *
 * BACKEND TODO:
 * - Re-enable token checks here.
 * - If no token (or token invalid/expired), redirect to /login.
 * - Optionally validate via a lightweight endpoint (e.g. GET /api/auth/me)
 *   or rely on global 401 handling in the HTTP client.
 */
export function ProtectedRoute() {
  return <Outlet />;
}
