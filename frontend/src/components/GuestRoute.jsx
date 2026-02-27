import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/hooks/useAuth.js";

/**
 * GuestRoute — wraps login / register / verify-email
 * - isLoading  → show spinner (prevents flash-redirect while /auth/me resolves)
 * - user found → redirect to dashboard (already logged in)
 * - no user    → render the guest page
 */
export default function GuestRoute() {
  const { data: user, isLoading } = useUser();
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-slate-950">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
