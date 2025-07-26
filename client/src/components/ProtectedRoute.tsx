import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      try {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
          setLocation('/admin/login');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setLocation('/admin/login');
      }
    };
  
    checkAuth();
  }, [setLocation]);

  // Check if we have userInfo
  const userInfo = localStorage.getItem('userInfo');
  
  // Return null during the redirect
  if (!userInfo) {
    return null;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;