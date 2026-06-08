import { useGetUserQuery } from '@/services/slices/api/authApi';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { Outlet } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const token = localStorage.getItem('accessToken');

  const { isLoading } = useGetUserQuery(undefined, {
    skip: !token,
  });

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={`${styles.main} pl-5 pr-5`}>
        <Outlet />
      </main>
    </div>
  );
};

export default App;
