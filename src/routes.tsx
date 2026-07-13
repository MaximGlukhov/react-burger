import { createHashRouter } from 'react-router-dom';

import { App } from './components/app/app';
import { IngredientModal } from './components/ingredient-modal/ingredient-modal';
import { OrderModal } from './components/order-modal/order-modal';
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

export const routes = createHashRouter([
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
        Component: FeedPage,
        path: 'feed',
        children: [
          {
            path: '/feed/:id',
            element: <OrderModal back={'/feed'} />,
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
                children: [
                  {
                    element: <OrderModal back={'/profile/orders/'} />,
                    path: ':id',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
