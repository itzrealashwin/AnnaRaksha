import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/hooks/useAuth.js";

/**
 * ProtectedRoute
 * - isLoading  → show a full-screen spinner while /auth/me resolves
 * - user found → render children (or <Outlet /> for nested routes)
 * - no user    → redirect to /login
 */
export default function ProtectedRoute() {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-slate-950">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
