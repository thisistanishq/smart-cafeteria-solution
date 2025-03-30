
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import { Loader } from './Loader';
import { useToast } from '@/hooks/use-toast';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export const RoleBasedRoute = ({
  children,
  allowedRoles,
  redirectTo = '/login'
}: RoleBasedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useApp();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Show access denied toast when redirected
    if (!isLoading && isAuthenticated && user && !allowedRoles.includes(user.role)) {
      toast({
        title: "Access Denied",
        description: `The ${location.pathname} area requires specific permissions.`,
        variant: "destructive"
      });
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, location.pathname, toast]);

  if (isLoading) {
    return <Loader text="Checking permissions..." />;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated, but remember where they were trying to go
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect inappropriate roles to home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
