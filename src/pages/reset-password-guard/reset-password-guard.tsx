import { Navigate, Outlet } from 'react-router-dom';

export const ResetPasswordGuard = (): React.JSX.Element => {
  const isAllowed = localStorage.getItem('forgot-password') === 'true';

  return isAllowed ? <Outlet /> : <Navigate to="/forgot-password" replace />;
};
