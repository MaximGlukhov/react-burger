import { createBrowserRouter } from 'react-router-dom';

import { App } from './components/app/app';
import { IngredientModal } from './components/ingredient-modal/ingredient-modal';
import { ProtectedRoute } from './components/protected-route/protected-route';
import { ErrorPage } from './pages/error-page/error-page';
import { FeedPage } from './pages/feed-page/feed-page';
import { ForgotPasswordPage } from './pages/forgot-password-page/forgot-password-page';
import { Home } from './pages/home/home';
import { LoginPage } from './pages/login-page/login-page';
import { ProfileForm } from './pages/profile-form/profile-form';
import { ProfileOrderPage } from './pages/profile-order-page/profile-order-page';
import { ProfilePage } from './pages/profile-page/profile-page';
import { RegisterPage } from './pages/register-page/register-page';
import { ResetPasswordGuard } from './pages/reset-password-guard/reset-password-guard';
import { ResetPasswordPage } from './pages/reset-password-page/reset-password-page';

export const routes = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        Component: Home,
        path: '/',
        children: [
          {
            path: 'ingredients/:id',
            Component: IngredientModal,
          },
        ],
      },

      {
        element: <ProtectedRoute reverse />,
        children: [
          {
            Component: RegisterPage,
            path: 'register',
          },
          {
            Component: LoginPage,
            path: 'login',
          },
        ],
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'profile',
            Component: ProfilePage,
            children: [
              {
                path: '',
                Component: ProfileForm,
              },
              {
                path: 'orders',
                Component: ProfileOrderPage,
              },
            ],
          },
          {
            Component: ForgotPasswordPage,
            path: 'forgot-password',
          },
          {
            element: <ResetPasswordGuard />,
            children: [
              {
                path: 'reset-password',
                Component: ResetPasswordPage,
              },
            ],
          },
        ],
      },

      {
        Component: FeedPage,
        path: 'feed',
      },
    ],
  },
]);
