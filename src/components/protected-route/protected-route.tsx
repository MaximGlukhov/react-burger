import { useSelector } from '@/services/hooks';
import { getUser } from '@/services/slices/user/user';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

type TProtectedRouteProps = {
  reverse?: boolean;
  redirectTo?: string;
};

export const ProtectedRoute = ({
  reverse = false,
  redirectTo = reverse ? '/' : '/login',
}: TProtectedRouteProps): React.JSX.Element => {
  const user = useSelector(getUser);
  const location = useLocation();

  const shouldRedirect = reverse ? user : !user;

  if (shouldRedirect) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <Outlet />;
};
