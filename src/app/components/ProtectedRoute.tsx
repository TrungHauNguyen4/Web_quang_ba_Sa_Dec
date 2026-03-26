import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  roles?: string[]; // allowed roles, if omitted: any authenticated user
}

export const ProtectedRoute = ({ roles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  
  if (loading) {
     return (
      <div className="flex h-screen items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
     );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && (!user.role || !roles.includes(user.role))) {
    // Không đủ quyền: đưa về trang chủ công khai
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
